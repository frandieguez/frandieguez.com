---
id: 1717
title: Harvening SSL encryption in an nginx server
date: 2014-12-17T00:55:53+00:00
author: Fran Diéguez
layout: post
published: false
draft: true
guid: http://www.mabishu.com/?p=1717
permalink: /?p=1717
categories:
  - Uncategorized
---
Due to latest SSL protocol security bugs it is recommended to disable it at all.

https://www.ssllabs.com/ssltest/analyze.html?d=manager.staging.opennemas.com&amp;hideResults=on&amp;ignoreMismatch=on
<pre>ssl on;
ssl_certificate /usr/share/nginx/conf/server.crt;
ssl_certificate_key /usr/share/nginx/conf/server.key;
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";</pre>
