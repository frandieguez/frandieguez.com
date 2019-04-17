---
id: 1132
title: Test your code with every change in your PHP files
date: 2012-04-15T21:35:10+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1132
permalink: /blog/2012/04/test-your-code-with-every-change-in-your-php-files/
dsq_thread_id:
  - "653725137"
categories:
  - Sofware Development
tags:
  - autotest
  - code
  - PHP
  - testing
  - watchr
---
<img class="alignright  wp-image-1169" title="tdd-red-green-refactor-diagram" alt="" src="/assets/2012/04/tdd-red-green-refactor-diagram-300x277.gif" width="210" height="194" />

Applying TDD to your PHP code is a big improve in your code as forces you to "think" the code before write it down. A common approach to TDD workflow could be:

1.  Write your test class
2.  Write your code that make pass the tests
3.  Refactor the code

If you take a closer look, between all the steps you MUST run all the tests for possible functionality breaks with every single change in the code, and make it manually could be a little disturbing.

So for this there are  tools that helps you track your code for changes and if changed will automatically run a bunch of actions.
Some time ago I wrote [an article](http://www.mabishu.com/blog/2008/05/07/autotest-con-advertencias-en-growl/ "Autotest con advertencias en Growl") about this topic but using Ruby language. ## Watchr ruby gem Ruby language has a huge background with TDD and testing in general and you could find simple, but powerful, tools that will help you. Watchr is an agile development tool that monitors a directory tree, and triggers a user defined action whenever an observed file is modified. Its most typical use is continuous testing, and as such it is a more flexible alternative to [autotest](https://github.com/grosser/autotest).

#### Installing watchr

If you have rugygems installed in your system is as simple as execute:

```bash
gem install watchr
```

If you're on Linux/BSD and have the [rev](http://github.com/tarcieri/rev/) gem installed, Watchr will detect it and use it automatically. This will make Watchr evented.

```bash
gem install rev
```

You can get the same evented behaviour on OS X by installing [ruby-fsevent](http://github.com/sandro/ruby-fsevent).

```bash
gem install ruby-fsevent
```

Executing watchr in you PHPUnit based code is as simple as create a configuration file (i.e. watchr.rb) with the next content:

```ruby
watch( '(app/.*\.php)$' ) {|md| system("phpunit -c app/phpunit.xml.dist") }
```

After that you can execute in your terminal:

```bash
watchr watchr.rb
```

This will detect file changes in your php files and execute the phpunit command against them . As you can see a simple tool but that could increase your testing speed by keeping focus in your code. **UPDATE**: I think that is an undergoing library called [ResourceWatcher](https://gist.github.com/1194683 "Symfony ResourceWatcher Component") that will implement this with PHP code, so I will be stay tunned to it.
