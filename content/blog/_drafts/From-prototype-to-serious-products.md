---
id: 1745
title: From prototype to serious products
date: 2015-01-13T15:11:53+00:00
author: Fran Diéguez
layout: post
published: false
draft: true
categories:
  - Uncategorized

---
From [ycombinator](https://news.ycombinator.com/item?id=8862542)

<span style="color: #000000;">The most difficult thing is going to be getting to 10K active users :)</span>

These days RAM is cheap and SSD storage is also widely available. For a very long time, one of my side projects with 50K users was hosted in a EC2 small instance. With that out of the way, here are a few things you will need to take care of:

* Security (especially passwords) - Rails should take care of most of this for you, but you should ensure that you patch vulnerabilities when they are discovered. Also, stuff like having only key-based login to your servers etc.

* Backups - Take regular backups of all user data. It's also VERY important that you actually try restoring the data as well, as it's quite possible that backups are not occurring properly.

* One click deployment - Use Capistrano or Fabric to automate your deployments.

* A good feedback/support system - this could even be email to begin with (depending on the volume you expect), but it should be accessible.

* Unit tests - as your app grows in complexity, you will never be able to test all the features manually. I'm not a big fan of test driven development, but really, start writing unit tests as soon as you have validated your product idea.

* Alerts, monitoring and handling downtime - Downtimes are inevitable. Your host or DNS could go down, you might run out of disk space, etc. Use something like Pingdom to alert you of such failures.

<span style="color: #000000;">* Logging, logging, logging - I can't stress on this enough. When things break, logging is crucial in piecing together what happened. Use log rotation to archive old logs so they don't hog the disk space.</span>

&nbsp;

https://blog.bitbucket.org/2014/12/01/bitbucket-building-high-quality-software-with-speed-and-scale/?atl_medium=ACE&amp;atl_camp=ACE-486&amp;atl_camptype=blog&amp;atl_source=BB
