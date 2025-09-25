---
id: 938
title: Indent your HTML code with a Smarty plugin
description: Indent your HTML code with a Smarty plugin
publishDate: 2011-01-27T23:09:52+00:00
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
<div class="aligncenter">

![XHTML](./images.jpg)
</div>

If you are using Smarty as a template system in your PHP project you
will be very pleased to use this tiny-but-very-useful outputfilter that
I made. Smarty as you can read in [its
documentation](http://www.smarty.net/docs/en/ "Smarty documentation")
has [some](http://www.smarty.net/docs/en/plugins.block.functions.tpl)
[extension](http://www.smarty.net/docs/en/plugins.block.functions.tpl)
[points](http://www.smarty.net/docs/en/plugins.compiler.functions.tpl)
where you can create plugins into to extend its functionality. One of
them are
[outputfilters](http://www.smarty.net/docs/en/plugins.outputfilters.tpl),
that allow us to operate on a template's output, after the template is
loaded and executed, but before the output is displayed. So you can
modify your final HTML code with those extentions point without a any
pain.

### The code

```php
/**
  * Output Filter for indent HTML code after sending it to the end user.
  *
  * @param string $output, the HTML code without proper indentation
  * @return string, the HTML code with proper indentation
  */
function smarty_outputfilter_indent_html($output, &amp;$smarty)
{

  $config = [
    'indent'         => true,
    'output-xhtml'   => true,
    'wrap'           => 200,
    'drop-proprietary-attributes'    =>    false,
    'indent-cdata' => true,
    'indent-spaces' => 4,
  ];

  try {

    // Use tidy library to make up the HTML code
    $tidy = new tidy;
    $tidy->parseString($output, $config, 'utf8');
    $tidy->cleanRepair();

  } catch (Exception $e) {
      // If something went wrong just output the original HTML code
      $tidy = $output;
  }

  // Output the HTML code
  return $tidy;

}
```
### Installation
or use this plugin you must have installed in your server the tidy PHP
module. If you have a Debian based server it's quite simple. Just issue
in your terminal:

```
sudo apt-get install php5-tidy
```

and after that remember to restart the server, in my case Apache 2:

```
sudo service apache2 restart
```

after that you can drop the file in your smarty plugins directory and
register into the Smarty object.

```php
class Template extends Smarty
{
    function __construct($theme, $filters=array())
    {
        $this->loadFilter("output","indent_html");
    }
}
```

This code is under the BSD license, so feel free to use it
