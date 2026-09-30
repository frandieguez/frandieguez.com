---
id: 1537
title: PHP as node.js
description: "ReactPHP puts an event loop in a language whose entire ecosystem assumes there isn't one. A look at what works, what a single blocking call does to it, and the narrow set of jobs it is actually right for."
publishDate: 2013-04-20T21:52:28+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["php", "javascript", "web-servers", "performance"]
guid: http://www.mabishu.com/?p=1537
permalink: /?p=1537
categories:
  - Uncategorized
---
Node.js has spent the last couple of years being the answer to a question PHP developers were not allowed to ask: what if the process stayed up and handled more than one thing at a time?

[ReactPHP](http://reactphp.org/) is that question asked in PHP anyway. It is an event loop, non-blocking I/O, and the same callback-driven shape as node, in a language whose entire ecosystem assumes there is no loop and no next request.

A server is about fifteen lines:

```php
<?php
require 'vendor/autoload.php';

$loop   = React\EventLoop\Factory::create();
$socket = new React\Socket\Server($loop);
$http   = new React\Http\Server($socket);

$http->on('request', function ($request, $response) {
    $response->writeHead(200, array('Content-Type' => 'text/plain'));
    $response->end("Hello\n");
});

$socket->listen(1337);
$loop->run();
```

That is a web server. No Apache, no FPM, no `mod_php` — one PHP process holding the socket, and `$loop->run()` never returning. If you have spent a decade with a request lifecycle that ends in `exit`, the last line is genuinely strange to look at.

Timers work the way you would expect:

```php
<?php
$loop->addPeriodicTimer(5, function () {
    echo 'still here: ' . memory_get_usage(true) . PHP_EOL;
});
```

I would keep that one. See below.

## Where it stops being a curiosity

The convincing use is not HTTP — Apache and nginx are very good at HTTP — it is the thing the request lifecycle genuinely cannot do: a connection that stays open.

[Ratchet](http://socketo.me/) is WebSockets built on top of React, and it is the most compelling argument in this whole post:

```php
<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        foreach ($this->clients as $client) {
            if ($client !== $from) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $conn->close();
    }
}
```

Before this, doing that in PHP meant long-polling, and long-polling meant one FPM worker held hostage per waiting client. A hundred idle users could exhaust a pool sized for a thousand real requests. Ratchet holds those hundred connections in one process, in one loop, and each of them costs a socket and an entry in an `SplObjectStorage`.

That is a real capability that PHP did not have, on the same servers and in the same language as everything else you already run.

## The part that will bite you

Now the honest half, because "PHP as node" hides a difference that matters more than the similarity.

Node is non-blocking because its entire library is. PHP is non-blocking only where ReactPHP has specifically made it so — and that is a small island in a very large ecosystem that was written on the assumption that blocking is free, because the process was going to die in 200ms anyway.

So this looks fine and is not:

```php
<?php
$http->on('request', function ($request, $response) {
    // Blocking. The loop stops. Every other connection waits.
    $rows = $pdo->query('SELECT * FROM big_table')->fetchAll();

    $response->end(json_encode($rows));
});
```

One `PDO` call, one `file_get_contents()` against a slow URL, one `sleep()`, and the loop is frozen for every connected client. In a traditional PHP app a slow query costs one worker out of fifty. Here it costs everybody. The failure mode is not "this request is slow", it is "the server stopped".

And the callback style, in a PHP without closures binding `$this` cleanly before 5.4 and without generators before 5.5, gets deep fast:

```php
<?php
$client->get($url, function ($body) use ($db, $response) {
    $db->query($sql, function ($rows) use ($response) {
        $cache->set($key, $rows, function () use ($response) {
            $response->end('done');
        });
    });
});
```

Node has the same problem and a decade of libraries built to manage it. PHP in 2013 has neither.

## Memory

A PHP process that lives for milliseconds can be careless with memory and never pay for it. A PHP process that lives for weeks pays for all of it. Some of that is circular references the collector will get to eventually and some of it is in extensions where it will not.

This is why the periodic timer printing `memory_get_usage()` earns its place. Not as instrumentation — as a habit. Leave one of these running over a weekend before you trust it with anything real; that single experiment says more than the documentation does.

The practical answer is the same one that applies to any long-running PHP: make the process deliberately mortal. Bound it by uptime or by requests served, exit cleanly, and let supervisord start a fresh interpreter.

## So: is PHP node.js?

No, and the interesting part is *why* not.

Node's advantage was never the event loop as an idea. It was that the language was born with one, so every library in it is non-blocking by default and nobody has to think about which calls are safe. ReactPHP gives PHP the loop without giving it the ecosystem, and the ecosystem is where the value was.

What it is genuinely good for is a narrow and real set of jobs: WebSockets, long-lived connections, a small internal service that speaks a custom protocol, a queue consumer that would otherwise be a cron job running every minute. Things where the alternative is not "PHP-FPM", it is "write it in something else and now you maintain two languages".

Where I would not put it is in front of your application. Nginx and FPM are boring and they will still be working in five years, which for the thing serving your site is the entire specification.

Worth reading alongside this: [Playing with ReactPHP](http://www.hashbangcode.com/blog/playing-reactphp-681.html), which goes further into the loop internals than I have here.
