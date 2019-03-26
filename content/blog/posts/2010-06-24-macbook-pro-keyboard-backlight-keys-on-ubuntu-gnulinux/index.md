---
id: 717
title: MacBook Pro keyboard backlight keys on Ubuntu GNU/Linux
date: 2010-06-24T04:39:13+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=717
permalink: /blog/2010/06/macbook-pro-keyboard-backlight-keys-on-ubuntu-gnulinux/
dsq_thread_id:
  - "653844454"
categories:
  - System Administration
tags:
  - backlight
  - bash
  - keyboard
  - macbook
  - macboopro6.2
---
<img class="alignright size-full wp-image-706" style="margin-left: 10px;" title="macbook-keyboard" alt="" src="/assets/2010/06/macbook-keyboard1.png" width="431" height="187" />

Recently I have purchased a new MacBook Pro 15" and the first thing I do was install <a title="Ubuntu Lucid Lynx" href="https://wiki.ubuntu.com/LucidLynx">Ubuntu Lucid Lynx</a> on it. After <a href="https://help.ubuntu.com/community/MacBookPro6-2/Lucid">some readying</a> I have all the hardware working properly but the keyboard backlight wasn’t integrated into system and unfortunately after searching on the web for something that could do this, I decide to write a simple script with Bash and use Ubuntu-tweak to bind the keyboard keys to invoke the script. So let’s go...

<!--more-->
<h3>Preparing our system</h3>
Well, before try to install my script on your computer you must have installed the applesmc module on your computer. Don’t worry, if you go to <a href="https://help.ubuntu.com/community/MacBookPro6-2/Lucid#Basic%20Installation%20Instructions">help.ubuntu.com</a> you’ll find specific instructions to install it.
<h3>Installing my script at your system</h3>
Just right-click <a href="/downloads/macbook/keyboard-backlight.sh">on this link</a>, save to your computer and rename it to keyboard-backlight. You can drop it at /usr/bin to execute from wherever you are. Here are the contents of the script If you are curious:
<pre lang="bash"><code>BACKLIGHT=$(cat /sys/class/leds/smc::kbd_backlight/brightness)
INCREMENT=15

if [ $UID -ne 0 ]; then
    echo "Please run this program as superuser"
    exit 1
fi

SET_VALUE=0
case $1 in

    up)
        TOTAL=`expr $BACKLIGHT + $INCREMENT`
        if [ $TOTAL -gt "255" ]; then
            exit 1
        fi
        SET_VALUE=1
        ;;
    down)
        TOTAL=`expr $BACKLIGHT - $INCREMENT`
        if [ $TOTAL -lt "0" ]; then
            exit 1
        fi
        SET_VALUE=1
        ;;
    total)
	TEMP_VALUE=$BACKLIGHT
	while [ $TEMP_VALUE -lt "255" ]; do
		TEMP_VALUE=`expr $TEMP_VALUE + 1`
		if [ $TEMP_VALUE -gt "255" ]; then TEMP_VALUE=255; fi
		echo $TEMP_VALUE &gt; /sys/class/leds/smc::kbd_backlight/brightness
	done
        ;;
    off)
	TEMP_VALUE=$BACKLIGHT
	while [ $TEMP_VALUE -gt "0" ]; do
		TEMP_VALUE=`expr $TEMP_VALUE - 1`
		if [ $TEMP_VALUE -lt "0" ]; then TEMP_VALUE=0; fi
		echo $TEMP_VALUE &gt; /sys/class/leds/smc::kbd_backlight/brightness
	done
        ;;
    *)
        echo "Use: keyboard-light up|down|total|off"
        ;;
esac

if [ $SET_VALUE -eq "1" ]; then
    echo $TOTAL &gt; /sys/class/leds/smc::kbd_backlight/brightness
fi</code></pre>
<h3>Using keyboard-backlight from command-line</h3>
This script could have 4 different uses:
<ul>
	<li>Increase backlight keyboard: <strong>sudo keyboard-backlight up</strong></li>
	<li>Decrease backlight keyboard:<strong> sudo keyboard-backlight down</strong></li>
	<li>Increase to total value of keyboard backlight:<strong> sudo keyboard-backlight total</strong></li>
	<li>Turn off backlight keyboard:<strong> sudo keyboard-backlight off</strong></li>
</ul>
You can customize the amount of steps by changing the INCREMENT variable inside keyboard-backlight file.
<h3>Using it without superuser password</h3>
As some advanced user could see, for get this to work we have to run it as superuser (cause we are writing configurations in /sys/).

This impedes us to execute it without being prompted for the superuser password so I have made another workaround. You can allow to admin group’s users to run it via sudo without password prompt. To do this you must add the next lines to the sudoers file:
<pre lang="bash"><code>Cmnd_Alias CMDS = /path/to/your/script/keyboard-backlight
%admin ALL = (ALL) NOPASSWD: CMDS
</code></pre>
<h3>Binding keyboard keys to this script</h3>
Now that the script works from command line without password prompting we could bind keyboard keys to this script. I’ll use Ubuntu-Tweak but you can use "compiz-manager" or gconf directly.

In ubuntu-tweak we can tune our keyboard special keys under Personal &gt; Shortcuts Commands, there just set up shortcuts as you can see in the image below.

<a href="/assets/2010/06/ubuntu-tweak-macbook-backlight.png"><img class="aligncenter size-medium wp-image-709" title="ubuntu-tweak-macbook-backlight" alt="" src="/assets/2010/06/ubuntu-tweak-macbook-backlight-300x176.png" width="300" height="176" /></a>

I hope you enjoy it! And as I say always "Comments, questions, heckles, attacks, praises, and, (most especially) patches and contributions are welcome!"
