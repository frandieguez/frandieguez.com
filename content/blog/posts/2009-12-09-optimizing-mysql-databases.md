---
id: 520
title: Optimizing MySQL databases
date: 2009-12-09T21:22:51+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=520
permalink: /blog/2009/12/optimizing-mysql-databases/
dsq_thread_id:
  - "657684433"
categories:
  - System Administration
  - Web
tags:
  - configuration
  - mysql
  - server
---
A huge used database reverberate on a more fragmented database even if you delete any large data. The data base admin should optimize and take care of this especially if dealing with a lot of varying characters (VARCHAR).

At this article I will explain how to opmimize MySQL databases with tools that mysql provides. I will separate on two cases:
<ul>
<li>Optimizing just one table</li>
<li>Optimizing all the tables on a database</li>
</ul>
The main disvantage is that you can only optimize MyISAM, InnoDB, and ARCHIVE tables.



<!--more-->
<h3>Optimizing just one table</h3>
Optimizing a single table is very easy. Here is the command that how we can optimize MySQL database single table with command line.
<pre>OPTIMIZE TABLE  my_table;</pre>
I think that is self-explanatory but if you have some doubt refer to <a title="Mysql optimize documentation" href="http://dev.mysql.com/doc/refman/5.1/en/optimize-table.html">MySQL OPTIMIZE documentation</a>.
<h3 style="font-size: 1.17em;">Optimizing all the tables from a database</h3>
The above command only work on single table so if you want to optimize whole database in just one step you should worl with mysqlcheck command:
<pre style="font: normal normal normal 12px/18px Consolas, Monaco, 'Courier New', Courier, monospace;">mysqlcheck -op -u granted_user your_database_name</pre>
Let me explain this command. The ‘o’ parameter refers to optimize, the ‘p’ parameter is for force mysql to ask us for a password, the -u parameter is for insert a custom user to connecto to MySQL server. Take notice that the above user should have appropriate right to access that database.
Finally if you want to optimize all MySQL databases then do this.
<pre>mysqlcheck -op -u granted_user –all-databases</pre>
<h3 style="font-size: 1.17em;">Bonus tip</h3>
You can also repair MySQL database with mysqlcheck, just replace the 'o' parameter with‘r’ instead e.g.
<pre>mysqlcheck -rp your_database_name</pre>