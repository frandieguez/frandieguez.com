---
id: 555
title: 'Pingback-php: a library for performing Pingback calls in an easy-way'
date: 2012-12-26T13:20:53+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=555
permalink: /blog/2012/12/pingback-php-a-library-for-performing-pingback-calls-in-an-easy-way/
dsq_thread_id:
  - "993192229"
categories:
  - Open Source
  - Sofware Development
tags:
  - library
  - open source
  - PHP
  - pingback
---
Today I'm pleased to announce another library that I made. [Pingback-php](http://frandieguez.github.com/pingback-php/">Pingback-php) is a library for performing Pingback requests in a simple way. Pingback-PHP is compliant with the [Pingback 1.0 standard specification](http://www.hixie.ch/specs/pingback/pingback).

A quick example:

If you want to inform to [this article](http://www.mabishu.com/blog/2012/12/14/object-calisthenics-write-better-object-oriented-code/) that you have referenced it from [one of your posts](http://www.mabishu.com/blog/2012/12/14/get-better-performance-and-life-from-your-ssd-in-linux-based-systems/) by using the Pingback protocol, you can do it with this code:

```php
// Prepare the Pingback client
$requestHandler = new Pingback\RequestHandler();
$client = new Pingback\Client($requestHandler);

// Perform the pingback call
try {

    $client->ping(
        "http://www.mabishu.com/blog/2012/12/14/get-better-performance-and-life-from-your-ssd-in-linux-based-systems/",
        "http://www.mabishu.com/blog/2012/12/14/object-calisthenics-write-better-object-oriented-code/";
    );

} catch (Pingback\Exception $e) {
  printf("Exception raised with code (%d) : %s\n", $e->getCode(), $e->getMessage());
}
```

### Exception-aware

As you noticed in the above example Pingback-PHP raises different exceptions, if some error happens in the target server or between client-server communication. All the exceptions has a direct correlation with the server reported faults, please refer to the Pingback especification for more information:

*   0: A generic fault code.
*   0×0010 (16): The source URI does not exist.
*   0×0011 (17): The source URI does not contain a link to the target URI
*   0×0020 (32): The specified target URI does not exist.
*   0×0021 (33): The specified target URI cannot be used as a target.
*   0×0030 (48): The pingback has already been registered.
*   0×0031 (49): Access denied.
*   0×0032 (50): The server could not communicate with an upstream server.

So take care of this raised exceptions in your code.

### Install it!
---------------------------------------------------------------------

1.  You can get it from GitHub: [https://github.com/frandieguez/pingback-php](https://github.com/frandieguez/pingback-php). Make sure that you are using a PSR-0 autoloader.
2.  Use Composer "require": { "frandieguez/pingback-php": "0.9" },

### Dependencies


For now needs the _xmlrpc_ extension for PHP for encode and decode messages. **I have plans to implement this functions to avoid all the dependencies**.

### Test it!

This library is heavy tested with PHPUnit. I tried to maintain the coverage over the 80%. So I can release new versions and add new features without breaking anything. If you want to help me to maintain this library updated, run the unitary tests with phpunit to give me feedback about what doesn't work. For running tests:

1.  Install in your system PHPUnit: [http://pear.phpunit.de/](http://pear.phpunit.de/)
2.  And simply run _phpunit_ from the root of project

If you want to know if the latest code in github is stable take a look at the Continuous Integration server that I use: [https://travis-ci.org/frandieguez/pingback-php](https://travis-ci.org/frandieguez/pingback-php)
