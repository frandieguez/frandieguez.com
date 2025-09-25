---
id: 506
title: Using Memcache server as Apache content cache
description: Using Memcache server as Apache content cache
publishDate: 2009-12-08T00:01:57+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=506
permalink: /blog/2009/12/using-memcache-server-as-apache-content-cach/
dsq_thread_id:
  - "653692338"
categories:
  - System Administration
tags:
  - apache
  - cache
  - integration
  - memcache
  - server
---
With memcached and mod_memcache_cache we can use the memcached server as a content cache. This allows us share content of cache between different servers.

Into Apache is available the mod_cache module, that allows to realice this task throw different storage modules. Apache has 2 built in:

- mod_disk_cache: stores and fetchs cached content in hard disk
- mod_mem_cache: cache's data in the running httpd process memory

But at this article I want to introduce
[mod_memcache_cache](http://code.google.com/p/modmemcachecache/ "Google Code - mod_memcache_cache"),
that uses an [memcached](http://memcached.org/ "Memcache web site")
server to store data, so the available memory is the sum of all the
nodes this daemon has. Thus, by increasing the memory size of Memcached
server, Apache will has more memory to cache contents. The main topic is
that this Memcache server can be placed on other machine with a lot of
memory and serving contents to more than 1 server, acting as a central
repository of cached content listening to clients that want to store
something in key-value structure.

I assume you have an memcached server listening on port 11211 on the same machine so let's install all the stack to test. First of all we need to have installed Apache 2.2 with mod_cache installed. So download the apache 2.2 source code and compile it with the next steps:

```
./configure --prefix=/usr/local/apache22 \
            --exec-prefix=/usr/local/apache22 \
            --enable-so G--enable-rewrite --enable-cache
make && make install
```

mod_memcached_cache uses apr_memcache routines for interacting with memcached servers. apr_memcache is included in newer development branches of APR-Util, but is not available in the current released versions. So let me install the apr_memcache library from source code:

```
# wget http://www.outoforder.cc/downloads/apr_memcache/apr_memcache-0.7.0.tar.bz2
# tar xvjf apr_memcache-0.7.0.tar.bz2 && cd  apr_memcache-0.7.0/
# ./configure --with-apr=/usr/local/apache22/ \
              --with-apr-util=/usr/local/apache22/ \
              --prefix=/usr/local/ \
              --exec-prefix=/usr/local/
# make && make install
```

We can now install the memcache module so:

```
wget http://modmemcachecache.googlecode.com/files/mod_memcached_cache-0.1.0.tar.bz2
tar xvzf mod_memcached_cache-0.1.0.tar.bz2 && cd mod_memcached_cache-0.1.0
CFLAGS="-I/usr/local/src/httpd-2.2.9/modules/cache/" \
./configure --with-apxs=/usr/local/apache22/bin/apxs \
            --with-apr-memcache=/usr/local/
make && make install
```

Finally we must include into our Virtualhost the next configurations to use the apache's memcache module

```
LoadModule memcached_cache_module modules/mod_memcached_cache.so
<IfModule mod_memcached_cache.c>
        CacheEnable memcached /
        MemcachedCacheServer localhost:11211
        MemcachedMaxServers 10
        MemcachedMinConnections 10
        MemcachedSMaxConnections 10
        MemcachedMaxConnections 10
        MemcachedConnectionTTL 10
        MemcachedCacheMinFileSize 1
        MemcachedCacheMaxFileSize 2097152

        CacheDisable /admin/
</IfModule></pre>
