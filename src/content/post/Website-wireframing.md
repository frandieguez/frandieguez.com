---
id: 863
title: Website wireframing
description: "Wireframes are not early design, they are a cheap way to have the expensive argument. What they are for, what fidelity costs you, and why I stopped drawing them in anything that could render a gradient."
publishDate: 2013-04-08T15:34:40+00:00
author: Fran Dieguez
layout: post
published: false
draft: true
tags: ["ux", "design", "process"]
guid: http://www.mabishu.com/?p=863
permalink: /?p=863
categories:
  - Uncategorized
---
In my everyday work building web apps and modules for our customers, the most expensive mistakes are never technical. They are the ones where we built the right thing correctly and it was the wrong thing, and nobody found out until it was in front of the client.

Wireframing is the cheapest tool I know for finding that out earlier. Not because it produces a design — it does not — but because it forces a conversation about structure while structure is still free to change.

## What a wireframe is for

A wireframe answers three questions and deliberately refuses to answer any others:

- What is on this page?
- What matters most, and how do I know by looking?
- What can I do from here, and where does it take me?

That is it. No colours, no typefaces, no photography, no copy beyond real headings. Every one of those is a decision that can be made later, and making them early buys nothing while costing the ability to change your mind.

## Fidelity is a cost, not a quality

The counter-intuitive part, and the one that took me longest to accept: a rougher wireframe gets you better feedback.

Show a client something that looks finished and they will respond to how it looks. You will spend the meeting discussing the shade of blue in a button whose *existence* is the actual question. Show them grey boxes and they discuss what goes in the boxes, because that is the only thing on offer.

The same holds inside the team. A pixel-perfect mock invites "can we move that 4px", which is a question with no useful answer three weeks before anybody writes CSS.

So: grey boxes, a single weight of type, `Lorem ipsum` only where the real words genuinely do not matter yet. If a heading is load-bearing — and headings usually are — write the real heading, because "Lorem ipsum dolor" and "Your subscription expires in 3 days" occupy very different amounts of space and carry very different weight.

## Paper first, and for longer than feels reasonable

I draw the first pass on paper, and I keep drawing on paper for longer than I used to.

A sheet of A4 and a pencil produce a layout in ninety seconds and cost nothing to throw away, which is the entire point — the value is in the throwing away. Six sketches on a desk is a conversation. One file on a screen is a proposal, and people argue with proposals differently than they explore sketches.

The rule I ended up with: stay on paper until the structure has stopped changing between drawings. Then move to a tool, because the tool's advantages — reuse, consistency, sharing with somebody who is not in the room — only start to matter once the thing is stable enough to be worth maintaining.

## Tools

I have tried most of them and the honest summary is that it matters much less than it seems to.

Balsamiq is the one I keep coming back to, for a reason that sounds like a weakness: everything it makes looks hand-drawn and slightly wonky, so nobody mistakes it for a design. That is a feature disguised as an aesthetic.

Pencil is free, open source and does the same job with a flatter look. Omnigraffle is more powerful and more likely to seduce you into decoration. Anything that can render a gradient will eventually be used to render a gradient.

I have also wireframed straight into HTML with a plain stylesheet, and it is genuinely good for one specific thing — proving a layout survives a phone — while being genuinely bad at exploration, because changing a structure costs markup instead of a pencil stroke.

## Responsive changes what a wireframe has to say

In 2013 this is the part that most wireframing advice has not caught up with. A single desktop-width wireframe now describes one of at least three layouts, and it is usually the least constrained of them.

So I draw the narrow one first. Deciding what survives at 320px is the hard version of the problem — it forces a real priority order on the content, because there is only one column and something has to be first. Widening a layout that works on a phone is mostly a question of where to put the space; narrowing a desktop layout is a question of what to cut, asked far too late.

:::tip
If two elements cannot both be first on a phone, they were never both "above the fold" on desktop either. You had just hidden the conflict in the horizontal space. The narrow wireframe surfaces priority arguments that a wide one lets you avoid.
:::

## Where they stop being useful

A wireframe describes a page. Most of what we build is not a page, it is a flow — and the interesting parts are the states a single screen has: empty, loading, one result, four hundred results, error, permission denied.

A wireframe of the happy path is a wireframe of the easy fifth of the work. The empty state especially: it is the first thing a new user sees and it is almost always designed last, by which point it is whatever the list looks like with nothing in it.

So I draw the states as well, roughly, on the same sheet. It is the cheapest possible moment to discover that a screen has nine of them.

Six Revisions has a good practical [walkthrough of website wireframing](http://sixrevisions.com/user-interface/website-wireframing/) with more on the tooling side than I have gone into here.
