---
id: 1145
title: Setting up Jenkins in Ubuntu Precise 12.04 for PHP projects
date: 2012-04-17T22:44:18+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1145
permalink: /blog/2012/04/setting-up-jenkins-in-ubuntu-precise-12-04-for-php-projects/
dsq_thread_id:
  - "653690718"
categories:
  - System Administration
tags:
  - ci
  - continuous integration
  - jenkins
  - PHP
  - precise
  - setup
  - ubuntu
---
<img class="alignright  wp-image-1155" title="jenkins_logo" alt="" src="http://www.mabishu.com/wp-content/uploads/2012/04/jenkins_logo.png" width="318" height="102" />

This howto tries to clarify all the steps for setting up a Ubuntu Precise box as Continuous Integration server for PHP projects by using Jenkins.  In the next days I'll write another post about how to configure a PHP project inside Jenkins.

So let's go.<!--more-->
<h2>Installing Jenkins server</h2>
Ubuntu Precise now has inside its repository the Jenkins server packaged for an easy installation. So installing jenkins now is as simple as running the next command:
<div>
<div>
<pre>sudo apt-get install jenkins</pre>
</div>
</div>
<!--more-->after the installation jenkins will be running in the 8080 port. For accessing it you must go to <a href="http://localhost:8080">http://localhost:8080</a>
<p style="text-align: center;"><a href="http://www.mabishu.com/wp-content/uploads/2012/04/1-jenkins-ready.png"><img class=" wp-image-1147 aligncenter" style="max-width: 100%;" title="1-jenkins-ready" alt="" src="http://www.mabishu.com/wp-content/uploads/2012/04/1-jenkins-ready.png" /></a></p>
If you want to allow Jenkins to send mails after the builds, for informing of build reports to your team, you have to install a MTA:
<pre>sudo apt-get install postfix</pre>
<h2>Installing required Jenkins Plugins</h2>
For building PHP projects you need some Jenkins plugins. These are the needed:
<ul>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/Checkstyle+Plugin">Checkstyle</a> (for processing <a href="http://pear.php.net/PHP_CodeSniffer">PHP_CodeSniffer</a> logfiles in Checkstyle format)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/Clover+PHP+Plugin">Clover PHP</a> (for processing <a href="http://www.phpunit.de/">PHPUnit</a> code coverage xml output)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/DRY+Plugin">DRY</a> (for processing <a href="https://github.com/sebastianbergmann/phpcpd">phpcpd</a> logfiles in PMD-CPD format)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/HTML+Publisher+Plugin">HTML Publisher</a> (for publishing the <a href="http://www.phpunit.de/">PHPUnit</a> code coverage report, for instance)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/JDepend+Plugin">JDepend</a> (for processing <a href="http://pdepend.org/">PHP_Depend</a> logfiles in JDepend format)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/Plot+Plugin">Plot</a> (for processing <a href="https://github.com/sebastianbergmann/phploc">phploc</a> CSV output)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/PMD+Plugin">PMD</a> (for processing <a href="http://phpmd.org/">PHPMD</a> logfiles in PMD format)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/Violations">Violations</a> (for processing various logfiles)</li>
	<li><a href="http://wiki.jenkins-ci.org/display/JENKINS/xUnit+Plugin">xUnit</a> (for processing <a href="http://www.phpunit.de/">PHPUnit</a> logfiles in JUnit format)</li>
	<li><a href="https://wiki.jenkins-ci.org/display/JENKINS/Git%20Plugin">Git</a> (for accessing Git repositories, if you use Git in your project)</li>
</ul>
You can install these plugins using the web frontend at http://localhost:8080/pluginManager/available

Just check them all and click the «Install» button. You will see the plugin installation progress:

<a href="http://www.mabishu.com/wp-content/uploads/2012/04/2-installing-plugins.png"><img class="size-full wp-image-1148 aligncenter" title="2-installing-plugins" alt="" src="http://www.mabishu.com/wp-content/uploads/2012/04/2-installing-plugins.png" width="427" height="510" /></a>

If you can't find the Jenkins plugin from the Jenkins interface you can install them from command line. Go to <a href="http://updates.jenkins-ci.org/download/plugins/">http://updates.jenkins-ci.org/download/plugins/</a> and copy the hpi file URL of your desired plugin and execute the next commands from your jenkins server commandline:
<pre>cd /var/lib/jenkins/plugins
sudo wget http://updates.jenkins-ci.org/download/plugins/git/1.1.17/git.hpi
sudo chown -R jenkins:nogroup /var/lib/jenkins/
sudo service jenkins restart</pre>
Take a look at the last line, if you want to install additional plugins you have to restart your Jenkins server for making it available.
<h2>Installing the PHP Quality Assurance Toolchain</h2>
The most common required PHP tools should be installed using the PEAR Installer, the backbone of the <a href="http://pear.php.net/">PHP Extension and Application Repository</a> that provides a distribution system for PHP packages.

Now this point could differ depending in tools you use in your build script. For example if you use Behat you have to install it with PEAR before build the project, and so on.

The following commands are all that is required to install the required PHP tools using the PEAR Installer:
<pre>sudo apt-get install php-pear php5-mysql php5-memcache php5-imagick php5-curl php-apc php5-sqlite php5-xsl php5-xdebug</pre>
<pre>sudo pear config-set auto_discover 1
sudo pear install pear.phpqatools.org/phpqatools pear.netpirates.net/phpDox
sudo pear install theseer/Autoload
sudo pear install channel://pear.netpirates.net/phpdox-0.4.0
sudo pear install pear.phpunit.de/DbUnit</pre>
You have to install some other tools required to execute the builds in PHP projects.
<pre>sudo apt-get install git-core</pre>
And that's all, hope this little howto was useful and helps you to make easy to install and configure Jenkins CI server for building PHP projects.