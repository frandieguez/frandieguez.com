---
id: 994
title: How to easily create Debian packages for PHP extensions
date: 2011-03-20T20:41:07+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=994
permalink: /blog/2011/03/how-to-easily-create-debian-packages-for-php-extensions/
dsq_thread_id:
  - "654108978"
categories:
  - System Administration
tags:
  - deb
  - debian
  - debian packaging
  - debuild
  - packaging
  - pecl
  - PHP
  - php extensions
---
<p><img src="http://www.mabishu.com/wp-content/uploads/2011/03/20/debian-php-packe.png" alt="Debian PHP packages" style="float:right; margin: 0 0 10px 10px"/></p>
<p>Let me explain to all of you how to create a Debian package from a <a title="PECL :: The PHP Extension Community Library" href="http://pecl.php.net/" target="_blank">PECL</a> tarball. Currently is very simple to package a PECL extension without having any previous experience in Debian packaging and thus this system administration by installing deb packages could be more easy too.</p>
<p>So let's start the packaging.</p><!--more-->
<p>For this example we will create a package that I have tested last weeks and seems to fit all my needs for handling YAML files in a great way <a href="http://code.google.com/p/php-yaml/">http://code.google.com/p/php-yaml/</a>.</p>
<p>Before review any packaging system instructions we have to set up our system. For one part you must install all the required dependencies (take a look at what dependencies has your PECL extension)</p>
<pre><code># apt-get install dh-make-php php5-dev ubuntu-dev-tools build-essential</code></pre>
<p>And for the other hand you must provide your data for the signature of Debian packages:</p>
<pre><code># export DEBFULLNAME="Fran Dieguez"
# export DEBEMAIL="fran.dieguez_AT_mabishu_DOT_com"</code></pre>
<p>After that we will start the packaging instructions:</p>
<ol>
<li>Download the PECL package we want to create a package with:
<pre><code>$ pecl download yaml-beta
downloading yaml-1.0.1.tgz ...
Starting to download yaml-1.0.1.tgz (33,774 bytes)
.........done: 33,774 bytes
File /home/fran/Temp/php-developing/yaml-1.0.1.tgz downloaded</code></pre>
</li>
<li> So now we have to Debianize it with dh-make-pecl command and the appropriate arguments :
<pre><code>$ dh-make-pecl  yaml-1.0.1.tgz
Creating debian source package: php-yaml-1.0.1
Upstream is: Bryan Davis
Guessing Maintainer: Fran Dieguez &lt;franDOTdieguez_AT_mabishu_DOTcom&gt;</code></pre>
</li>
<li>
Almost done! We have to make a little changes in the package. For example include in the control file all the dependencies (take a look at the README file inside the pecl extension source). In this package the "Build-Depends" field must include libyaml-dev, and the package "Depends" field must include libyaml-0-2:</p>
<pre><code>$ cd php-yaml-1.0.1;
$ nano debian/control</code></pre>
<p>Change the file to match the next lines:</p>
<pre><code>Build-Depends: debhelper (>= 7), po-debconf, xsltproc , php5-dev, libyaml-dev
[...]
Depends: ${shlibs:Depends}, ${php:Depends}, ${misc:Depends}, libyaml-0-2</code></pre>
</li>
<li>
Finally compile it for getting the final deb file:</p>
<pre><code>$ debuild
dpkg-buildpackage -rfakeroot -D -us -uc
dpkg-buildpackage: export CFLAGS from dpkg-buildflags (origin: vendor): -g -O2
dpkg-buildpackage: export CPPFLAGS from dpkg-buildflags (origin: vendor):
dpkg-buildpackage: export CXXFLAGS from dpkg-buildflags (origin: vendor): -g -O2
dpkg-buildpackage: export FFLAGS from dpkg-buildflags (origin: vendor): -g -O2
dpkg-buildpackage: export LDFLAGS from dpkg-buildflags (origin: vendor): -Wl,-Bsymbolic-functions
dpkg-buildpackage: source package php-yaml
dpkg-buildpackage: source version 1.0.1-1
dpkg-buildpackage: source changed by Fran Dieguez <fran.dieguez@mabishu.com>
 dpkg-source --before-build php-yaml-1.0.1
[...]
dh_builddeb
dpkg-deb: building package `php5-yaml' in `../php5-yaml_1.0.1-1_amd64.deb'.
dpkg-genchanges  >../php-yaml_1.0.1-1_amd64.changes
dpkg-genchanges: including full source code in upload
dpkg-source --after-build php-yaml-1.0.1
dpkg-buildpackage: full upload (original source is included)
</code></pre>
</li>
<li>Test it! For installing the package you have to issue the next command:
<pre><code>$ sudo dpkg -i ../php5-yaml_1.0.1-1_amd64.deb</code></pre>
</li>
</ol>
