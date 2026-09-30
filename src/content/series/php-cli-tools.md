---
id: php-cli-tools
title: "Command Line Tools Written With PHP"
description: "PHP outside the web server: reading input and arguments, printing readable output with colour and tables, and writing a proper UNIX daemon."
lang: "en-GB"
---

PHP spent years being treated as a language that only ran behind a web server,
which left the command line underserved even though the runtime was perfectly
capable of it.

The series works up from the smallest piece: taking input and arguments properly,
then printing output a human can read — colour, alignment, tables — and finally
writing something that detaches from the terminal and behaves like a real UNIX
daemon, with signals and a PID file.
