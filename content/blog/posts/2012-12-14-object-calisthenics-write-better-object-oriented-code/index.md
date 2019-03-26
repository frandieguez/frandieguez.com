---
id: 1125
title: 'Object Calisthenics: write better object-oriented code'
date: 2012-12-14T17:22:16+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1125
permalink: /blog/2012/12/object-calisthenics-write-better-object-oriented-code/
dsq_thread_id:
  - "974477436"
categories:
  - Sofware Development
tags:
  - better
  - calisthenics
  - object
  - object oriented code
---
“Object Calisthenics” is supposedly an exercise to get you to write better object-oriented code. If you want me to sum-up in one sentence I will definitely say:

<cite>“That which obscures my code is bad.”</cite>

We’ve all seen poorly written code that’s hard to understand, test, and maintain. Object-oriented programming promised to save us from the old procedural code. And it promised allowing us to write reusable software incrementally. But sometimes it seems like we’re just chasing down the same old complex, coupled designs in any OO-capable language (Java, PHP, ...) that we had in C.

It's well understood what are the core concepts behind good design, any software engineering book will hightlight seven code qualities that matter: cohesion, loose coupling, no redundancy, encapsulation, testability, readability, and focus. Yet it’s hard to put those concepts into practice there are some other rules that could help us.

<!--more-->
Anyway, Object Calisthenics is an idea suggest by Jeff Bay in <a href="http://www.amazon.co.uk/ThoughtWorks-Anthology-Technology-Innovation-Programmers/dp/193435614X/ref=sr_1_1?ie=UTF8&amp;s=books&amp;qid=1225966906&amp;sr=8-1">The ThoughtWorks Anthology</a> , and lists 9 rules to writing better Object Oriented code. Among those rules are:
<ol>
	<li>Use only one level of indentation per method</li>
	<li>Don’t use the else keyword</li>
	<li>Wrap all primitives and strings</li>
	<li>Use only one dot per line</li>
	<li>Don’t abbreviate</li>
	<li>Keep all entities small</li>
	<li>Don’t use any classes with more than two instance variables</li>
	<li>Don’t use any getters/setters/properties</li>
	<li>Use first-class collections</li>
</ol>
This is not intended to do it in a production code but for example in a <a title="Kata in Wikipedia" href="http://en.wikipedia.org/wiki/Kata_(programming)">code kata</a>. In fact, I found it a little difficult to completely apply all of the rules to any code. Particularly the 7th rule, as in many situations your working model could be a little more complex than this particular rule allows.
<h2>The Challenge</h2>

<h3>Rule 1: One level of indentation per method</h3>
This is really easy as you only has to ensure that the method you are writing only performs one simple tasks: one control structure, or one block of statements, etc. The way to achieve this is to split methods up.

<h3>Rule 2: Don’t use the ELSE keyword</h3>
Nearly every programmer has seen a nasty nested conditional that’s impossible to follow, or a case statement that goes on for pages. Object-oriented languages give us a powerful tool, polymorphism, for handling complex conditional cases. You can take this to avoid the ELSE keyword.

Or if you want an easy approach you can perform "early return" for the particular situation of handling only two conditionals.

<h3>Rule 3: Wrap all primitives and Strings</h3>
This rule tries to encapsulate all the primitives with in objects for allow our programs to work in all our code in a OO-way. For example you can wrap the int primitive like this:
<pre>&lt;?php
class IntegerNumber
{
    private $number;

    public function __construct($number)
    {
        $this-&gt;number = $number;
    }
</pre>

<h3>Rule 4: Use only one dot per line</h3>
In the case of PHP, my language of choice, only one arrow after <em>$this-&gt;</em>, since the former arrow cannot be omitted. Respecting the Law of Demeter was not an issue but it forced you to continuously avoid foreign methods, substituting them with methods on the right class.

<h3>Rule 5: Don’t abbreviate</h3>
It’s often tempting to abbreviate in the names of classes, methods, or variables. Please, resist the temptation – abbreviations can be confusing, and they tend to hide larger problems. The most common example in PHP are C-like languages could be the next one.
<pre>public function isTrue($boolean)
{
    return ($boolean == true) ? true : false;
}</pre>
<h3>Rule 6. Keep all entities small</h3>
This means no class over 50 lines and no package over 10 files. Classes over 50 lines usually do more than one thing, which leads to be harder to understand and harder to reuse. In fact, they have the added benefit of being visible on one screen without scrolling.
By reducing the size of classes and packages you’ll start to see that packages represent clusters of related classes that work together to achieve a goal. Packages, like classes, should be cohesive and have a purpose. Keeping those packages small forces them to have a real identity.
<h3>Rule 7: No classes with more than two instance variables</h3>
Obviously this will force you to do decomposition, but I think this this will make all the package harder to understand.
<h3>Rule 8: No getters/setters/properties</h3>
Well I find this rule really coupled with previous one. If your classes become simpler and try to encapsulate only one of two instance variables you don't need getters or setter methods. The idea behind strong encapsulation boundaries is to force programmers working on the code after you leave it to look for and place behavior into a single place in the object model. This has many beneficial effects, such as a dramatic reduction in duplication errors and a better localization of changes to implement new features.
<h3>Rule 8: Use first-class collections</h3>
Application of this rule is simple: any class that contains a collection should contain no other member variables. Each collection gets wrapped in its own class, so now behaviors related to
the collection will not be mixed with behavior related with the elements. This collection class will include filter methods, and handle activities like joining two groups together or applying a rule to each element of the group.
<h2>Conclusions</h2>
These rules allow us to move us towards object-oriented good habits, or at least to force us to think when we are about to break them. However, design cannot be enforced just by a few rules. Almost all the rules are simply ways to visualize and implement the holy grail of object oriented programming – encapsulation of data. Anothers force you to use the appropriate use of polymorphism, and another is a naming strategy that encourages concise and straightforward naming standards. The entire challenge is to craft code that has no duplication in code or idea. Code which concisely expresses simple and elegant abstractions for the incidental complexity we deal with all day long.

If you want to a real example of Object Calisthenics applied to one real example visit the next link: <a href="http://www.markhneedham.com/blog/2008/11/06/object-calisthenics-first-thoughts/">http://www.markhneedham.com/blog/2008/11/06/object-calisthenics-first-thoughts/</a>
