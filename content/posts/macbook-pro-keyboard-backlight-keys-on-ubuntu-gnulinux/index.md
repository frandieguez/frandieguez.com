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
<img class="alignright size-full wp-image-706" style="margin-left: 10px;" title="macbook-keyboard" alt="" src="/assets/macbook-keyboard1.png" width="431" height="187" />
Recently I have purchased a new MacBook Pro 15" and the first thing I do
was install [Ubuntu Lucid Lynx](https://wiki.ubuntu.com/LucidLynx) on it.

After [some readying](https://help.ubuntu.com/community/MacBookPro6-2/Lucid) I have
all the hardware working properly but the keyboard backlight wasn’t
integrated into system and unfortunately after searching on the web for
something that could do this, I decide to write a simple script with
Bash and use Ubuntu-tweak to bind the keyboard keys to invoke the
script. So let’s go...

### Preparing our system

Well, before try to install my script on your computer you must have
installed the applesmc module on your computer. Don’t worry, if you go
to
[help.ubuntu.com](https://help.ubuntu.com/community/MacBookPro6-2/Lucid#Basic%20Installation%20Instructions)
you’ll find specific instructions to install it.

### Installing my script at your system

Just right-click [on this
link](/downloads/macbook/keyboard-backlight.sh), save to your computer
and rename it to keyboard-backlight. You can drop it at /usr/bin to
execute from wherever you are. Here are the contents of the script If
you are curious:

```bash
BACKLIGHT=$(cat /sys/class/leds/smc::kbd_backlight/brightness)
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
        echo $TEMP_VALUE > /sys/class/leds/smc::kbd_backlight/brightness
    done
        ;;
    off)
    TEMP_VALUE=$BACKLIGHT
    while [ $TEMP_VALUE -gt "0" ]; do
        TEMP_VALUE=`expr $TEMP_VALUE - 1`
        if [ $TEMP_VALUE -lt "0" ]; then TEMP_VALUE=0; fi
        echo $TEMP_VALUE > /sys/class/leds/smc::kbd_backlight/brightness
    done
        ;;
    *)
        echo "Use: keyboard-light up|down|total|off"
        ;;
esac

if [ $SET_VALUE -eq "1" ]; then
    echo $TOTAL > /sys/class/leds/smc::kbd_backlight/brightness
fi
```

### Using keyboard-backlight from command-line

This script could have 4 different uses:

- Increase backlight keyboard: **sudo keyboard-backlight up**
- Decrease backlight keyboard: **sudo keyboard-backlight down**
- Increase to total value of keyboard backlight: **sudo
  keyboard-backlight total**
- Turn off backlight keyboard: **sudo keyboard-backlight off**

You can customize the amount of steps by changing the INCREMENT variable
inside keyboard-backlight file.
