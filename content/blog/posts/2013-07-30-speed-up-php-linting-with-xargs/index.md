---
id: 1630
title: Speed up PHP linting with xargs
date: 2013-07-30T18:31:53+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1630
permalink: /blog/2013/07/speed-up-php-linting-with-xargs/
dsq_thread_id:
  - "1548227962"
categories:
  - Uncategorized
---
Most of us use Jenkins to continuously integrate our projects with every commit to the repository, but when it comes with PHP most of the time is spent "<a title="Linting software" href="http://en.wikipedia.org/wiki/Lint_(software)">linting</a>".

This action is badly slow and if your project has a lot of files this will take a good percentage of your build time. A really good approach could be executing this task with different files in parallel. For this you can use the powerful <em>xargs</em> command with -P0, which allows xargs to run as many processes as possible at a time.

<pre>find codefolder/ -name "*.php" -print0 | xargs -0 -n1 -P0 php -l</pre>

So the final snippet for your Ant based project will be:
<pre>
&lt;target name="lint"&gt;
  &lt;exec executable="sh" failonerror="true"&gt;
      &lt;arg value="-c" /&gt;
      &lt;arg value="find ${project.paths.php.space-separated} -name *.php -print0 | xargs -0 -n1 -P0 php -l"/&gt;
  &lt;/exec&gt;
&lt;/target&gt;</pre>