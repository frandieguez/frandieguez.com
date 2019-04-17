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
<img class="alignright  wp-image-1155" title="jenkins_logo" alt="" src="/assets/2012/04/jenkins_logo.png" width="318" height="102" />

This howto tries to clarify all the steps for setting up a Ubuntu Precise box as Continuous Integration server for PHP projects by using Jenkins.  In the next days I'll write another post about how to configure a PHP project inside Jenkins. So let's go. ## Installing Jenkins server Ubuntu Precise now has inside its repository the Jenkins server packaged for an easy installation. So installing jenkins now is as simple as running the next command:

```bash
sudo apt-get install jenkins
```

after the installation jenkins will be running in the 8080 port. For accessing it you must go to [http://localhost:8080](http://localhost:8080)

[![](/assets/2012/04/1-jenkins-ready.png "1-jenkins-ready")](/assets/2012/04/1-jenkins-ready.png)

If you want to allow Jenkins to send mails after the builds, for informing of build reports to your team, you have to install a MTA:

```bash
sudo apt-get install postfix
```

## Installing required Jenkins Plugins For building PHP projects you need some Jenkins plugins. These are the needed:

*   [Checkstyle](http://wiki.jenkins-ci.org/display/JENKINS/Checkstyle+Plugin) (for processing [PHP\_CodeSniffer](http://pear.php.net/PHP_CodeSniffer) logfiles in Checkstyle format)
*   [Clover PHP](http://wiki.jenkins-ci.org/display/JENKINS/Clover+PHP+Plugin) (for processing [PHPUnit](http://www.phpunit.de/) code coverage xml output)
*   [DRY](http://wiki.jenkins-ci.org/display/JENKINS/DRY+Plugin) (for processing [phpcpd](https://github.com/sebastianbergmann/phpcpd) logfiles in PMD-CPD format)
*   [HTML Publisher](http://wiki.jenkins-ci.org/display/JENKINS/HTML+Publisher+Plugin) (for publishing the [PHPUnit](http://www.phpunit.de/) code coverage report, for instance)
*   [JDepend](http://wiki.jenkins-ci.org/display/JENKINS/JDepend+Plugin) (for processing [PHP\_Depend](http://pdepend.org/) logfiles in JDepend format)
*   [Plot](http://wiki.jenkins-ci.org/display/JENKINS/Plot+Plugin) (for processing [phploc](https://github.com/sebastianbergmann/phploc) CSV output)
*   [PMD](http://wiki.jenkins-ci.org/display/JENKINS/PMD+Plugin) (for processing [PHPMD](http://phpmd.org/) logfiles in PMD format)
*   [Violations](http://wiki.jenkins-ci.org/display/JENKINS/Violations) (for processing various logfiles)
*   [xUnit](http://wiki.jenkins-ci.org/display/JENKINS/xUnit+Plugin) (for processing [PHPUnit](http://www.phpunit.de/) logfiles in JUnit format)
*   [Git](https://wiki.jenkins-ci.org/display/JENKINS/Git%20Plugin) (for accessing Git repositories, if you use Git in your project)

You can install these plugins using the web frontend at http://localhost:8080/pluginManager/available Just check them all and click the «Install» button. You will see the plugin installation progress: ![](/assets/2012/04/2-installing-plugins.png "2-installing-plugins")

If you can't find the Jenkins plugin from the Jenkins interface you can install them from command line. Go to [http://updates.jenkins-ci.org/download/plugins/](http://updates.jenkins-ci.org/download/plugins/) and copy the hpi file URL of your desired plugin and execute the next commands from your jenkins server commandline:

```bash
cd /var/lib/jenkins/plugins
sudo wget http://updates.jenkins-ci.org/download/plugins/git/1.1.17/git.hpi
sudo chown -R jenkins:nogroup /var/lib/jenkins/
sudo service jenkins restart
```

Take a look at the last line, if you want to install additional plugins you have to restart your Jenkins server for making it available. ## Installing the PHP Quality Assurance Toolchain The most common required PHP tools should be installed using the PEAR Installer, the backbone of the [PHP Extension and Application Repository](http://pear.php.net/) that provides a distribution system for PHP packages. Now this point could differ depending in tools you use in your build script. For example if you use Behat you have to install it with PEAR before build the project, and so on. The following commands are all that is required to install the required PHP tools using the PEAR Installer:

```bash
sudo apt-get install php-pear php5-mysql php5-memcache php5-imagick php5-curl php-apc php5-sqlite php5-xsl php5-xdebug

sudo pear config-set auto_discover 1
sudo pear install pear.phpqatools.org/phpqatools pear.netpirates.net/phpDox
sudo pear install theseer/Autoload
sudo pear install channel://pear.netpirates.net/phpdox-0.4.0
sudo pear install pear.phpunit.de/DbUnit
```

You have to install some other tools required to execute the builds in PHP projects.

```bash
sudo apt-get install git-core
```

And that's all, hope this little howto was useful and helps you to make easy to install and configure Jenkins CI server for building PHP projects.
