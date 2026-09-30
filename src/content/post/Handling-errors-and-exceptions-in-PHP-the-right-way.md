---
id: 1108
title: 'Handling errors and exceptions in PHP: the right way'
description: "PHP has two parallel error systems that do not talk to each other. Converting one into the other, and registering the three handlers that catch what is left, is what makes a failure debuggable instead of a blank page."
publishDate: 2012-12-25T02:13:14+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["php", "debugging", "clean-code"]
guid: http://www.mabishu.com/?p=1108
permalink: /?p=1108
categories:
  - Uncategorized
---
PHP has two error systems. They were built a decade apart, they do not talk to each other, and almost every "the page is just blank" afternoon I have spent starts with that fact.

The old one is errors: `E_WARNING`, `E_NOTICE`, `E_FATAL`. They are raised by the engine and by most of the standard library, they are reported rather than thrown, and by default execution carries on afterwards. The new one is exceptions, raised with `throw`, caught with `try`/`catch`, and fatal if nothing catches them.

The consequence is the thing worth internalising:

```php
<?php
try {
    $contents = file_get_contents('/does/not/exist');
} catch (Exception $e) {
    // Never runs.
}

var_dump($contents);  // bool(false)
```

`file_get_contents()` raises `E_WARNING` and returns `false`. The `catch` block is decoration. Half of PHP's standard library behaves this way, which means a codebase that handles errors purely with `try`/`catch` is handling almost nothing.

## Making one system out of two

The fix is to convert errors into exceptions, so there is only one thing to handle.

```php
<?php
function exceptionErrorHandler($severity, $message, $file, $line)
{
    // Respect the error_reporting level, including the @ operator.
    if (!(error_reporting() & $severity)) {
        return false;
    }

    throw new ErrorException($message, 0, $severity, $file, $line);
}

set_error_handler('exceptionErrorHandler');
```

`ErrorException` exists precisely for this and carries the severity alongside the usual message, file and line. Now the earlier example behaves the way it reads:

```php
<?php
try {
    $contents = file_get_contents('/does/not/exist');
} catch (ErrorException $e) {
    // Runs.
}
```

The `error_reporting() & $severity` check is not optional. Without it the `@` suppression operator stops working — and while `@` is a bad habit, it is a bad habit that exists inside libraries you did not write, and turning it into a thrown exception breaks them in ways that are very hard to trace back to this function.

:::caution
This makes your application stricter than it was. A codebase that has been quietly emitting notices for years will start throwing them, and the first deploy after adding this can light up like a Christmas tree. Turn it on in development first, fix what it finds, and only then promote it.
:::

## What set_error_handler cannot catch

It does not catch fatals. `E_ERROR`, `E_PARSE`, `E_CORE_ERROR` and `E_COMPILE_ERROR` never reach a user handler — calling an undefined function, exhausting memory, or a syntax error in an included file all bypass it entirely.

For those there is exactly one hook, and it is the shutdown function:

```php
<?php
function fatalErrorHandler()
{
    $error = error_get_last();

    if ($error === null) {
        return;
    }

    $fatal = array(E_ERROR, E_PARSE, E_CORE_ERROR, E_CORE_WARNING,
                   E_COMPILE_ERROR, E_COMPILE_WARNING);

    if (!in_array($error['type'], $fatal, true)) {
        return;
    }

    logFailure($error['message'], $error['file'], $error['line']);
    renderErrorPage();
}

register_shutdown_function('fatalErrorHandler');
```

This runs after the script has already died, which constrains what is possible. There is no stack trace, no variables, and no continuing. What there is, is the message, the file and the line — which is the difference between a bug report that says "the page was blank" and one that says which line it was blank on.

One trap worth knowing: if the fatal was a memory exhaustion, your handler needs memory to run, and there is none. The usual defence is to reserve some in advance and release it at the top of the handler:

```php
<?php
$reserve = str_repeat(' ', 1024 * 256);

function fatalErrorHandler()
{
    global $reserve;
    $reserve = null;
    // ... now there is room to work
}
```

## The third handler

Uncaught exceptions get their own hook, and registering it is what stops PHP printing a stack trace — file paths, framework internals, sometimes a database password in a connection string — to whoever happened to be looking.

```php
<?php
function uncaughtExceptionHandler(Exception $e)
{
    logFailure(
        get_class($e) . ': ' . $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
        $e->getTraceAsString()
    );

    renderErrorPage();
}

set_exception_handler('uncaughtExceptionHandler');
```

The pairing that actually matters in production is this one:

```php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL | E_STRICT);
```

Report everything, log everything, show nothing. The mistake is not turning `display_errors` off — everyone does that. It is turning `error_reporting` down at the same time, which does not hide the errors from users, it hides them from *you*.

## Exceptions that say something

With one system left, the remaining question is what to throw. SPL ships a hierarchy and most code ignores it, which is a shame, because the distinction it draws is the useful one:

- `LogicException` and its children (`InvalidArgumentException`, `DomainException`, `LengthException`) are programmer errors. Somebody called the method wrong. These should never be caught in production — they should reach the log and get fixed.
- `RuntimeException` and its children (`OutOfBoundsException`, `OverflowException`, `UnexpectedValueException`) are conditions the program could not have known in advance. The network was down, the file moved. These are the ones worth catching.

```php
<?php
class ConfigurationNotFound extends RuntimeException {}

if (!file_exists($path)) {
    throw new ConfigurationNotFound(
        sprintf('Configuration file "%s" does not exist', $path)
    );
}
```

Two things there. The class name carries information a `catch` can use without string-matching the message. And the message contains the path — the value that was wrong, not just the shape of the problem. "Configuration file not found" tells you nothing you did not already know from the stack trace.

## The whole thing

```php
<?php
// bootstrap.php — as early as possible.
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

set_error_handler('exceptionErrorHandler');
set_exception_handler('uncaughtExceptionHandler');
register_shutdown_function('fatalErrorHandler');
```

Three handlers, because there are three ways for PHP to fail and no single hook sees all of them. Miss any one and there is a category of failure that reaches your users as a blank page and reaches you as nothing at all.
