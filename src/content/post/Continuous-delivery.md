---
id: 1333
title: Continuous delivery
description: "Continuous integration tells you the build is green. Continuous delivery is the much harder promise that it could ship right now — and the practices that make the difference are mostly not about the build server."
publishDate: 2013-03-07T16:57:24+00:00
author: Fran Dieguez
layout: post
published: false
draft: true
tags: ["continuous-integration", "devops", "testing", "databases"]
guid: http://www.mabishu.com/?p=1333
permalink: /?p=1333
categories:
  - Uncategorized
---
We have had Jenkins for years. Every commit is built, the test suite runs, the linters run, and a red build gets fixed quickly because nobody likes being the one who broke it.

That is continuous integration, and it answers a narrow question: does the code on master compile and pass its tests?

Continuous delivery answers a much larger one: **could we put this build in front of users right now, and would we know within minutes if that was a mistake?** Getting from the first answer to the second turned out to have very little to do with the build server.

## One artefact, built once

The first thing we had wrong was building per environment. Staging built from master, production built from a tag, and both ran their own `composer install` on the target machine.

Which meant the thing we tested was never the thing we shipped. A dependency releasing a patch between the two builds is enough to make them different, and that is exactly the kind of difference that produces a bug reproducible only in production.

Build once, into an immutable artefact, and promote *that* file through the environments:

```bash
#!/bin/bash
set -euo pipefail

VERSION=$(git rev-parse --short HEAD)
BUILD="build/myapp-${VERSION}"

rm -rf "$BUILD" && mkdir -p "$BUILD"
git archive HEAD | tar -x -C "$BUILD"

cd "$BUILD"
composer install --no-dev --optimize-autoloader --prefer-dist
echo "$VERSION" > VERSION
cd -

tar czf "build/myapp-${VERSION}.tar.gz" -C build "myapp-${VERSION}"
```

The tarball goes to staging. If staging is happy, *the same tarball* goes to production. Nothing is rebuilt, nothing is re-resolved, and "works on staging" starts to mean something.

## Configuration lives outside the artefact

The corollary: if the artefact is identical everywhere, nothing environment-specific can be inside it. Database credentials, API endpoints, debug flags — all of it comes from the machine, not from the tarball.

```php
<?php
return array(
    'db' => array(
        'host'     => getenv('DB_HOST') ?: 'localhost',
        'name'     => getenv('DB_NAME'),
        'user'     => getenv('DB_USER'),
        'password' => getenv('DB_PASSWORD'),
    ),
    'debug' => getenv('APP_DEBUG') === '1',
);
```

This is also what finally kills the `config.production.php` file that somebody edits on the server and nobody ever commits back.

## The database is the hard part

Code rolls back. Schema does not, and pretending otherwise is how a rollback becomes an outage.

The practice that makes deployment routine is making every migration backwards compatible with the currently deployed code — which means splitting what feels like one change into several deploys:

1. Add the new column, nullable. Deploy. Old code ignores it.
2. Deploy code that writes to both old and new columns.
3. Backfill the existing rows.
4. Deploy code that reads from the new column.
5. Drop the old column, some deploys later.

It is five steps where there used to be one, and every step is individually reversible. The first time you roll back a deploy at 6pm without anybody noticing, the extra work stops feeling like overhead.

## Deployments that can be undone in one command

Symlink switching, which is what Capistrano popularised and what we ended up reimplementing anyway:

```
/var/www/myapp/
  releases/
    a3f91c2/
    b7d0e41/
    c1e8f09/
  current -> releases/c1e8f09
  shared/
    uploads/
    logs/
```

Unpack into a new directory, run migrations, warm the caches, then move the symlink and reload PHP-FPM. The switch is atomic, and rolling back is pointing the symlink at the previous directory — a second or two, not a rebuild.

Keep five releases. Disk is cheaper than the conversation about which version was running an hour ago.

## Smoke tests after the switch

Every deployment ends by asking the running application whether it is alive, from outside:

```bash
#!/bin/bash
set -euo pipefail

BASE=${1:-https://staging.example.com}

for path in / /login /api/health; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "${BASE}${path}")
    if [ "$code" != "200" ]; then
        echo "FAIL ${path} returned ${code}" >&2
        exit 1
    fi
done

deployed=$(curl -s "${BASE}/api/health" | grep -o '"version":"[^"]*"')
echo "OK — ${deployed}"
```

A `/api/health` endpoint that reports the deployed version and checks its database connection is about twenty lines of application code, and it is the difference between "the deploy script exited 0" and "the application is serving requests".

## What it actually cost

Not the tooling. Jenkins was already there and the deploy script is a hundred lines of bash.

It cost the habit of long-lived branches, because a branch that lives a fortnight cannot be delivered continuously by definition. It cost the idea that a release is an event with a meeting attached. And it cost real work on the migration discipline above, which is the only part of this I would call genuinely difficult.

What it bought is that deploying stopped being a decision. When shipping is a fifteen-minute ceremony you batch changes to amortise it, batches are riskier, risk justifies more ceremony, and the loop tightens until you release monthly and every release is frightening. Make it two minutes and reversible and the loop runs the other way.

Luis Atencio's [notes on continuous delivery](http://www.luisatencio.net/2013/02/continuous-delivery-notes-on.html) cover the theory more thoroughly than I have here; this is mostly what survived contact with our own servers.
