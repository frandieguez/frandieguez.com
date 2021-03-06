---
id: 1677
title: Simplified version of my PHP test runner
date: 2013-11-13T12:19:44+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1677
permalink: /blog/2013/11/simplified-version-of-test-runner-for-php/
dsq_thread_id:
  - "1962238441"
categories:
  - Sofware Development
tags:
  - PHP
  - TDD
  - test runner
---
In my course of getting continuous <a title="Test your code with every change in your PHP files" href="http://www.mabishu.com/blog/2012/04/15/test-your-code-with-every-change-in-your-php-files/">testing in practice</a> I have improved my test runner by using less dependencies.

```bash
#!/bin/bash
if ! which inotifywait > /dev/null; then
    echo "You must install the inotify-tools package to use this script";

    exit 1;
fi

while true; do
    inotifywait -r -e modify src/ tests/ --excludei "(tpl|js|css|jpg|png|yml|yaml)$" &&
    clear &&
    ant phpunit;
done
```
[Check it out on GitHub](https://gist.github.com/frandieguez/7447297)

Previously I have implemented this by using Ruby and its Watchr gem, but now this script only relies on <em>inotifywait</em> binary available in major distributions.

As usual this script helps you to track your code for changes and if changed it will automatically run a bunch of actions.
