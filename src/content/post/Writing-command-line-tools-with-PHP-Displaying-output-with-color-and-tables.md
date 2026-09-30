---
id: 1106
title: 'Command line tools written with PHP (II): displaying output'
description: "Colour, tables and progress in a PHP console tool — and the detail most scripts get wrong: knowing when nobody is watching, because your output has been redirected into a file."
publishDate: 2012-12-21T19:10:00+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["php", "terminal", "scripting", "developer-tools"]
guid: http://www.mabishu.com/?p=1106
permalink: /?p=1106
categories:
  - Uncategorized
seriesId: php-cli-tools
orderInSeries: 2
---
In the [previous post](/posts/command-line-tools-written-with-php-i-handling-input-data/) I went through the three ways a PHP script can take input. This one is about the other half: putting something back out.

Output looks like the easy half. It is not, and the reason is that a command line tool has two audiences with incompatible needs. A person watching a terminal wants colour, alignment and a progress indicator. A cron job wants plain text it can mail you, and a pipeline wants something the next command can parse. Most scripts are written for the first audience and then quietly break for the other two.

## The two streams

Before anything else: there are two output streams, and using only one of them is the most common mistake in PHP console code.

```php
<?php
fwrite(STDOUT, "Copied 412 rows" . PHP_EOL);
fwrite(STDERR, "WARNING: 3 rows skipped" . PHP_EOL);
```

`echo` and `print` write to standard output. That is correct for results — the data your tool produces. It is wrong for everything else. Progress, warnings and errors belong on standard error, because that is what keeps them out of the pipe:

```bash
$ php export.php > users.csv
WARNING: 3 rows skipped
```

The warning reaches the terminal, the CSV reaches the file, and neither contaminates the other. Write your progress messages with `echo` and they end up inside `users.csv`, which you will discover a week later when something downstream fails to parse it.

## Colour

Colour is ANSI escape sequences: an escape character, a bracket, a code, and `m`.

```php
<?php
echo "\033[0;32mOK\033[0m"      . PHP_EOL;  // green
echo "\033[1;31mFAILED\033[0m"  . PHP_EOL;  // bold red
echo "\033[0;33mSKIPPED\033[0m" . PHP_EOL;  // yellow
```

`\033[0m` resets. Forget it and the colour bleeds into everything printed afterwards, including your shell prompt once the script exits.

Writing those by hand does not survive contact with a real tool, so wrap them:

```php
<?php
class Colour
{
    private static $codes = array(
        'green'  => '0;32',
        'red'    => '1;31',
        'yellow' => '0;33',
    );

    public static function paint($text, $colour)
    {
        if (!isset(self::$codes[$colour])) {
            return $text;
        }

        return "\033[" . self::$codes[$colour] . "m" . $text . "\033[0m";
    }
}

echo Colour::paint('OK', 'green') . PHP_EOL;
```

## Knowing when nobody is watching

Here is the part that matters, and the reason this post is not simply a list of escape codes.

Those sequences are instructions to a terminal. Send them somewhere that is not a terminal and they are not interpreted — they are stored. Redirect a colourised script into a file and you get this:

```
^[[0;32mOK^[[0m
^[[1;31mFAILED^[[0m
```

Mail that to yourself from cron and it is unreadable. Grep it and your patterns miss, because the line does not start with `OK`, it starts with an escape character.

So the colour has to be conditional on there being someone to see it:

```php
<?php
class Colour
{
    private static $enabled = null;

    private static function enabled()
    {
        if (self::$enabled === null) {
            self::$enabled = function_exists('posix_isatty') && posix_isatty(STDOUT);
        }

        return self::$enabled;
    }

    public static function paint($text, $colour)
    {
        if (!self::enabled() || !isset(self::$codes[$colour])) {
            return $text;
        }

        return "\033[" . self::$codes[$colour] . "m" . $text . "\033[0m";
    }
}
```

`posix_isatty(STDOUT)` answers exactly the right question: is standard output a terminal, or has it been redirected? One check, consulted once, and the same code now produces colour for a human and clean text for a file.

:::tip
Give the user a way to override it in both directions — a `--no-colour` flag and a `--colour` flag. Automatic detection is right almost always, and the exceptions (a CI server that does render ANSI, a terminal multiplexer that does not) are exactly the cases where guessing wrong is most annoying.
:::

## Tables

Aligned columns need the width of the widest cell in each column, which means two passes: measure everything, then print.

```php
<?php
function renderTable(array $headers, array $rows)
{
    $widths = array();

    foreach (array_merge(array($headers), $rows) as $row) {
        foreach (array_values($row) as $i => $cell) {
            $length = strlen($cell);
            if (!isset($widths[$i]) || $length > $widths[$i]) {
                $widths[$i] = $length;
            }
        }
    }

    $line = '+';
    foreach ($widths as $width) {
        $line .= str_repeat('-', $width + 2) . '+';
    }

    echo $line . PHP_EOL;
    echo renderRow($headers, $widths);
    echo $line . PHP_EOL;

    foreach ($rows as $row) {
        echo renderRow($row, $widths);
    }

    echo $line . PHP_EOL;
}

function renderRow(array $row, array $widths)
{
    $out = '|';
    foreach (array_values($row) as $i => $cell) {
        $out .= ' ' . str_pad($cell, $widths[$i]) . ' |';
    }

    return $out . PHP_EOL;
}
```

```
+----------+-------+---------------------+
| host     | rows  | finished            |
+----------+-------+---------------------+
| db01     | 41233 | 2012-12-21 18:04:11 |
| db02     | 9     | 2012-12-21 18:04:12 |
+----------+-------+---------------------+
```

Two traps live in `strlen()`.

The first is accents. `strlen()` counts bytes, and in UTF-8 `ñ` is two of them, so any cell containing one is padded one character short and the whole column skews. Use `mb_strlen($cell, 'UTF-8')` and `mb_str_pad`'s absence will force you to write the padding yourself — there is no multibyte `str_pad` in PHP, which is an ugly little gap you have to work around by hand.

The second is colour. If you paint a cell *before* measuring it, `strlen()` counts the escape sequences too and pads the column by another nine invisible characters. Measure the plain string, pad it, and colour it last.

## Progress

For a loop that runs long enough to worry someone, carriage return without a newline rewrites the current line in place:

```php
<?php
$total = count($rows);

foreach ($rows as $i => $row) {
    process($row);
    fwrite(STDERR, sprintf("\r  %d/%d rows", $i + 1, $total));
}

fwrite(STDERR, PHP_EOL);
```

On standard error, so it stays out of the pipe. And gate it behind the same `posix_isatty()` check — redirected to a file, `\r` produces one enormous line with every intermediate state still in it.

## Or: none of the above

Everything here is a few dozen lines you now have to maintain and test. The Console component I recommended in the previous post already ships all of it:

```php
<?php
$output->writeln('<info>OK</info>');
$output->writeln('<error>FAILED</error>');
$output->writeln('<comment>SKIPPED</comment>');

$table = $app->getHelperSet()->get('table');
$table->setHeaders(array('host', 'rows', 'finished'))
      ->setRows($rows)
      ->render($output);

$progress = $app->getHelperSet()->get('progress');
$progress->start($output, count($rows));
foreach ($rows as $row) {
    process($row);
    $progress->advance();
}
$progress->finish();
```

`<info>` and `<error>` are resolved against a style map, so the same markup produces colour on a terminal and plain text everywhere else — the `posix_isatty()` check is already inside `ConsoleOutput`. `$output` is an interface, so a test can pass a `BufferedOutput` and assert on the string.

I still think it is worth writing the escape codes once by hand. Not because you should ship them, but because the first time you see `^[[0;32m` in a log file you will know immediately what happened, instead of spending an afternoon on it.

Next: turning one of these tools into something that stays running.
