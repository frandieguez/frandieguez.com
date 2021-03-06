---
id: 603
title: Improve Munin stats page with new layout and plugins
date: 2010-03-24T17:39:58+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=603
permalink: /blog/2010/03/improve-munin-stats-page-with-new-layout-and-plugins/
dsq_thread_id:
  - "653955795"
categories:
  - System Administration
tags:
  - custom
  - layout
  - munin
  - plugin
---
When the  number of your servers is increasing more than you have expected, is a good practice to have a friend that  helps you track what's happenning on those.

For this I use, among other apps, Munin. Munin is a "networked resource monitoring tool that can help analyze resource trends and [...] problems" according to its site.

But this post isn't a howto-install guide but a how to personalize and extend munin to fit your requirements, just with a custom layout and new plugins.

## Layout

I don't like the default theme of munin. <span style="text-decoration: line-through;">There is an alternative template at [http://www.doeeng.com/](http://www.doeeng.com/) and a [live demo](http://www.doeeng.com/). There are detailed instructions to install and customize there so I won't touch it here.</span> Seems that original webpage is down so let me explain the installation process.

You can download a tarball containing the alternative template from [http://mabishu.com/downloads/munin-alternative-template.tbz](http://mabishu.com/downloads/munin-alternative-template.tbz)

For installing just move the `/etc/munin/templates` to `/etc/munin/templates_old`, extract this tarball in /etc/munin/ and verify that this creates a new template folder. Just a puntualization, for me is far better the "template-light" so you have to change the import in index.css to get it.

## Plugins

Is very simple to install plugins for munin. You only have to drop it on `/usr/share/munin/plugins` and after that make a symbolic link from /etc/munin/plugins to it. Fortunately, on Debian systems when you install munin and munin-node there is  some plugins installed. Indeed, that plugins would cover all your needs but if you need more you can install "munin-plugins-extra" and on Ubuntu Lucid you can install "[munin-libvirt-plugins](http://packages.ubuntu.com/lucid/munin-libvirt-plugins)"
and "[munin-java-plugins](http://packages.ubuntu.com/lucid/munin-libvirt-plugins)".

Additionally, Munin has
the [MuninExchange](http://muninexchange.projects.linpro.no) site that is a central point when all the users send their plugins to share with all with open licences. There is a lot of plugins but I have to highligth [Memcache plugin](http://muninexchange.projects.linpro.no/?search=&cid=7&os%5B4%5D=on&os%5B7%5D=on&os%5B3%5D=on&os%5B2%5D=on&os%5B5%5D=on&os%5B8%5D=on&os%5B1%5D=on&os%5B6%5D=on), [sshd\_log](http://code.google.com/p/monitordatasink/source/browse/trunk/plugins/sshd_log.sh?spec=svn84&r=84), and
[apache](http://muninexchange.projects.linpro.no/?search=&cid=1&os%5B4%5D=on&os%5B7%5D=on&os%5B3%5D=on&os%5B2%5D=on&os%5B5%5D=on&os%5B8%5D=on&os%5B1%5D=on&os%5B6%5D=on)
