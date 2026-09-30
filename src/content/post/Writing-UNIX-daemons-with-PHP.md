---
id: 1110
title: 'Command line tools written with PHP (III): writing UNIX daemons'
description: "Forking, detaching from the terminal, PID files and signal handling in PHP — plus an honest look at the one problem the language does not let you solve, and what to do about it."
publishDate: 2013-01-09T20:30:00+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["php", "terminal", "linux", "sysadmin"]
guid: http://www.mabishu.com/?p=1110
permalink: /?p=1110
categories:
  - Uncategorized
seriesId: php-cli-tools
orderInSeries: 3
---
The two previous posts were about tools that start, do something and exit. This one is about the ones that do not exit.

A daemon is a process with three properties: it has no controlling terminal, so closing the shell that started it does not kill it; it is not in any terminal's foreground process group, so Ctrl-C does not reach it; and it keeps running. PHP can do all three. Whether it *should* is a question I will come back to at the end, because the honest answer is "sometimes".

## Detaching

The standard incantation is a double fork, and both forks are there for a reason.

```php
<?php
if (!extension_loaded('pcntl')) {
    fwrite(STDERR, 'The pcntl extension is required.' . PHP_EOL);
    exit(1);
}

// First fork: the parent exits, so the shell gets its prompt back and the
// child is orphaned onto init.
$pid = pcntl_fork();
if ($pid === -1) {
    die('Could not fork');
} elseif ($pid) {
    exit(0);
}

// New session. This is what actually detaches us from the controlling
// terminal, and it makes this process a session leader.
if (posix_setsid() === -1) {
    die('Could not detach from terminal');
}

// Second fork: a session leader can acquire a controlling terminal just by
// opening one. After this fork we are no longer a session leader, so we
// cannot accidentally get a terminal back.
$pid = pcntl_fork();
if ($pid === -1) {
    die('Could not fork');
} elseif ($pid) {
    exit(0);
}

chdir('/');
umask(0);
```

The second fork is the part everybody skips, and skipping it works right up until the day it does not.

`chdir('/')` matters more than it looks: without it the daemon holds the directory it was started from, and that directory cannot be unmounted while your process is alive. Somebody will eventually try to unmount it and blame the filesystem.

## Closing the standard streams

The daemon still holds the terminal's file descriptors. Anything it writes goes to a terminal that may no longer exist, and when it does not, the write fails.

```php
<?php
fclose(STDIN);
fclose(STDOUT);
fclose(STDERR);

$stdin  = fopen('/dev/null', 'r');
$stdout = fopen('/var/log/mydaemon.log', 'ab');
$stderr = fopen('/var/log/mydaemon.log', 'ab');
```

Reopen them, in that order, rather than just closing them. Descriptors 0, 1 and 2 get reused by the next thing that opens a file, and a library that writes to what it believes is stdout will then write into your database socket. Pointing them at `/dev/null` and a log file costs nothing and removes the whole class of problem.

## The PID file

A PID file is how everything else — init scripts, monitoring, you at 3am — finds the process.

```php
<?php
$pidFile = '/var/run/mydaemon.pid';

if (file_exists($pidFile)) {
    $oldPid = (int) trim(file_get_contents($pidFile));

    // Signal 0 performs the permission and existence checks without sending
    // anything. This is the only reliable way to ask "is that PID alive?".
    if ($oldPid > 0 && posix_kill($oldPid, 0)) {
        fwrite(STDERR, "Already running as PID $oldPid" . PHP_EOL);
        exit(1);
    }

    // Stale file from a process that died without cleaning up.
    unlink($pidFile);
}

file_put_contents($pidFile, posix_getpid());
```

The stale-file case is not an edge case, it is the normal case after a crash or a `kill -9`. A daemon that refuses to start because of a PID file belonging to a process that died three days ago is a daemon somebody will delete.

## Signals

An unhandled `SIGTERM` kills the process wherever it happens to be, which for a daemon halfway through a database write is the worst possible moment.

```php
<?php
declare(ticks = 1);

$running = true;

function handleSignal($signal)
{
    global $running;

    switch ($signal) {
        case SIGTERM:
        case SIGINT:
            $running = false;   // finish the current unit of work, then stop
            break;
        case SIGHUP:
            reloadConfiguration();
            break;
    }
}

pcntl_signal(SIGTERM, 'handleSignal');
pcntl_signal(SIGINT,  'handleSignal');
pcntl_signal(SIGHUP,  'handleSignal');

while ($running) {
    processOneBatch();
    sleep(5);
}

unlink('/var/run/mydaemon.pid');
```

`declare(ticks = 1)` is what makes this work at all on PHP 5.3: without it the handlers are registered and never called, because PHP only dispatches signals at tick boundaries. It is also a real cost — the engine runs its tick handler after almost every statement. On 5.4 you can drop the ticks and call `pcntl_signal_dispatch()` explicitly once per loop instead, which is both faster and easier to reason about, since you know exactly where in the loop a signal can be handled.

Setting a flag rather than exiting inside the handler is the point of the whole section. It turns "stop now, wherever you are" into "stop at the next safe boundary".

:::caution
`SIGKILL` cannot be caught, by design. Everything above is about being a good citizen when someone sends `SIGTERM`; none of it saves you from `kill -9`. That is an argument for making every unit of work idempotent, not for trying harder in the handler.
:::

## The part PHP does not do well

Now the honest bit.

PHP was built to handle a request and die. That lifecycle is what lets it be as forgiving as it is about memory: a leak that lasts 200ms is not a leak, it is a rounding error. Take away the dying and you keep the forgiveness without the cleanup.

In practice that means three things. Long-running PHP processes grow, and some of that growth is in extensions where `gc_collect_cycles()` cannot reach. A fatal error takes down a process that is supposed to be permanent. And the code you deploy is the code that stays loaded — no APC invalidation is going to update a daemon that has been running for a fortnight.

None of this makes a PHP daemon a bad idea. It makes an *immortal* PHP daemon a bad idea. What works is a process that is deliberately mortal:

```php
<?php
$start = time();
$processed = 0;

while ($running && $processed < 1000 && (time() - $start) < 3600) {
    processOneBatch();
    $processed++;
}

// Exit cleanly. Supervision restarts us with a fresh interpreter.
```

Then let something else own the restarting. In 2013 that means supervisord or upstart, and either of them does the job better than the fork-and-PID-file dance above — which is also the reason to understand that dance rather than to ship it. Supervisord in particular wants your process to stay in the *foreground*, so it can watch it, which means the first two thirds of this post become code you delete.

That is the conclusion I did not expect when I started writing this series: the best PHP daemon is a foreground script with a bounded lifetime, supervised by something written in a language that was designed to run forever.

If the work is really a queue, look at Gearman or at the AMQP extension before writing any of this. A worker that pulls one job, does it and exits is a daemon in the only sense that matters, and it is about fifteen lines.
