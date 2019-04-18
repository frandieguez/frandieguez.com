---
id: 558
title: Block Grub2 entries with user/pass auth
date: 2010-01-20T17:47:19+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=558
permalink: /blog/2010/01/block-grub2-entries-with-userpass-auth/
dsq_thread_id:
  - "655370816"
categories:
  - System Administration
tags:
  - administration
  - auth
  - authentication
  - grub
  - grub2
  - Linux
---
As I wrote on tittle since grub's 2529 svn revision we can use "Basic authentication" on entries. One of the huge regression bugs that grub2 introduces since is replacing grub on main distribution, like Ubuntu. This bug impedes me to implement on the hostile environments where I have deployed GNU/Linux boxes (university community).

This solution is still on initial development but after probe it I have to say that works perfectly for me. Here I'll explain how to activate authentication support on grub2 and with this avoid that unprivileged users change grub entries or boot from memory sticks or similar.

Just edit file /boot/grub/grub.cfg and prepend the next text:
```
set superusers="user1"
password user1 password1
password user2 password2

menuentry "GNU/Linux" {
        set root=(hd0,1)
        linux /vmlinuz
}

menuentry "Windows" --users user2 {
        set root=(hd0,2)
        chainloader +1
}
```
as you can see this syntax is very simple and self-explainable. Take a lot at second menu entry, with that only user2 can boot on "Windows"  and only user1 and user2 can edit grub entries..

By other side, this introduces a huge security bug 'cause password is written on plain text. At this moment password command only has  support for pain passwords so if we want encrypted passwords we have to create a config file at /etc/grub.d/ and using

```
grub-mkpasswd-pbkdf2
```

we can generate a block with user and pass like the next one (trimmed 'cause brakes the layout page):
```
password_pbkdf2 user3 grub.pbkdf2.sha512.10000.9290F727ED06C....38BA45
```
For more, and possibly more actualized, information go to http://grub.enbug.org/Authentication
