---
id: 938
title: Indent your HTML code with a Smarty plugin
date: 2011-01-27T23:09:52+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=938
permalink: /blog/2011/01/indent-your-html-code-with-a-smarty-plugin/
dsq_thread_id:
  - "654069406"
categories:
  - Sofware Development
tags:
  - development
  - PHP
  - php5
  - plugin
  - server
  - smarty
---
<img class="alignright" title="XHTML code" src="/assets/2011/01/images.jpg" alt="XHTML code" width="259" height="194" />

If you are using Smarty as a template system in your PHP project you will be very pleased to use this tiny-but-very-useful outputfilter that I made.

Smarty as you can read in<a title="Smarty documentation" href="http://www.smarty.net/docs/en/"> its documentation </a>has <a href="http://www.smarty.net/docs/en/plugins.block.functions.tpl">some</a> <a href="http://www.smarty.net/docs/en/plugins.block.functions.tpl">extension</a> <a href="http://www.smarty.net/docs/en/plugins.compiler.functions.tpl">points</a> where you can create plugins into to extend its functionality. One of them are <a href="http://www.smarty.net/docs/en/plugins.outputfilters.tpl">outputfilters</a>, that allow us to operate on a template's output, after the template is loaded and executed, but before the output is displayed.

So you can modify your final HTML code with those extentions point without a any pain.

<!--more-->
<h3>The code</h3>
<pre><code>/**
* Output Filter for indent HTML code after sending it to the end user.
*
* @param string $output, the HTML code without proper indentation
* @return string, the HTML code with proper indentation
*/
function smarty_outputfilter_indent_html($output, &amp;$smarty)
 {

     $config = array(
           'indent'         =&gt; true,
           'output-xhtml'   =&gt; true,
           'wrap'           =&gt; 200,
           'drop-proprietary-attributes'    =&gt;    false,
           'indent-cdata' =&gt; true,
           'indent-spaces' =&gt; 4,
    );

    try {

        // Use tidy library to make up the HTML code
        $tidy = new tidy;
        $tidy-&gt;parseString($output, $config, 'utf8');
        $tidy-&gt;cleanRepair();

    } catch (Exception $e) {
        // If something went wrong just output the original HTML code
        $tidy = $output;
    }

    // Output the HTML code
    return $tidy;

 }</code></pre>
<h3>Installation</h3>
For use this plugin you must have installed in your server the tidy PHP module. If you have a Debian based server it's quite simple. Just issue in your terminal:
<pre><code> sudo apt-get install php5-tidy</code></pre>
and after that remember to restart the server, in my case Apache 2:
<pre><code> sudo service apache2 restart</code></pre>
after that you can drop the file in your smarty plugins directory and register into the Smarty object.
<pre><code>class Template extends Smarty
{
    function __construct($theme, $filters=array())
    {
        $this-&gt;loadFilter("output","indent_html");
    }
}</code></pre>
This code is under the BSD license, so feel free to use it
