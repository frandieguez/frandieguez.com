---
title: Setting up suspend to RAM and hibernate after some time
description: "Making a laptop suspend to RAM on the lid close and then hibernate a couple of hours later, on Debian and Ubuntu — the systemd way, and the pm-utils way for machines that have not switched yet."
publishDate: 2013-04-07T18:58:05+00:00
author: Fran Dieguez
layout: post
published: false
draft: true
lang: "en-GB"
tags: ["linux", "debian", "ubuntu", "systemd", "laptop"]
categories:
  - Uncategorized
---
Suspend to RAM is instant and costs battery. Hibernate is free to hold and slow to come back from. Neither is the behaviour you want from closing a laptop lid, because what you actually want depends on something the laptop cannot know yet: whether you are opening it again in ten minutes or on Monday.

Suspend-then-hibernate solves it by not deciding up front. Suspend to RAM immediately, and if the machine is still asleep some hours later, wake just far enough to write memory to disk and power off properly.

## With systemd

Debian has `systemd` available and Ubuntu is heading the same way, so this is the version worth learning even if your machine is not on it yet.

The mechanism is a wake alarm: suspend normally, but set the real-time clock to fire after a delay. If you open the lid first, the alarm is cancelled and nothing happened. If the alarm fires, the machine resumes for a moment and hibernates.

```ini
# /etc/systemd/sleep.conf
[Sleep]
HibernateDelaySec=7200
```

```bash
$ sudo systemctl suspend-then-hibernate
```

Two hours felt about right to me: long enough to cover a train journey or a meeting, short enough that an overnight close ends up hibernated rather than flat.

To make the lid do it:

```ini
# /etc/systemd/logind.conf
[Login]
HandleLidSwitch=suspend-then-hibernate
HandleLidSwitchDocked=ignore
```

```bash
$ sudo systemctl restart systemd-logind
```

`HandleLidSwitchDocked=ignore` is worth setting even if you do not dock today. Closing the lid on a machine driving an external monitor should not put it to sleep, and the default behaviour of doing exactly that is a small daily annoyance.

## Hibernation needs swap, and enough of it

This is where most attempts fail, and the error message is unhelpful.

Hibernation writes the contents of RAM into the swap partition. If swap is smaller than the memory in use, there is nowhere to put it and the hibernate silently becomes a normal suspend — or fails and leaves the machine awake in your bag, which is the outcome that costs you a battery and a warm laptop.

```bash
$ free -h
$ swapon -s
```

Swap should be at least as large as RAM. The old advice about 2× RAM is long dead, but 1× is not optional if you want hibernation.

The kernel also needs to be told where to resume from:

```bash
$ sudo blkid /dev/sda3
/dev/sda3: UUID="0d1f4e2a-..." TYPE="swap"
```

```
# /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash resume=UUID=0d1f4e2a-..."
```

```bash
$ sudo update-grub
$ sudo update-initramfs -u
```

The `update-initramfs` is the step people skip. The resume happens before the root filesystem is mounted, so the UUID has to be baked into the initramfs — changing GRUB alone gets you a machine that hibernates perfectly and then boots fresh, losing the session it just carefully saved.

## Without systemd: pm-utils

On a machine still running sysvinit or upstart, the same idea is a script and an RTC alarm.

```bash
#!/bin/sh
# /usr/local/bin/suspend-then-hibernate

DELAY=7200

# Clear any previous alarm before setting a new one.
echo 0 > /sys/class/rtc/rtc0/wakealarm
echo "+${DELAY}" > /sys/class/rtc/rtc0/wakealarm

pm-suspend

# Execution resumes here on wake, whether by lid or by alarm.
# If the alarm is what woke us, it has already fired and been cleared.
if [ "$(cat /sys/class/rtc/rtc0/wakealarm)" = "" ]; then
    pm-hibernate
else
    echo 0 > /sys/class/rtc/rtc0/wakealarm
fi
```

Writing `0` first matters: the alarm file rejects a new value while one is pending, so without the clear you silently keep the old deadline.

:::caution
The RTC is usually UTC and the `+seconds` form sidesteps that entirely — which is the reason to use it rather than an absolute timestamp. Writing an absolute time computed from local time on a machine whose hardware clock is UTC gives you a wake alarm that is wrong by your timezone offset, and in winter it is wrong by a different amount than in summer.
:::

## Checking it worked

```bash
$ journalctl -b -1 | grep -i -E 'hibernat|suspend|resume'
```

`-b -1` is the previous boot, which after a successful hibernate is the session you are trying to inspect.

The failure I hit most often was not hibernation itself but coming back: a graphics driver that resumes from RAM happily and comes back from disk with a black screen. If that happens, it is almost always the proprietary driver, and `nomodeset` is not the fix — reinstalling the driver against the current kernel usually is, because a kernel upgrade that did not rebuild the module leaves you in exactly that state.

The Debian wiki's [SystemdSuspendSedation](https://wiki.debian.org/SystemdSuspendSedation) page is the reference for the systemd side and covers the inhibitor logic I have skipped here.
