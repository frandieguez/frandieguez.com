---
id: 1691
title: 'Speed up build times for ArchLinux AUR packages'
description: 'Speed up build times for ArchLinux AUR packages'
publishDate: 2019-04-27
author: Fran Diéguez
layout: post
published: true
guid: http://www.frandieguez.dev/?p=1691
permalink: /blog/2019/04/speed-up-archlinux-aur-package-building/
categories:
  - Operating Systems
tags:
  - Archlinux
  - AUR
ogImage: Arch_Linux_logo.svg.png
---


<div class="aligncenter">

![Arch logo](./Arch_Linux_logo.png)

</div>

It's been some years since I have migrated my computers
**from Ubuntu to Archlinux**. This distributions offers some important advantages
against Ubuntu.


- **Rolling release:** this is always referenced by Archlinux users but
you only know what that it means after some time using it. I'll summarize it with:
no reinstallations, _period_; you always have the latest versions of the
software available, usually after a few days after its release.
- **The best documentation page:** The ArchLinux wiki page is simply the best resource
available to find clear, vast and updated documentation for every
part of your system. It doesn't matters if you use another Linux distribution,
this page is for you as well.
- **Unified software repository:** do you know what [PPA](https://launchpad.net/ubuntu/+ppas)
are? Then put all the packages available on PPAs into a unique, user ranked,
community-maintained repository, and that's what [AUR](https://aur.archlinux.org/) is.
In AUR you will find more software that you could think of. Until today, every
single time I needed a piece of software it was available in there.

So back into the topic of the post, I usually make two changes on how packages are installed on
my computers, they are quite simple but really helpful.

# Use all the CPU cores to build AUR packages

By default to build AUR packages from sources, ArchLinux uses only two cores.
So if your computer has more than that, it's a good idea to take advantage of all of them.
In order to do that you have to edit the /etc/makepkg.conf to change the MAKEFLAG -j to
be equals to the number of CPU threads.

```bash
sed -i 's,#MAKEFLAGS="-j2",MAKEFLAGS="-j$(nproc)",g' /etc/makepkg.conf
```

# Do not compress packages when building
Again when installing packages from AUR, those packages got built on installation time
by default Archlinux creates a compressed archive to save disk space. This
slows down installation for packages that are big, i.e. Google Chrome, as before
installing the package it compresses it into a .xz file.
So I usuallly remove the compression step.

```bash
sed -i "s,PKGEXT='.pkg.tar.xz',PKGEXT='.pkg.tar',g" /etc/makepkg.conf
```

Hope these tips come in handy, and if you know any other suggestion do not hesitate to start a discussion on twitter!
