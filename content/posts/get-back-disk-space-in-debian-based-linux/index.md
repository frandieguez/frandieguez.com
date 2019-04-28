---
id: 881
title: Get back your disk space in a Debian-based Linux
date: 2010-11-21T15:59:01+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=881
permalink: /blog/2010/11/get-back-disk-space-in-debian-based-linux/
dsq_thread_id:
  - "653725906"
categories:
  - System Administration
tags:
  - debian
  - disk space
  - restore
---
<a href="http://www.flickr.com/photos/beercoaster/4242576451/"><img class="alignright size-medium wp-image-882" style="margin: 0px 0px 10px 10px;" title="Disk Space" alt="" src="/assets/4242576451_39b4be5d76_b.jpg" width="300" height="214" /></a>There are some actions you can perform to achieve if you can get back
disk space in your Debian/Ubuntu based box. Most packages contain files
that aren't necessary. For example, UI and documentation translations in
languages you don't use. Wouldn’t it be nice if you could get rid of
them and get back a few megabytes? Well, since dpkg 1.15.8 you can. dpkg
has two options `--path-include=glob-pattern` and
`--path-exclude=glob-pattern` that filter what files are installed or
not. You can get the format of the pattern from the glob man page:
[glob(7)](http://man.cx/glob%287%29). But this just works if you issue
*dpkg* command from the shell but not if you are using apt or aptitude.
So the best way to use them is to write them down in a file in
`/etc/dpkg/dpkg.cfg.d/`. A comon usage is: first exclude a directory and
then re-include parts of that directory that you want to keep. For
example if you want to delete gettext translations and translated manual
pages except Galician, you could write down this in
`/etc/dpkg/dpkg.cfg.d/excludes`:

    # Delete locales except Galician
    path-exclude=/usr/share/locale/*
    path-include=/usr/share/locale/gl/*
    path-include=/usr/share/locale/locale.alias

    # Delete translated man pages except Galician
    path-exclude=/usr/share/man/*
    path-include=/usr/share/man/man[1-9]/*
    path-include=/usr/share/man/gl*/*

This rules will apply to packages you will install/upgrade from now, but
if you want to save space immediately, you have to reinstall all the
packages in your system.

    aptitude reinstall

or

    apt-get --reinstall install

NOTE: Concerning locale deleting you can get the same results by using
*localepurge*. But this tool is strongly discouraged because this tool
is a hack which is \*not\* integrated with Debian’s package management
system and therefore is not for the faint of heart (other examples of
tools that is strongly disacouraged are: dpkg-repack, reportbug, etc).
Responsibility for its usage and possible breakage of your system
therefore lies in the sysadmin’s hands. NOTE 2: The package management
system on Linux makes installing and upgrading software a snap, but it
also caches every package in a local folder in case it’s needed again.
Here’s how to clear that cache and save loads of drive space.

    sudo apt-get clean