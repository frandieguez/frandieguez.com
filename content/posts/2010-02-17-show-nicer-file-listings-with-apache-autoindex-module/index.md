---
id: 577
title: Show nicer file listings with Apache autoindex module
date: 2010-02-17T14:04:01+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=577
permalink: /blog/2010/02/show-nicer-file-listings-with-apache-autoindex-module/
dsq_thread_id:
  - "654139266"
categories:
  - System Administration
tags:
  - apache
  - autoindex
  - file listing
  - nicer
---
Recently I have working on "mabishu-apache-autoindex", a set of html, css, icons and image files designed to work together with the <a href="http://httpd.apache.org/docs/2.0/mod/mod_autoindex.html">mod_autoindex</a> module to make the default Apache file listings look a little nicer.  Try this <a title="Screenshot demo of mabishu apache autoindex theme" href="http://img715.yfrog.com/img715/3013/capturadepantalla.png">screenshot demo</a> and If you like it, grab the source files at <a href="http://github.com/frandieguez/mabishu-apache-autoindex">my Github repository</a>, now I'll explain how to set it up.
<h3>Installation</h3>
First, get a copy of the "include" folder – the easiest way is to change to the document root of the domain you want to style, and check it out from git:

```
$ cd /var/www/YOUR.VHOST.LOCAL
$ git clone http://github.com/frandieguez/mabishu-apache-autoindex.git
```

This should create an ‘include’ folder in the parent of your document root. Next, you need to configure Apache to use the "includes" files to style your directory listings.

I use the following config, which you’ll need to adjust to match your particular setup – the ‘icons’ and 'includes' alias and the ‘mod_autoindex’ section are the main areas to pay attention to:

```xml
# Virtualhost example configuration file with autoindex theme support
<VirtualHost *:80>
ServerName your.vhost.local

DocumentRoot /var/www/your.vhost.local/public_html

# Define where is the theme and icons directory
Alias /icons/ /var/www/your.vhost.local/include/icons/
Alias /include/ /var/www/your.vhost.local/include/

<Directory "/var/www/your.vhost.local/public_html">
  AllowOverride All
  Order allow,deny
  Allow from all

  # Tell Apache to add theme support to autoindex
  <IfModule mod_autoindex.c>
    Options Indexes FollowSymLinks
    IndexOptions +FancyIndexing
    IndexOptions +VersionSort
    IndexOptions +HTMLTable
    IndexOptions +FoldersFirst
    IndexOptions +IconsAreLinks
    IndexOptions +IgnoreCase
    IndexOptions +SuppressDescription
    IndexOptions +SuppressHTMLPreamble
    IndexOptions +XHTML
    IndexOptions +IconWidth=16
    IndexOptions +IconHeight=16
    IndexOptions +NameWidth=*
    IndexOrderDefault Descending Name
    HeaderName /include/header.html
    ReadmeName /include/footer.html
  </ifModule>

</Directory>
</VirtualHost>
```
You’ll need mod_autoindex for any of this to work – it should be installed by default with Apache in most linux distributions.

### Disclaimer
The formatting relies on a few javascript hacks which may or may not work exactly as intended if the output of your apache directory listings differs a lot from what is expected. If the output appears strange, try playing around with the javascript formatting in header.html, or drop me a line if you need a hand.
