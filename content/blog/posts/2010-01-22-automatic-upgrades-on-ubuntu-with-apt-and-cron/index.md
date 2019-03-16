---
id: 564
title: Automatic upgrades on Ubuntu with apt and cron
date: 2010-01-22T15:17:16+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=564
permalink: /blog/2010/01/automatic-upgrades-on-ubuntu-with-apt-and-cron/
dsq_thread_id:
  - "654641261"
categories:
  - System Administration
  - Uncategorized
tags:
  - apt
  - cron
  - crontab
  - debian
  - Linux
  - ubuntu
  - upgrade
---
If you want to get automatic upgrades of your personal repositories I haven't find a way to get managed with unattended-upgrades so I have done the next workarround.

This way is to use apt-get and crontab together, so open your crontab editor:
<pre>sudo crontab -e</pre>
And type the next line to execute our upgrade every night at 1AM:
<pre>0 1 * * * (/usr/bin/aptitude -y update &amp;&amp; /usr/bin/aptitude -y safe-upgrade) 2&gt;&amp;1 &gt;&gt; /var/log/auto_update.log</pre>
Save and exit your editor, and you are all set! You could check the logfile: <em>/var/log/auto_update.log</em> every once in a while to see if everything is still running smoothly.

Note: If you have a solution to get to work unattended-upgrades package with custom repositories please fill a comment below.