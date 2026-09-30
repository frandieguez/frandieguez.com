---
id: 732
title: How to setup a LAMP server with less than 100 characters
description: "The single command that installs Apache, PHP 5 and MySQL on a Debian-based system, in under a hundred characters."
publishDate: 2010-07-15T15:30:14+00:00
author: Fran Dieguez
layout: post
published: true
guid: http://www.mabishu.com/?p=732
permalink: /blog/2010/07/how-to-setup-a-lamp-server-with-less-than-100-characters/
dsq_thread_id:
  - "653744817"
categories:
  - System Administration
tags: ["apache", "php", "mysql", "sysadmin"]

---
<div class="aligncenter">

![Lamp](./lamp.png)
</div>

One of the reasons cause I love the GNU/Linux for developing is its easy
and quick setup. So if you're a LAMP-dev you can setup a LAMP server
with less than 100 chars. With the next command you will have a
apache2+php5+mysql on Debian based systems with the bonus of phpmyadmin
for administer your databases.

```
sudo apt-get install phpmyadmin lamp-server^
```

Dont forget the trailing '^' char. Quick post, quick solution. Isn't it?
