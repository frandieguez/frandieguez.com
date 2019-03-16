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
Today I'm pleased to announce another library that I made. <a title="Pingback-php project page" href="http://frandieguez.github.com/pingback-php/">Pingback-php</a> is a library for performing Pingback requests in a simple way. Pingback-PHP is compliant with the <a href="http://www.hixie.ch/specs/pingback/pingback">Pingback 1.0 standard specification</a>.

A quick example:

If you want to inform to <a href="http://www.mabishu.com/blog/2012/12/14/object-calisthenics-write-better-object-oriented-code/">this article</a> that you have referenced it from <a href="http://www.mabishu.com/blog/2012/12/14/get-better-performance-and-life-from-your-ssd-in-linux-based-systems/">one of your posts</a> by using the Pingback protocol, you can do it with this code:
<pre><code>// Prepare the Pingback client
$requestHandler = new Pingback\RequestHandler();
$client = new Pingback\Client($requestHandler);

// Perform the pingback call
try {

    $client-&gt;ping(
        "http://www.mabishu.com/blog/2012/12/14/get-better-performance-and-life-from-your-ssd-in-linux-based-systems/",
        "http://www.mabishu.com/blog/2012/12/14/object-calisthenics-write-better-object-oriented-code/";
    );

} catch (Pingback\Exception $e) {
  printf("Exception raised with code (%d) : %s\n", $e-&gt;getCode(), $e-&gt;getMessage());
}
</code></pre>
<!--more-->

<h2><a href="https://github.com/frandieguez/pingback-php#exception-aware" name="exception-aware"></a>Exception-aware</h2>
As you noticed in the above example Pingback-PHP raises different exceptions, if some error happens in the target server or between client-server communication.

All the exceptions has a direct correlation with the server reported faults, please refer to the Pingback especification for more information:
<ul>
	<li>0: A generic fault code.</li>
	<li>0×0010 (16): The source URI does not exist.</li>
	<li>0×0011 (17): The source URI does not contain a link to the target URI</li>
	<li>0×0020 (32): The specified target URI does not exist.</li>
	<li>0×0021 (33): The specified target URI cannot be used as a target.</li>
	<li>0×0030 (48): The pingback has already been registered.</li>
	<li>0×0031 (49): Access denied.</li>
	<li>0×0032 (50): The server could not communicate with an upstream server.</li>
</ul>
So take care of this raised exceptions in your code.
<h2><a href="https://github.com/frandieguez/pingback-php#install-it" name="install-it"></a>Install it!</h2>
<ol>
	<li>You can get it from GitHub: <a href="https://github.com/frandieguez/pingback-php">https://github.com/frandieguez/pingback-php</a>.
Make sure that you are using a PSR-0 autoloader.</li>
	<li>Use Composer
"require": {
"frandieguez/pingback-php": "0.9"
},</li>
</ol>
<h2><a href="https://github.com/frandieguez/pingback-php#dependencies" name="dependencies"></a>Dependencies</h2>
For now needs the <em>xmlrpc </em>extension for PHP for encode and decode messages. <strong>I have plans to implement this functions to avoid all the dependencies</strong>.
<h2><a href="https://github.com/frandieguez/pingback-php#test-it" name="test-it"></a>Test it!</h2>
This library is heavy tested with PHPUnit. I tried to maintain the coverage over the 80%. So I can release new versions and add new features without breaking anything. If you want to help me to maintain this library updated, run the unitary tests with phpunit to give me feedback about what doesn't work.

For running tests:
<ol>
	<li>Install in your system PHPUnit: <a href="http://pear.phpunit.de/">http://pear.phpunit.de/</a></li>
	<li>And simply run <em>phpunit</em> from the root of project</li>
</ol>
If you want to know if the latest code in github is stable take a look at the Continuous Integration server that I use: <a href="https://travis-ci.org/frandieguez/pingback-php">https://travis-ci.org/frandieguez/pingback-php</a>

&nbsp;
<h2><a href="https://github.com/frandieguez/pingback-php#build-status" name="build-status"></a></h2>