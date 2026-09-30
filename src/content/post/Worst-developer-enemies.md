---
id: 1539
title: Worst developer enemies
description: "The things that have cost me the most time in ten years of building software are not hard problems. They are four habits that feel like productivity while they are happening."
publishDate: 2013-04-10T13:45:39+00:00
author: Fran Dieguez
layout: post
published: false
draft: true
tags: ["career", "clean-code", "programming-culture", "debugging"]
guid: http://www.mabishu.com/?p=1539
permalink: /?p=1539
categories:
  - Uncategorized
---
Javier Giménez has a [post I keep coming back to](http://gimenete.tumblr.com/post/46929702259/querido-programador-vas-a-recibir-la-visita-de-3) about the visitors every programmer eventually receives. It is funnier than what follows, and it prompted me to write down my own list.

These are not hard problems. Hard problems are fine — they are interesting, they are visible, and everybody agrees they are hard. What follows is the other category: the things that cost me the most time while feeling, at the time, exactly like getting work done.

## "I'll clean this up later"

The most expensive sentence in the language.

It is not a lie when you say it. You genuinely intend to. What makes it costly is that the moment you say it is the moment you have the most context you will ever have about that code — and every hour afterwards, you have less. By the time "later" arrives you are re-deriving the reasoning you already did, from a worse starting position, with the thing now load-bearing.

The version that has worked for me is not "never take shortcuts". It is: take the shortcut, and write down what it costs, in the code, where it will be found.

```php
<?php
// HACK: hardcoded to the Spanish tax rate. The invoice module will need
// per-country rates before this ships to Portugal — see OH-482.
$tax = $amount * 0.21;
```

That comment is not an apology. It is a debt with the interest rate written on it, and a ticket number so it exists somewhere other than your head. A shortcut with a note is a decision. A shortcut without one is an accident waiting to be someone else's problem.

## Debugging by guessing

I still catch myself doing this. A bug appears, I have a hunch, I change something, I reload. It did not work, so I change something else. Twenty minutes later I have made six changes, one of which might have fixed it and two of which have broken other things, and I could not tell you which.

What makes it insidious is that it is *fast*. Each iteration takes fifteen seconds, and fifteen seconds feels like progress in a way that "stop and read the stack trace properly" does not.

The discipline is boring and it always wins: reproduce it reliably before changing anything. If you cannot make it happen on demand, you cannot know you have fixed it — you only know it has stopped happening for now, which is a different and much weaker claim.

Then change one thing at a time. Xdebug with a breakpoint beats twenty `var_dump()` calls, and it beats them by more the worse the bug is.

## Rewriting instead of reading

Inheriting a codebase and immediately wanting to rewrite it is close to universal, and it is almost always wrong.

The code looks bad because you do not know why it is like that yet. Some of it is genuinely bad. But a good portion is a scar — a fix for a customer who does something unusual, a workaround for a broken third-party API, a special case for a data migration in 2009. None of that is in the code. It is in the ticket history, and it will not be in the rewrite.

The rewrite is also the most reliable way to spend three months producing something whose only observable feature is that it does exactly what the old thing did, minus the scars.

What I do now: read it, add tests to the parts I am afraid of, and refactor under those tests. If it is genuinely beyond saving the tests are not wasted — they are the specification for the replacement, and now you have one.

## Working alone

This one took me longest, and it is the one I would most want to tell myself ten years ago.

I used to treat asking for help as a failure of competence, so I would spend three hours on something a colleague had solved the previous month. The maths on that is indefensible and it took me years to do it.

There is also the quieter version: writing code nobody else ever looks at. Not because reviews were rejected, but because it never occurred to me to ask for one on something that worked. Every serious bug I have shipped would have been caught by somebody spending four minutes on the diff — not because they are smarter, but because they had not spent the previous two hours convincing themselves the approach was correct.

:::tip
The rule I settled on: thirty minutes stuck on the same thing, then ask. Out loud, to a person. Half the time you solve it while explaining it, which is annoying and still counts.
:::

## What they have in common

Every one of them is a trade of a known cost now against an unknown cost later, made at the moment when you have the most information and the least patience.

None of them are avoidable by being smarter. I have watched much better engineers than me do all four. What helps is noticing which one you are in the middle of — and in my experience the tell is identical for all of them: the feeling of moving quickly, without being able to say precisely what you have learned in the last twenty minutes.
