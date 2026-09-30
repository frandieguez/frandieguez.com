---
id: 1104
title: 'Command line tools written with PHP (I): handling input data'
description: "Three ways a PHP script can take input — argv, getopt() and standard input — what each one gets wrong, and when to stop and reach for Symfony2's Console component instead."
publishDate: 2012-12-14T16:02:34+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["php", "terminal", "scripting", "developer-tools"]
guid: http://www.mabishu.com/?p=1104
permalink: /?p=1104
categories:
  - Uncategorized
seriesId: php-cli-tools
orderInSeries: 1
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

As you can see, getopt() is already an improvement over argc/argv, but it still has some shortcomings. There is no validation and the parser isn't very smart.

There is one more that bites harder than either of those: `getopt()` reads the *real* command line, not an array you hand it. There is no way to say "parse these arguments instead". That makes a script using it essentially untestable — you cannot exercise your own option handling from a PHPUnit test without shelling out to `php` and comparing stdout, which is a functional test wearing a unit test's clothes.

## Standard input

Arguments are fine for a handful of flags, but they are the wrong tool the moment the input is *data* rather than *configuration*. If your tool has to accept a list of domains, a CSV export or the output of another command, it should read standard input, because that is what lets it take its place in a pipeline.

PHP exposes it as a stream, `php://stdin`, and the idiomatic way to consume it is line by line:

```php
<?php
$stdin = fopen('php://stdin', 'r');

while (($line = fgets($stdin)) !== false) {
    echo strtoupper(rtrim($line, PHP_EOL)) . PHP_EOL;
}

fclose($stdin);
```

```bash
$ cat domains.txt | php shout.php
MABISHU.COM
OPENHOST.ES
```

Do not be tempted by `file_get_contents('php://stdin')`. It works, and it will keep working right up until somebody pipes you a 2GB log file, at which point it reads the whole thing into memory at once. `fgets()` costs you one line at a time.

There is also the constant `STDIN`, already open when PHP runs under the CLI SAPI, so the `fopen()` above is strictly unnecessary. I still prefer the explicit form, because it is the one that also works when the source turns out to be a file instead and only a single line has to change.

The part that is easy to get wrong is detecting whether there *is* any standard input. If nothing is piped in, `fgets()` blocks and the script hangs with no output, which to whoever ran it looks exactly like a crash. Ask before you read:

```php
<?php
if (!posix_isatty(STDIN)) {
    // Something is piped or redirected in — safe to read.
}
```

`posix_isatty()` needs the posix extension, which is not always compiled in. When it is missing, `fstat(STDIN)` and a look at `mode` gets you the same answer with more ceremony.

## Interactive input

The third way is to ask. This is the right choice for exactly one kind of value: the one that must not go in an argument, because arguments show up in `ps` output and in the shell history of everyone who runs the tool. Passwords, in other words.

```php
<?php
echo 'Username: ';
$user = rtrim(fgets(STDIN), PHP_EOL);

echo 'Password: ';
system('stty -echo');
$password = rtrim(fgets(STDIN), PHP_EOL);
system('stty echo');
echo PHP_EOL;
```

`stty -echo` stops the terminal from echoing what is typed. Note the explicit `echo PHP_EOL` afterwards: the newline the user pressed was swallowed along with everything else, so without it the next line of output lands on top of the prompt.

This is also where to be disciplined. Prompting is convenient for a human and fatal for a cron job, which will sit there forever waiting for an answer nobody is there to give. Every interactive prompt needs a non-interactive path — an argument, an environment variable, standard input — or the tool cannot be automated, which for a command line tool rather defeats the point.

## When to stop doing this by hand

Everything above is the raw material. For anything past a script of a few dozen lines, I would not write it myself any more.

The Console component from Symfony2 treats arguments and options as a *declaration* rather than a parsing exercise:

```php
<?php
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CopyDatabaseCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('db:copy')
            ->setDescription('Copies a database between two hosts')
            ->addArgument('source', InputArgument::REQUIRED, 'Source host')
            ->addOption('user', 'u', InputOption::VALUE_REQUIRED, 'Database user')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Print the plan and stop');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln(sprintf('Copying from <info>%s</info>', $input->getArgument('source')));
    }
}
```

That buys four things `getopt()` cannot. Required arguments are enforced with a real error message instead of a silent null. Short and long forms are two spellings of *one* option rather than two unrelated ones. `--help` is generated from the same declaration, so it cannot drift out of date with the code. And — the reason I actually moved — `InputInterface` is an interface: you can build an `ArrayInput` in a test and run the command without a subprocess.

The component has no dependency on the rest of the framework. Pull it in on its own:

```json
{
    "require": {
        "symfony/console": "2.1.*"
    }
}
```

So: `$_SERVER['argv']` to understand what is actually happening, `getopt()` for a throwaway, and Console for anything you expect to still be running next year.

In the next post, output — tables, colours, and why `echo` stops being good enough the moment somebody redirects your tool into a file.
