---
id: 1686
title: Advanced Varnish cache purging
description: "Purge, ban and tag-based invalidation in Varnish 3 — why banning a regex does not free memory the way you think, and how surrogate keys turn a hundred invalidations into one."
publishDate: 2013-12-04T11:15:02+00:00
author: Fran Dieguez
layout: post
tags: ["caching", "performance", "web-servers", "sysadmin"]
guid: http://www.mabishu.com/?p=1686
permalink: /?p=1686
categories:
  - Uncategorized
---
Putting Varnish in front of an application is the easy part. A day's work gets you a cache that serves most of your traffic from memory and makes the graphs look extremely good.

The hard part starts the first time an editor changes a headline and phones you to ask why the front page still shows the old one.

Invalidation is where every cache stops being infrastructure and starts being application design, and Varnish gives you three mechanisms for it that behave quite differently. Knowing which one you are using matters, because two of them do not free any memory.

## Purge: one object, gone

The simplest case. You know the exact URL, and you want it out.

```vcl
acl purgers {
    "localhost";
    "10.0.0.0"/24;
}

sub vcl_recv {
    if (req.request == "PURGE") {
        if (!client.ip ~ purgers) {
            error 405 "Not allowed.";
        }
        return (lookup);
    }
}

sub vcl_hit {
    if (req.request == "PURGE") {
        purge;
        error 200 "Purged.";
    }
}

sub vcl_miss {
    if (req.request == "PURGE") {
        purge;
        error 200 "Purged (not in cache).";
    }
}
```

```bash
$ curl -X PURGE http://varnish/articles/123
```

The ACL is not optional. An open purge endpoint is a denial of service with a very low barrier to entry: anybody who can guess your URLs can empty your cache from a laptop.

Note that `vcl_miss` handles it too. Without that branch, purging something that is not cached returns a 404 from your backend, and any script looping over a list of URLs will treat that as a failure.

Purge is the only one of the three that actually removes the object and frees the storage immediately. It is also the one that is almost never enough, because you rarely know every URL an article appears on — the front page, the section page, three tag listings, the RSS feed, the AMP version, and the same set again for every variant of `Accept-Encoding`.

## Ban: a rule applied lazily

A ban does not delete anything. It adds an expression to a list, and every object is checked against that list when it is next looked up. Objects matching a ban newer than themselves are treated as misses.

```bash
$ varnishadm "ban req.url ~ ^/articles/"
```

Or over HTTP:

```vcl
sub vcl_recv {
    if (req.request == "BAN") {
        if (!client.ip ~ purgers) {
            error 405 "Not allowed.";
        }
        ban("req.url ~ " + req.http.X-Ban-Url);
        error 200 "Banned.";
    }
}
```

This is where the first real surprise lives, and it is the reason this post is titled the way it is.

**A ban does not free memory.** The objects stay in storage until something asks for them. Ban a thousand objects nobody requests again and you have a thousand objects occupying storage indefinitely, plus a ban expression that every future lookup has to evaluate.

The ban list is walked from newest to oldest for each object, so an application that bans aggressively accumulates a list that makes every single lookup slower. Varnish runs a *ban lurker* thread to go through old objects in the background and retire bans nobody needs any more — but it can only evaluate expressions that use `obj.*` fields, not `req.*` ones, because on a background sweep there is no request.

That gives you a rule worth writing on the wall:

:::caution
Write bans against `obj.http.*`, not `req.url`. A ban on `req.url` can never be lurker-evaluated, so it stays on the list forever and is re-checked on every lookup for the lifetime of the cache. It is the single easiest way to slowly strangle a Varnish instance that looks perfectly healthy.
:::

To make that possible, keep the URL on the object:

```vcl
sub vcl_fetch {
    set beresp.http.X-Url = req.url;
}

sub vcl_deliver {
    unset resp.http.X-Url;   # internal only
}
```

Then ban `obj.http.X-Url ~ "^/articles/"`, and the lurker can clean up after you.

## Tags: the one that scales

Neither of the above answers the real question, which is not "which URLs changed" but "which pages contained article 123".

The application knows that. The cache does not. So have the application tell it, on the way out, by tagging each response with the identifiers of everything it contains:

```php
<?php
header('X-Cache-Tags: article-123 section-sports author-42 homepage');
```

Keep them on the object, strip them before delivery:

```vcl
sub vcl_fetch {
    set beresp.http.X-Cache-Tags = beresp.http.X-Cache-Tags;
}

sub vcl_deliver {
    unset resp.http.X-Cache-Tags;
}
```

Now invalidating an article is one ban, regardless of how many pages it appeared on:

```bash
$ varnishadm 'ban obj.http.X-Cache-Tags ~ "(^| )article-123( |$)"'
```

It uses `obj.http.*`, so the lurker can retire it. And it is a single expression rather than one per URL, which keeps the ban list short.

The `(^| )` and `( |$)` matter. A naive `~ "article-12"` also matches `article-123` and `article-1234`, and you will not notice until somebody invalidates a hundred times more than they meant to.

## Grace: the part that saves you

None of this helps if invalidation means every one of those requests hits your backend at once. Grace mode serves stale content while the refresh happens in the background:

```vcl
sub vcl_recv {
    set req.grace = 6h;
}

sub vcl_fetch {
    set beresp.grace = 6h;
}
```

The object is kept for six hours past its TTL. Within that window, a request for a stale object gets the stale copy immediately and triggers one background fetch, rather than a thundering herd of identical requests.

This is what turns a backend outage from an outage into a delay. It is also, in my experience, the single highest-value line of VCL most people have not written.

## What I would actually do

Purge when you know the exact URL and want the memory back now. Ban against `obj.http.*` for patterns. Tag everything, because the application is the only thing that knows what a page is made of, and asking it is cheaper than teaching the cache.

And measure the ban list. `varnishstat` reports `n_ban` and `n_ban_gone`; if the first is growing and the second is not, your bans are not lurker-friendly and the cache is getting slower every day in a way that no graph will point at directly.

Further reading: Kristian Lyngstøl's [Varnish purges](http://kly.no/posts/2010_02_02__Varnish_purges__.html) is still the clearest explanation of the purge/ban distinction, and the IETF's [linked cache invalidation draft](http://tools.ietf.org/html/draft-nottingham-linked-cache-inv-03) is the standards-track attempt at the same problem tags solve by convention.
