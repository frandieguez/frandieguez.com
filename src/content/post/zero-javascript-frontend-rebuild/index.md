---
title: "What Rebuilding My Blog Taught Me About Zero-JavaScript Frontends"
description: "I rebuilt this site with a zero-JavaScript budget, wrote the targets down, and then broke all four of them in the same redesign. What the numbers actually said."
publishDate: 2026-10-06
lang: "en-GB"
tags: ["astro", "web-performance", "javascript", "css"]
draft: false
---

I rebuilt this site over the last few weeks. Nineteen years of posts, a design system written down for the first time, and a budget I set before writing a line of markup: **no hydrated JavaScript on any page**.

The homepage had three React islands. A typewriter effect, a tech stack banner, and an expandable work history. All three rendered content that never changed after first paint. They went, along with every other `.tsx` in the repository.

That part worked. `grep -ro astro-island dist` returns zero across the whole build.

Then I measured the thing, and found I had broken all four of my own rules in the same redesign.

## The fonts I was sure I had removed

My note said "zero third-party requests". I had pulled a CDN-hosted display font during the redesign and mentally filed the job as done.

I had not checked the other two families. `BaseHead.astro` was still loading a render-blocking stylesheet from `fonts.googleapis.com`, with two full variable families behind it. Lighthouse priced it at roughly **890ms of blocked render on every page on the site**.

The fix is unglamorous: `@fontsource-variable`, self-hosted, bundled into the stylesheet the page already had to download. The `woff2` files land under `/_astro/` with a content hash, which means a year-long `immutable` cache is correct rather than optimistic. There is now no third-party origin left to preconnect to, which is the real win — a `preconnect` is a workaround for a request you should not be making.

The lesson is not "self-host your fonts". Everyone knows that. The lesson is that I wrote down a constraint, satisfied it partially, and then trusted my memory instead of the network panel.

## 29KB of JavaScript for a feature almost nobody used

The budget said "under 15KB of JS". The real figure was **29.4KB gzipped on every route**.

The culprit was site search. `Search.astro` mounted Pagefind from `requestIdleCallback`, which sounds responsible — idle time, no blocking, no jank. But `requestIdleCallback` is not `never`. It fires on essentially every page view, so the search bundle downloaded and parsed for every visitor, the overwhelming majority of whom never open search.

Idle is a scheduling hint. It is not a decision about whether to load something at all.

It now loads on intent. The dynamic `import()` fires from `pointerenter` and `focus` on the search button, both `{ once: true }`, so the bundle is already warming by the time a pointer finishes travelling to the control:

```ts
this.openBtn.addEventListener("pointerenter", warm, { once: true });
this.openBtn.addEventListener("focus", warm, { once: true });
```

Measured against the current build, a post page ships three scripts: the view transitions router, a tiny page script, and the search launcher. **5.97KB gzipped, total.** The Pagefind UI behind them is 78.6KB gzipped and is fetched by exactly the people who ask for it.

## `opacity: 0` and the LCP element

This is the one I would not have guessed.

The redesign has a reveal system — content rises into place as it enters the viewport. Applied to a headline, it looks considered. Applied to a headline, it is also a performance bug.

Chrome's Largest Contentful Paint algorithm **ignores any element currently at `opacity: 0`**. So fading in a page's headline or lead paragraph does not merely delay how it looks. It postpones the LCP measurement itself by the reveal delay plus the transition duration.

On the post template that measured **4311ms on mobile, 89% of it render delay**, with the lead paragraph as the LCP element. The page was painting fine. I was hiding the thing the browser wanted to measure and then fading it in.

The fix was a transform-only `rise` variant: same entrance movement, no fade, applied to exactly the elements that can be an LCP candidate. Headings, standfirsts, and — one commit later, because I missed it the first time — the portrait on `/about/`, which was still on a `scale` variant that inherited `opacity: 0` from the base rule. That page was the last one on the site above the 2.5s threshold, at 2572ms against 2109ms for the homepage.

:::caution
There is a tempting non-fix here: set the initial opacity to `0.01` instead of `0`. LCP starts counting, the number improves, and you ship.

Don't. It games the metric while leaving the text just as unreadable to an actual person. The measurement was right and the design was wrong.
:::

Fades are still used further down the page. Every remaining one sits between 52% and 77% through its document — nowhere near a first paint, and a reader scrolling to them is not waiting on anything.

## The bug no build could have caught

One more, because it is the most instructive failure of the lot.

I added a Content Security Policy. The site built. Every page rendered. Every test I had — which, to be clear, was `astro check` and my eyes — passed.

Site search was completely broken in production.

Pagefind compiles a WebAssembly module, and `script-src 'self' 'unsafe-inline'` does not permit that. Chromium refuses `WebAssembly.instantiate()` unless the directive carries `'unsafe-eval'` or `'wasm-unsafe-eval'`. The dialog opened. The `/pagefind/*.json` fetches succeeded. The UI then sat on "Searching for…" forever.

The fix is one token, and the narrow one:

```diff
- script-src 'self' 'unsafe-inline';
+ script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';
```

`'wasm-unsafe-eval'` permits WebAssembly compilation and nothing else. `'unsafe-eval'` would have worked too, and would also have re-opened `eval()` and `new Function()` for arbitrary JavaScript. When a broad token and a narrow token both make the symptom go away, that is not a tie.

A static build cannot catch this class of bug, because nothing is statically wrong. A Playwright test that opens the dialog, types a query, and asserts the results pane stops saying "Searching for" would have caught it in seconds. I did not have one. I do not have one yet, which is the honest status.

## So what does "zero JavaScript" actually mean

Not what I assumed when I wrote it down.

React is still in `dependencies`, and it cannot leave. The logos are imported with `?react` through `vite-plugin-svgr`, which produces React components that Astro renders **on the server**. Nothing ships to the browser. But `@astrojs/react` and `react` are load-bearing at build time, and a naive `yarn remove react` breaks the site.

That is a normal, healthy state for an Astro project, and it is worth saying out loud because "zero JS" gets used as an identity rather than a measurement. The number that matters is what crosses the network to a phone on a bad connection. Here that is 5.97KB, plus fonts that come from my own origin, plus a search bundle that only the curious pay for.

The numbers that actually moved were not won by removing React. They were won by:

- Not requesting a third-party stylesheet (~890ms of blocked render).
- Not loading a feature until someone reaches for it (29.4KB → 5.97KB).
- Not hiding the LCP element behind a fade (4311ms → under 2.5s across every template).

Three of those four regressions I introduced *during* a redesign whose explicit goal was performance. I wrote the targets down and still missed them, and the only reason I know is that I eventually measured instead of remembering.

If you take one thing from this: write the budget down, then go and check it against the built artefact, not against your intentions. Mine disagreed on every single line.
