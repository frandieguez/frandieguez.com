---
id: 1104
title: 'Command line tools written with PHP (I): handling input data'
description: 'Command line tools written with PHP (I): handling input data'
publishDate: 2012-12-14T16:02:34+00:00
author: Fran Diéguez
layout: post
published: false
draft: true
guid: http://www.mabishu.com/?p=1104
permalink: /?p=1104
categories:
  - Uncategorized
---
In the next posts I will explain how to write command line tools with PHP in a proper way. Starting with handling input and output in this post, to display data with tables and colors, use readline library to create your own PHP-based shell among other tips.

You can use PHP for creating a lot of things not only HTTP applications. You can use it for creating command line tools for batch processing or cron jobs. But every command line tool has to manage input and output. In this post I will explain how to access input data from your PHP scripts.

For command line tools you can pass data by using two different methods:

*   Parameters, i.e --user, -i, --password
*   Standard input
*   Interactive input

## Handling Arguments
Just like the other commandline tools, the typical way of passing information to the script is using arguments. A quick example:

```bash
./whois.php --host=mabishu.com
```

There are different ways in PHP to process this information in an easy way.

### Basic input handling

Inside the PHP script is available the `$_SERVER` global constant which has two important keys "argc" and "argv".

*   argc: contains the number of arguments passed to the script,
*   argv: is an array containing all the different arguments.

Take notice that the first argument is the script's filename, so argc will always be at least 1.

```php
<?php
echo '# of arguments = ' . $_SERVER['argc'] . PHP_EOL;
echo 'Array of arguments = ' ;
print_r($_SERVER['argv']) . PHP_EOL;
```

Will prints the next:

```bash
$ php copy-database.php --user fran --password=hello
# of arguments = 4
Array of arguments = Array (
    [0] => copy-database.php
    [1] => --user [2] => fran
    [3] => --pass=hello
)
```

As you can see the data is in RAW format, so it's a little difficult to user in a simple way. PHP has some other ways to get parameters information so let's see them.

### PHP getopt() function

PHP has a built-in function that will parse the options passed to your script, called [getopt()](http://php.net/manual/en/function.getopt.php "getopt php function"). This function has similar functionality as the getopt function from C language. The function fingerprint is the next.

```php
array getopt ( string $options [, array $longopts ] )
```

1.  The `$options` argument is a string that contains the short options that will be parsed (i.e. -u). For each option you can optionally append a colon or a double colon to the letter. In the first case (:) you tell getopt that this short option requires a value (i.e. -u user). In the second case (::) will tell getopt that the option is an optional value.But take notice that if you put a double colon after an option, the value must be attached to the short option (no spaces). This is the only way for getopt to know that the value is for the option it follows.

2.  The second argument ($longopts) is an array containing the available long options. The long options can in a similar way be followed by a colon or double colon.

#### Example

```php
// Short options
$shortopts = "";
$shortopts.= "hv";  // No values
$shortopts.= "u:";  // Required value
$shortopts.= "p::"; // Optional value

// Long options
$longopts  = array(
    "user:",       // Required value
    "password::",  // Optional value
    "help",        // No value
    "verbose",     // No value
);

$options = getopt( $shortopts, $longopts );

// Show the options passed
printk_r($options);
```

If we run the script, it will output the next:

```bash
$ php getopt-example.php -u root -psecretpass -v

Array
(
    [u] => root
    [p] => secretpass
    [v] =>
)
```

Using long options, this outputs:

```bash
$ php getopt-example.php --user=root --password=secretpass --verbose

Array
(
    [user] => root
    [password] => secretpass
    [verbose] =>
)
```

It's important to note that while you can use short and long options, for getopt() these are two unrelated options. It will not be able to match these in a smart way.

#### Pitfalls

1.  If we put a space before the value next to -p, the parameter value will simply not parsed:

```php
$ php getopt-example.php -u username -p secretpass -v

Array
(
  [u] => username
  [p] =>
)
```

The reason for this is that the parsing of options will stop at the first non-option found. In this case the word "secretpass".

2.  When we forget the value next to -u, the text next to it is treated as it's value:

```php
./02-basic-getopt.php -u -psecret -v
Array
(
  [u] => -psecret
  [v] =>
)
```

As you can see, getopt() is already an improvement to using argc/argv, but it still has some shortcomings. There is no validation and the parser isn't very smart. Luckily PEAR and Zend Framework offer some alternatives.  

### Symfony2 Console Getopt

[http://www.amazium.com/blog/php-in-the-dark-input-output](http://www.amazium.com/blog/php-in-the-dark-input-output)
