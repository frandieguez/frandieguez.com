---
id: 777
title: Joining Ubuntu Lucid Lynx to Active Directory
date: 2010-07-27T17:11:45+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=777
permalink: /blog/2010/07/joining-ubuntu-lucid-lynx-to-active-directory/
dsq_thread_id:
  - "654456624"
categories:
  - System Administration
tags:
  - active directory
  - join
  - ubuntu
---
From Jaunty Jackalope version of Ubuntu and now in the lastest release (Ludid, 10.4) it's very easy to join your Ubuntu to an Active Directory. Where I work we have a huge Active Directory to centralize users, groups, computers and resources (far more than 3000 users).

Here I go to explain how to join an Ubuntu Lucid Lynx (10.04) box to an Active Directory server:

Before all take notice that your DNS are pointing to your corporative DNS and the client system-time is synchronized with the server time. To do this just issue the next command:
<pre><code>sudo ntpdate domain.of.your.ad.server.com</code></pre>
<ol>
	<li>Install the likewise open AD authentication application with the next command: sudo apt-get install likewise-open</li>
	<li>Register your Ubuntu system:
<pre><code>sudo domainjoin-cli join name.of.jour.domain.com admin-user </code></pre>
(where name.of.your.domain.com is your domain name, and admin-user is a user account on the domain with permissions to add computers to it).</li>
	<li>When prompted, enter the password of your adminstrator account. A dialogue box will appear asking for your domain name, enter your AD fully qualified domain name in upper case letters, i.e YOUR.DOMAIN.COM</li>
	<li>Finally reboot.</li>
</ol>
Want sudo privileges on a group from AD into your linux boxes? Go to your Active Directory and create a group. I called mine linux-admins, but you can use any group you like. A word of advice though, you’ll have less problems if you don’t use spaces in your group name.

Now in your linux clients switch to a local user account with sudo privleges and at the terminal type the command:
<pre><code>sudo visudo</code></pre>
And append this into the sudoers file add:
<pre><code>%YOUR.DOMAIN.COM\\linux-admins ALL=(ALL) ALL</code></pre>
This tells Ubuntu to allow any user in the linux-admins group on your AD to use sudo privileges on the local machine.

At this point all is done so if you want to login into your Ubuntu system from the GUI use username@yourdomain

To login over SSH use yourdomain\username

As a bonus track and if you understand Galician/Spanish in the next link you can find a deeper manual about how to join this two technologies: <a href="https://softwarelibre.usc.es/documents/2">https://softwarelibre.usc.es/documents/2</a>
