---
title: "Forty-Three Percent of My Blog Was Not an Article"
description: "An audit of a nineteen-year archive found 54 of 125 posts under 200 words. Fixing that turned out to be less about deleting things than about measuring them properly."
publishDate: 2026-10-06
lang: "en-GB"
tags: ["seo", "content", "astro", "architecture"]
draft: false
---

I counted the words in every post on this site. Of 125 published pieces, **54 were under 200 words**. Thirty-two were under a hundred.

Here is one of them in full. Title: *Real Wall-E*. Date: December 2008. Body:

```text
http://vimeo.com/2553363
```

That is the entire post. A bare Vimeo URL, pasted into WordPress seventeen years ago, for a video that no longer exists.

It was being served with a masthead, a publication date, an estimated reading time, a table of contents and a block of algorithmically chosen related posts. Roughly forty lines of chrome around one dead link. And it was in my sitemap, offered to Google as a page worth indexing.

Nineteen years of blogging leaves sediment. Mine was 43% of the archive.

## Thin content is a site-wide problem, not a page-level one

The tempting reaction is a shrug. Who cares about one bad page from 2008? Nobody is looking for it.

That framing is wrong, and it took me a while to see why. Search engines do not only score pages; they form a view of a **site**. A domain where two of every five indexable URLs are a sentence long is making a claim about the average quality of what it publishes, and that claim attaches to the posts you actually care about. The nine-hundred-word piece you spent a weekend on is competing while dragging fifty-three three-word pages behind it.

There are four things you can do with a thin page: improve it, remove it, merge it into something larger, or keep it and stop offering it for indexing. I was never going to retroactively write four hundred words about a dead Vimeo link, and deleting it would throw away real history for no gain. So: keep, and stop offering.

## The measurement was the hard part

I wrote a script to find candidates. Word count of the body, ignoring fenced code blocks and image markup — because a post with one screenshot and a config dump shouldn't count the config as prose.

That sounds obviously right. It is also how I nearly destroyed three of my better old posts.

Stripping the code blocks meant that a 2008 tutorial on configuring PHP 5 under nginx scored 188 words. Its sibling on virtual hosts scored 154. A piece on reading memcached statistics scored 134. All three were mostly commands and config — which is to say, all three were mostly *the point*. They appeared in my list of thin pages, sorted by length, sitting between a three-word joke and a photo of a briefcase.

The heuristic wasn't wrong so much as blind in one direction. A short post that carries code is a tutorial. A short post that carries nothing is a link post. The distinction is not length.

```js
// A short post carrying code is a tutorial, not a link post.
const hasCode = /```|^ {4}\S/m.test(body);
if (hasCode && words >= CODE_FLOOR) continue;
```

The floor matters as much as the test. Below fifty words the code is incidental rather than the substance — a programmer joke whose punchline happens to be a snippet, an embed that parses as an indented block. Those are still notes.

With that rule: 34 posts moved, 20 stayed. The nginx series survived intact, which matters more than it sounds, because moving one part of a three-part series and leaving the others would have quietly broken it.

**If you do this on your own archive, look at the tail of your candidate list before you act on it.** Mine was sorted shortest-first, and everything above about 130 words turned out to be a false positive. The measurement that finds your worst pages will also, at its boundary, accuse some of your best ones.

## Moving things does not make them less thin

The 34 went into a separate `notes` collection — short pieces that are not articles, with their own URL space and their own feed.

It would be easy to stop there and feel finished. It would also have achieved nothing. A three-word page at `/notes/real-wall-e/` is exactly as thin as it was at `/posts/real-wall-e/`. Relocating a problem is not solving it.

The part that does the work is two lines: the collection sends `noindex, follow`, and the sitemap drops the whole prefix.

`follow` rather than `none` is deliberate. The instruction is "do not put this page in your index", not "pretend it does not exist". Whatever these pages link to still deserves to be crawled.

The sitemap went from 162 URLs to 123. Two tag pages fell below my three-post threshold for being offered to search engines and dropped out on their own, which is the system working rather than a thing I had to notice.

## Three ways this nearly went wrong

**The schema quietly discarded data.** My notes collection held `title`, `description` and `publishDate` and nothing else. Posts carried `lang` and `tags`. Moving twenty-odd Spanish posts into a collection with no `lang` field would have silently reverted a language pass I had done weeks earlier — putting `en-GB` back on `<html lang>` and `og:locale` for pages written in Spanish, which sends screen readers to the wrong pronunciation engine. The schema had to grow before the content could move. Check what the destination drops before you migrate anything into it.

**YAML parsed my dates behind my back.** The notes schema demanded ISO 8601 with an offset, and my migration script verified the raw text matched. The build failed anyway on all 34. An unquoted `2008-12-20T00:03:36+00:00` is a *native YAML timestamp*: the parser hands the validator a `Date` object, and the string branch never runs. The text was fine; it had just stopped being text before validation saw it.

**The URLs changed, and old links are not renegotiable.** Every one of those 34 had been live at `/posts/<slug>/`. That is not mine to break, so each got a 301 to its new home — folded into the redirect map this site already keeps, which now stands at 193 entries with every destination verified against the build.

## The mistake I actually made

I moved 34 posts into a section that nothing on the site linked to.

Not the header, not the footer, not the blog index. The only anchor pointing at a note lived inside the notes listing — which you could not reach either. So those 34 pieces were out of the main listing, out of the tag pages, out of the related-posts links, out of search by my own instruction, and reachable only by typing a URL.

The redirects meant that anyone holding an old link still landed correctly. There was simply no way left to *discover* any of it. I had confused two separate decisions.

`noindex` is a statement about crawlers. Navigation is a statement about readers. Deciding that Google should not index a 2008 link post says nothing whatsoever about whether a person browsing the site should be able to find it. They are answered by different mechanisms, and I had let one silently answer for both.

A footer entry fixed it. Deliberately the footer and not the main menu — this is a side collection, not a peer of the blog — but the principle is the part worth keeping: **if you noindex a section, check what still links to it.** An orphaned page is worse than a thin one.

## What it cost

91 published posts where there were 125. A sitemap a quarter smaller. Nothing deleted, no link broken, and the archive's actual history still reachable for whoever wants it.

The thing I would tell my past self is not "write longer posts". It is that an archive is infrastructure, and infrastructure needs an audit occasionally. Nineteen years of "this is fine, it's just one page" adds up to a number that would have embarrassed me if anyone had asked me to guess it.

I would have guessed ten percent.
