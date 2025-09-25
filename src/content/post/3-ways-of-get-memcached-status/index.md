---
id: 616
title: 3 ways of get memcached status
publishDate: 2010-06-01T23:38:04+00:00
description: If you use memcached to cache contents among different servers and apps, and you want to get statistics for what is happening inside the memcached-sever you can use one of the available interfaces for programming languages but there are simpler ways to do that.
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=616
permalink: /blog/2010/06/3-ways-of-get-memcached-status/
dsq_thread_id:
  - "653939758"
categories:
  - System Administration
  - Uncategorized
tags:
  - memcache
  - memcached
  - status
---
If you use **memcached** to cache contents among different servers and
apps, and you want to get statistics for what is happening inside the
memcached-sever you can use one of the available interfaces for
programming languages but there are simpler ways to do that. The best
way is use the command line because the simple protocol that memcached
has. You can use the netcat to "inject" the command "stats" into the
memcached server, that is listening at 11211 port by default:
```
$ echo "stats" | nc 127.0.0.1 11211
STAT pid 909
STAT uptime 8131
STAT time 1275417414
STAT version 1.4.2
STAT pointer_size 32
STAT rusage_user 0.016001
STAT rusage_system 0.020001
STAT curr_connections 5
STAT total_connections 8
STAT connection_structures 6
STAT cmd_get 0
STAT cmd_set 0
STAT cmd_flush 0
STAT get_hits 0
STAT get_misses 0
STAT delete_misses 0
STAT delete_hits 0
STAT incr_misses 0
STAT incr_hits 0
STAT decr_misses 0
STAT decr_hits 0
STAT cas_misses 0
STAT cas_hits 0
STAT cas_badval 0
STAT bytes_read 18
STAT bytes_written 1457
STAT limit_maxbytes 6710886
STAT accepting_conns 1
STAT listen_disabled_num 0
STAT threads 4
STAT conn_yields 0
STAT bytes 0
STAT curr_items 0
STAT total_items 0
STAT evictions 0
END
```
But you can use the "watch" command to execute the previous order.
Here's an easy "top" emulator for memcached:
```bash
watch "echo stats | nc 127.0.0.1 11211"
```
If you don't have netcat (nc), you can use one of the libraries
available for a lot of languages. Here is a simple example with PHP and
php5-memcached:
```bash
watch 'php -r '"'"'$m=new Memcache;$m->connect("127.0.0.1", 11211);print_r($m->getstats());'"'"
```
I hope you've enjoy this tips
