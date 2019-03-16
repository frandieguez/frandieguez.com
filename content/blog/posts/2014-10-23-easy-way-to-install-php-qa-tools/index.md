---
id: 1711
title: Easy way to install PHP QA tools
date: 2014-10-23T20:58:11+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1711
permalink: /blog/2014/10/easy-way-to-install-php-qa-tools/
dsq_thread_id:
  - "3309631580"
categories:
  - Open Source
  - Sofware Development
---
If you need an easy and quick way to install your <a title="PHP QA tools website" href="http://phpqatools.org/" target="_blank">PHP QA tools</a>, you can use the next bash snippet.
<pre># Install composer based tools
cat &gt; ~/.composer/composer.json &lt;&lt;EOF
{
    "require": {
        "halleck45/phpmetrics": "@dev",
        "squizlabs/php_codesniffer": "*",
        "phpunit/phpunit": "*",
        "sebastian/phpcpd": "*",
        "sebastian/phpdcd": "*",
        "phpmd/phpmd" : "@stable",
        "pdepend/pdepend" : "@stable",
        "phploc/phploc": "*",
        "sebastian/hhvm-wrapper": "*",
        "theseer/phpdox": "*"
    }
}
EOF
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
/usr/local/bin/composer global install
chown -R $SUDO_USER.$SUDO_USER ~/.composer</pre>
And all your required tools (phpunit, phploc, phpmd, pdepend, ...) are now located at ~/.composer/vendor/bin, so set your $PATH environment variable to include it.

If you find it useful please share it.