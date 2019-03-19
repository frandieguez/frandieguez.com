---
id: 243
title: Drupal + LighttpD + URL limpias
date: 2008-01-22T22:18:29+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2008/01/22/drupal-lighttpd-url-limpias/
permalink: /blog/2008/01/drupal-lighttpd-url-limpias/
dsq_thread_id:
  - "655370763"
categories:
  - System Administration
  - Web
tags:
  - drupal
  - lighttpd
  - url limpia
---
No sabeis el trabajiño que me dio solventar el problema de las URLs limpias con el binomio Drupal, Lighttpd. Como no soi de mucha falacia os enseño el código que tenéis que pegar dentro de /etc/lighttpd.conf o dentro del archivo de configuración de cara slide virtual.

<pre lang="shell">$HTTP["host"] =~ "^(slide.dominio.com)$" {
server.document-root = "/var/www/host-virtual"
url.rewrite-final = (
"^/system/test/(.*)$" =&gt;  "/index.php?q=system/test/$1",
"^/([^.?]*)\?(.*)$" =&gt; "/index.php?q=$1&amp;$2",
"^/([^.?]*)$" =&gt; "/index.php?q=$1",
"^/search/node/(.*)$" =&gt; "/index.php?q=search/node/$1"
)
}</pre>
Espero de sea de buen provecho.