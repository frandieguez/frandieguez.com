---
id: 530
title: Install Ubuntu Karmic Koala on a MacBook
description: Install Ubuntu Karmic Koala on a MacBook
publishDate: 2009-12-27T23:57:52+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=530
permalink: /blog/2009/12/install-ubuntu-karmic-koala-on-a-macbook/
dsq_thread_id:
  - "655370820"
categories:
  - Uncategorized
tags:
  - fixes
  - install
  - issues
  - karmic
  - koala
  - macbook
---
After 4 months trying to fix my laptop finally with success, yesterday I installed Ubuntu 9.10 (Karmic Koala)<a title="Building Linux Kernel for Macbook 2,1" href="http://www.mabishu.com/blog/2007/09/22/cocinando-el-kernel-linux-para-macbook-core-2-duo/"> on my MacBook</a> (2,1).  Actually, rather than write a “OMG it’s so great!”-post, I turned it out a howto fix some issues of Ubuntu 9.10 (Karmic Koala) on a MacBook 2,1.

### First Impressions

First of all, kernel devs has been hardly working on the Intel 945GM video driver, lame wonders like the civilizations or something, I’m talking OMFGWTF!?!11-sized wonders!

Using wildly unreliable readings from glxgears:
> 8.10 (Intrepid Ibex): ~1100 fps
> 9.04 (Jaunty Jackalope): ~900 fps (and I’m being generous here)
> 9.10 (Karmic Koala): ~3200 fps!

I’ve got 3x more frames per second than I did in 8.10. Now graphics feel smoother and I think I could almost run a 3D accelerated game on it.

Apart from the hotness that is the new Intel video driver, there are loads of other improvements over previous releases. Boot time has improved significantly, and the same goes for login time, which is really nice. GDM has been completely rewritten, which results in a smoother and nicer login experience but by loosing a lot of customization. This rewrite also means that I can now suspend my laptop while being logged out.

The classic brown/orange Ubuntu look has been modified to even browner (i.e. darker) and IMHO looks so good that I’m sticking to the default theme but just changing the background for now. The default icon set has been given an overhaul for the better and behind the scenes we’ve got Ext4 as the default file system, Grub 2 as the new boot-loader, DeviceKit replacing HAL and other nice things.

On the debate of Grub vs Grub 2, at this time I prefer Grub 'cause the new one although is production ready has some lacks that are important for me: doesn't have support for password locking.

### Setting Up

Almost everything worked out of the box with some minor exceptions though. So far I haven’t run into any problems relating to wifi, suspend/resume/hibernate, graphics/video, bluetooth or any of the things that usually makes installing any OS on a Mac a living hell.

With this version what needs tampering with is mainly the keyboard layout and maybe the sound. If you want to use the built-in iSight, you probably got a little work ahead of you, but otherwise fixing these minor issues will take you maybe 5–10 minutes.
####Touchpad Behaviour
Since I’m installing on a MacBook, I want the touchpad to behave like it does in OS X, and it pretty much does. I only had to open the mouse preferences (System > Preferences > Mouse) and tell it to enable two-finger scrolling and that was that. If you’re using tapping for clicking, I’m guessing 2 finger tap is right click and 3 finger tap is middle click.
####Keyboard Setup
After selecting the appropriate keyboard layout (Apple / MacBook/MacBookPro (intl.)) I wasn’t able to write @, $, {, [, ], }, ~ or |, or any other key that required me to press Alt Gr. Fortunately I could for unknown reasons write those characters in my Gnome Terminal (but not anywhere else) and copy/paste from there, but that is no fun in the long run and it certainly proves problematic when you try to log in with a password containing any of those characters.

For solve this issue just hit Alt-F2 (or Alt-Fn-F2 if you haven’t switched Fn-mode) to bring up the “Run Application” dialog and type:

```
gksudo gedit /usr/share/X11/xkb/symbols/pc
```

Make sure these two lines in /usr/share/X11/xkb/symbols/pc looks like this (i.e. add “`//`” at the beginning of the lines):

```
//    modifier_map Mod4   { &lt;LWIN> };
...
//    modifier_map Mod4   { &lt;RWIN> };
```

When you’re done editing the file and your changes are saved, go to System > Preferences > Keyboard, select the Layouts tab and click Layout Options. Expand “Key to choose 3rd level” and put a check mark next to the key you want to be your Alt Gr. Personally I’m using “Right Win” (i.e. the Cmd/Apple key to the right of the space bar).

### Function Keys

The Mute/Volume keys (on F3, F4 and F5) and the eject key works out of the box, but the brightness keys (on F1 and F2) needs a little attention — nothing big, just install the package <code>pommed</code> and that’s it.

If you—like me—don’t like the default Fn-key behaviour, where you have to hold Fn to actually press F1-F12 — i.e. Alt-Fn-F2 to bring up the “Run Application” dialog and write
```
sudo gedit /etc/modprobe.d/hid_apple.conf
```

Add this line to the previously open file.
```
options hid_apple fnmode=2
```

and save the file and execute the following command to notify hid_apple module to reload it's configuration.
```
sudo update-initramfs -u
```

#### No Sound in Your Headphones?

I had a weird issue with sound working fine with the internal speakers, but once I connected my headphones or stereo to the output jack, I got nothing. At first I thought I was going to have to recompile a bunch of kernel modules, find a virgin to sacrifice and perhaps give away my first-born, but it turned out to be simpler than that. I installed the package `gnome-alsamixer` and unmuted all channels and everything was fine.

#### Webcam/iSight
It’d be nice if it did work, but Apple is mostly at fault here, because they’re so bitchy about releasing specs and firmware. Back in the olden days you’d have to extract the firmware from your OS X install, which could be done with the package `isight-firmware-tools` if you don't have Mac Os X installed on your Mac you can download from http://www.mediafire.com/?81xtkqyttjt .

Th-th-th-that’s all, folks! Really! Apart from the iSight (which I couldn’t care less about), everything’s working better than ever and the koala is fast becoming my favorite pet in the zoo that is Ubuntu Linux.
