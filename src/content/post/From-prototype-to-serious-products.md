---
id: 1745
title: From prototype to serious products
description: "The gap between something that works and something you can be responsible for is not features. It is backups you have restored, deploys you can undo, logs that survive the crash, and alerts that reach a human."
publishDate: 2015-01-13T15:11:53+00:00
author: Fran Dieguez
layout: post
tags: ["devops", "monitoring", "sysadmin", "testing"]
categories:
  - Uncategorized
---
There is a [Hacker News thread](https://news.ycombinator.com/item?id=8862542) I keep going back to, where somebody asks what it takes to run a side project seriously and a commenter answers with a checklist. The line that stuck with me was the reassuring one — "the most difficult thing is going to be getting to 10K active users" — because it is true and it is also the part everybody already knows.

The list underneath it was the useful half. This is my version of that list, from the side of it where the pager goes off.

The premise worth stating first: capacity is not your problem. RAM is cheap, SSDs are cheap, and a small instance will carry more users than you expect for longer than you expect. What separates a prototype from something you can be responsible for is not how much load it survives. It is what happens on the day it does not.

## Backups you have actually restored

Everyone has backups. Far fewer people have restores, and the difference between those two words is where the outages live.

A backup you have never restored is a hypothesis. The usual failure is not the backup missing — it is the backup being subtly useless: a `mysqldump` that has been silently truncating for weeks because the cron user lost a permission, an archive rotating so fast the corruption predates every copy you hold, or an encrypted blob whose key was only ever on the machine that died.

So the practice is not "take backups". It is: restore one, on a different machine, on a schedule, and have the restore script be the thing that is tested.

```bash
#!/bin/bash
set -euo pipefail

LATEST=$(ls -t /backups/db-*.sql.gz | head -1)

mysql -e 'DROP DATABASE IF EXISTS restore_test; CREATE DATABASE restore_test;'
gunzip -c "$LATEST" | mysql restore_test

COUNT=$(mysql -N -e 'SELECT COUNT(*) FROM restore_test.users;')
if [ "$COUNT" -lt 1 ]; then
    echo "Restore produced an empty users table from ${LATEST}" >&2
    exit 1
fi

echo "OK — ${COUNT} users restored from ${LATEST}"
```

Run it weekly and let it shout. The row-count assertion is what makes it a test rather than a ritual: a restore that completes without error and gives you an empty database exits 0 without it.

## Deploys you can undo

Deployment is not the risky part. Deployment you cannot reverse is the risky part.

One command to ship, one command to go back. Capistrano or Fabric if you want it off the shelf; a symlink switch and a hundred lines of bash if you do not. What matters is that "put it back" takes seconds and does not require thinking, because you will need it at the exact moment you are least able to think clearly.

The database is the asterisk, as always. Schema does not roll back with the code, so a migration that drops a column turns a reversible deploy into an irreversible one. Add columns in one release, start writing to them in the next, stop reading the old ones in a third, and drop them long after. It is tedious and it is what makes the rollback real.

## Logs, and somewhere for them to go

When something breaks, logs are the only account of what happened. Two things routinely make them useless at the moment they are needed.

The first is disk. Unrotated logs fill the partition, and a full disk on a small instance takes down the database, the application and the logging at once, which is a spectacular way to have no record of the thing that started it.

```
/var/log/myapp/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

The second is that they are on the machine that died. Ship them somewhere else — anywhere else. Papertrail, Loggly, or an rsyslog target on another box. The first outage where you can read the logs of a machine you cannot ssh into pays for it.

And log the request identifier on every line. Without something to correlate on, a log from a busy application is a hundred interleaved stories with no way to follow any of them.

## Alerts that reach a person

Monitoring nobody looks at is a dashboard. The distinction that matters is whether it can wake you up.

Pingdom or Uptime Robot from outside, checking the thing your users actually do rather than whether the port is open. A health endpoint that touches the database is worth twenty checks of `/`:

```php
<?php
// /api/health
try {
    $pdo->query('SELECT 1');
} catch (PDOException $e) {
    http_response_code(503);
    exit(json_encode(array('status' => 'db_unreachable')));
}

echo json_encode(array('status' => 'ok', 'version' => trim(file_get_contents(__DIR__ . '/../VERSION'))));
```

Then alert on disk, on certificate expiry, and on the backup script above failing. Certificate expiry in particular: it is the outage that is fully predictable a year in advance and still takes sites down every week.

Be ruthless about what pages you. An alert that fires spuriously twice a week trains you to ignore it, and it will be ignored on the night it is right.

## Security, briefly

Key-based ssh only, no password authentication, no root login. Unattended upgrades for security patches. A firewall that denies by default. Password hashing with bcrypt via `password_hash()`, which since 5.5 removes every excuse anyone had.

None of this is interesting, which is the point. It is a checklist, it takes an afternoon, and it closes the attacks that are actually automated and pointed at you right now.

## Tests, eventually

I am not a test-driven developer and I am not going to pretend otherwise. But there is a threshold — somewhere around the point where you can no longer hold the whole system in your head — past which manual testing stops scaling and you find out about regressions from users.

Start writing them once the product idea is validated. Before that you are testing something you are about to delete. After it, the absence compounds.

## What this list is really about

Reading it back, none of it is about handling more users. It is all about the same thing: shortening the distance between something going wrong and you finding out, and shortening the distance between finding out and being able to undo it.

That is the whole difference between a prototype and a product. Not features, and not scale — just how quickly you notice, and whether you can go back.
