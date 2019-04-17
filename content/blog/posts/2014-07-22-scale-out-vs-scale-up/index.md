---
id: 1699
title: Scale out vs Scale up
date: 2014-07-22T18:24:12+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1699
permalink: /blog/2014/07/scale-out-vs-scale-up/
dsq_thread_id:
  - "2864551431"
categories:
  - System Administration
  - Web
tags:
  - scalability
  - scale-out
  - scale-up
  - server administration
  - web server
---
There is no doubt that cloud hosting is taking its place and it offers some advantages for managing your deployments but, is it the right choice to take?

This dissertation comes from the recent new that <a href="http://highscalability.com/blog/2014/7/21/stackoverflow-update-560m-pageviews-a-month-25-servers-and-i.html">StackOverflow</a> uses a scale-up methodology to handle its services. And that's a quite strange thing to see nowadays. Every single web service tends to use Scale-out and that's the same for our company services, <a href="http://www.openhost.es">OpenHost</a>, where we have been migrating from metal-servers to the cloud "panacea".

Our main aim to move to cloud servers was to <strong>reduce our costs</strong> when our infrastructure is not having a lot of load, which always use to be at nights, and to <strong>quickly replace malfunctioning servers</strong> with new servers by provisioning them with puppet.

Just to clarify the terms, below I will describe both:

* **Scale-up:** it is as simple as adding more computational power and RAM to your server, by buying a more expensive and robust server.
* **Scale-out:** Refers to adding more servers with less processors and RAM.

There are common pros and cons for scale-up and scale-out which are:

* **Scale-up:** they are less challenging to implement, and given that they can use all the <a href="https://www.youtube.com/watch?v=FFnc4qDg4-k">power of the "metal"</a> you will retrieve far better performance from the same machine in cloud. As a counterpart, using metal tends to be a risky business due to greater risk of hardware failure that causes bigger outages (yes we have learned this by heart).

* **Scale out:** is usually cheaper overall and can literally scale theoretically infinitely (although we know that there are usually limits imposed by software or the environment’s infrastructure).

Our experience says that you will need more servers due to the fact that those VMs will have far less performance against metal-ones, but they have helped us to autoscale when our infrastructure had a huge demand. And we have mitigated a lot of outages caused by server failures.

A good resource to read is the <a href="http://www.amazon.es/Scalability-Rules-Principles-Scaling-Sites/dp/0321753887">Scalability Rules: 50 Principles for Scaling Web Sites</a> which explains in a good way how to handle with this problem. But again, it's quite weird nowadays that services like StackOverflow uses the scale-up technique, but they have probed that this have been worked better than scale-out for them.Take a look at how the StackOverflow was back in January 2014.

<iframe src="//www.youtube.com/embed/OGi8FT2j8hE" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
