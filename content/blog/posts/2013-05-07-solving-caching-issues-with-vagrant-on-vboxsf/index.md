---
id: 1550
title: Solving caching issues with Vagrant on vboxsf
date: 2013-05-07T19:59:41+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1550
permalink: /blog/2013/05/solving-caching-issues-with-vagrant-on-vboxsf/
dsq_thread_id:
  - "1270047519"
categories:
  - System Administration
tags:
  - tricks
# featuredImage: "../assets/2013/05/vagrant_header_background-482a12a7.png"
---
Since some months I've been working with <a title="Vagrant project web site" href="vagrantup.com">Vagrant</a> as a tool for provisioning my production-like environment to develop <a title="Opennemas, the CMS for your online newspaper" href="http://www.opennemas.com">Opennemas</a>. Vagrant is a really powerful tool for automating the creation of environment that mimic your production stack without having to deal with configuration files.

In fact this task, automatic provisioning machines, was one of the most important tasks in order to reduce our technical debt. But anyway, let's move to the topic of this article.

We use Ubuntu OS as a guest VM provisioned by Vagrant+Virtualbox and we share our project code with the guest machine through <a href="https://help.ubuntu.com/community/VirtualBox/SharedFolders">vboxsf</a>. Inside that machine, among the rest of the stack, it's running Nginx (but this issue will be present regardless the web server you are running).<!--more-->
### The problem
<strong></strong>If you have a Linux guest OS, and your web server document root is in a shared folder using vboxsf, after modifying a static file of that folder from outside of the virtual machine you will see that those changes will not be applied, instead of that you will see a bunch of weird symbols accompanied of zero-length responses to non-zero-sized files.
### The solution
This issue is due to a partial implementation of the vbox file system and how web servers interact with the  guest file system. So if you want to solve this issue you have to add to your virtualhost configuration files the next directive:

For nginx:
```
sendfile off;
```
For Apache:
```
EnableSendfile off
```
### The explanation
Quite weird and annoying issue. I spent some time digging into the configuration files of my vagrant setup, nginx server, host file system, reviewing browser cache, ... and finally I found some links that helped me to solve the issue (see them below).

The problem is that the server serving the static files is using the "sendfile()" syscall, which is broken with the VirtualBox file system. You need to disable sendfile() usage in your server.

References:
* <a href="http://stackoverflow.com/questions/9479117/vagrant-virtualbox-apache2-strange-cache-behaviour">http://stackoverflow.com/questions/9479117/vagrant-virtualbox-apache2-strange-cache-behaviour</a>
* <a href="https://groups.google.com/forum/?fromgroups=#!topic/vagrant-up/7RgBxo6EksQ">https://groups.google.com/forum/?fromgroups=#!topic/vagrant-up/7RgBxo6EksQ</a>
* <a href="https://forums.virtualbox.org/viewtopic.php?f=3&amp;t=1940&amp;p=6680&amp;hilit=shared+folder+apache">https://forums.virtualbox.org/viewtopic.php?f=3&amp;t=1940&amp;p=6680&amp;hilit=shared+folder+apache</a>