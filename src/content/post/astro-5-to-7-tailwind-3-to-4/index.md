---
title: "Astro 5 to 7, Tailwind 3 to 4: Everything That Broke, Broke Quietly"
description: "Two majors in one afternoon, driven by a security advisory. Exactly one failure stopped the build. The other four shipped green and had to be found by looking."
publishDate: 2026-10-13
lang: "en-GB"
tags: ["astro", "css", "javascript", "developer-tools"]
draft: false
---

This started with a number I did not want: **21 security advisories** on a personal blog that ships no JavaScript.

Updating everything inside its current major took that to 8. The remaining ones had no fix in the Astro 5 line at all. The critical one needed **Astro 7.2.8 or later**.

So: two major versions in one afternoon, not for features, but because the alternative was leaving a known critical advisory open.

Five things broke. **One of them stopped the build.** The other four shipped a green build and a working-looking site, and had to be found by going and looking.

That ratio is the whole point of this post.

## Tailwind had to move first, and I did not choose that

`@astrojs/tailwind` declares a peer range of `astro ^3 || ^4 || ^5`. That single line was the only thing standing between this site and Astro 7.

Conveniently, Tailwind 4 deletes that integration anyway — it ships a Vite plugin instead. So the dependency that blocked the upgrade also stopped existing in the version I needed to move to.

One decision worth stating, because the migration guide nudges the other way: **I kept the v3-style `tailwind.config.ts`** and pointed at it with `@config`, rather than rewriting 430 lines of theme as CSS `@theme` blocks. That is a supported path, not a hack, and it kept a working theme entirely out of the diff. When you are already changing two majors under time pressure from a CVE, the theme is not the thing to also rewrite.

## The loud one

`vite` was pinned to `6.4.3`. That pin was correct when it was written — it had to match the copy Astro 5 resolved internally — and wrong the instant Astro 7 asked for `^8`.

`vite-plugin-svgr` calls `transformWithOxc`, which only exists in the rolldown-based v8. The SVG logo imports failed outright and the build stopped.

This is the failure everyone imagines when they think about a major upgrade: red output, clear cause, fifteen minutes. It was by far the least expensive of the five.

## A dead class came back to life

The header logo carried `flex-grow-1`.

That is not a valid utility in Tailwind v3. It had been inert since the day someone typed it — sitting in the markup, generating nothing, hurting nothing.

v4 supports that name. So on the first build after the upgrade the logo started growing, and pushed the entire navigation **876 pixels to the right**, underneath the search and theme icons.

Nothing in the markup changed. What changed was the meaning of markup that was already there.

:::caution
This is the failure mode to expect from a Tailwind major, and it is worth grepping for deliberately. A class that does nothing in your current version is not neutral — it is a latent instruction waiting for a version that understands it.

Ten more dead usages of `flex-grow` and `flex-shrink-0` turned up in the same audit. Neither version generates them, so I left them alone: making them live now would change a layout that was built, unknowingly, around their absence.
:::

## Twenty-seven `@apply` directives that stopped applying

This is the one that would still be broken if I had trusted the build.

The typography overrides lived in `tailwind.config.ts`, inside the plugin's CSS-in-JS, written as `@apply` directives. Tailwind v4 reads `@config` for *theme values* — but it does not resolve `@apply` inside a plugin's JavaScript object.

So all 27 of them were emitted into the built stylesheet **verbatim**, as literal `@apply ...` declarations, which the browser parsed as invalid and discarded.

Blockquotes, inline code, tables, footnote markers and every admonition silently lost their styling. The build reported success. The pages rendered. Nothing in any log mentioned it.

The fix was moving those rules into `global.css`, where `@apply` is resolved. Which is where the interesting part starts.

## The bug underneath the fix

Moving them out of the config solved the leak and introduced a subtler problem, which survived in production for a while because I reasoned about it instead of measuring it.

They landed in `@layer components`. The typography plugin emits into `@layer utilities`. Utilities is ordered after components, and **layer order beats specificity outright**.

Ten of the twenty-nine rules had been losing ever since.

I had left a comment there arguing they would win: the plugin wraps its selectors in `:where(...)`, which zeroes their specificity, so a plain `.prose x` selector should beat it. The `:where()` part is completely true. The conclusion does not follow — **specificity is only consulted between declarations in the same layer.** Once two rules are in different layers, the later layer wins no matter how weak its selector is.

It failed in the shape that hides best: each rule still applied wherever the plugin declared nothing at all. So everything I checked by eye looked right. Admonitions, striped table rows, the table corner radius — all fine. Meanwhile `hr`, `kbd`, blockquote colour and weight, footnote markers and the heading scale quietly kept the plugin's values.

The tell was an asymmetry I would never have predicted. Table cells were rendering `padding: 4px 8px 8px 0` — where `px-4 py-1` asks for `4px 16px 4px 16px`. The top was right and the other three sides were wrong, because the plugin happens not to declare `padding-top` on `th`. A rule losing everywhere is invisible; a rule losing on three sides out of four is a clue.

Registering the layer explicitly, so it is ordered after the plugin, fixed all of it. Measured on a real post rather than a test page: every cell, not every cell except the first and last. Blockquotes back to weight 400 from 500.

Three of those rules — `kbd`, `sup a`, footnotes — I still cannot verify. There are zero `<kbd>`, `<sup>` and footnote elements across all 405 built pages. They are dead code today, left in for the first post that needs them.

## The linter had not linted anything in weeks

`yarn lint` was exiting before it read a single file. Biome had gone 1.x to 2.5.14 in the dependency sweep, and the config was still in the v1 shape:

```text
biome.json:8   × Found an unknown key `ignore`
biome.json:10  × Found an unknown key `organizeImports`
```

`biome migrate --write` handles the renames. Doing that surfaced **73 errors and 263 warnings**, because Biome 2 lints CSS, SVG and Astro files, none of which v1 touched here.

Almost all of it was the tool being wrong. And wrong in a way that would have caused real damage:

**240 of the 336 diagnostics were `noUnusedImports` and `noUnusedVariables` on `.astro` files.** Biome parses the `---` frontmatter fence as standalone TypeScript and cannot see the template underneath it. So every import used only in the markup reads as unused. In one layout, `Icon` is reported unused on line 9 and used on line 111.

Every one of those was marked fixable. And `yarn format:imports` runs `biome check --write`.

A repaired config plus the formatter anyone runs by reflex would have **deleted 107 working imports** on the first invocation.

The linter is now scoped away from `.astro` entirely, because `astro check` already covers those files and understands both halves of them. `global.css` is excluded too — Biome's CSS parser does not know Tailwind, and produced 49 parse errors from directives it cannot read.

What remained after all that was 34 files and exactly one real finding.

## What it cost

Worth stating plainly, because upgrade write-ups have a habit of ending at "and everything was fine".

The stylesheet went from **16,836 to 19,704 bytes gzipped**. That is v4's output format, not unused theme bloat — it emits twelve `--color-*` custom properties and is already tree-shaking. It gives back rather more than a separate change had just saved by splitting the search stylesheet out of the global bundle.

`tailwind.config.ts` is no longer type-annotated. `Config` and `tailwindcss/defaultTheme` are v3 exports, and annotating a file that Tailwind loads itself produced sixteen errors in exchange for nothing.

And Astro 7 makes a new Markdown processor the default, so `remarkPlugins`, `rehypePlugins` and `remarkRehype` now need `@astrojs/markdown-remark` installed explicitly. That change also took `mdast-util-to-hast` out of scope, and with it the module augmentation declaring `hName`/`hProperties` on mdast `data`. The admonitions plugin kept working perfectly; it just stopped type-checking.

Build output, for what it is worth: 405 pages, 125 sitemap URLs, 132 Pagefind entries, 92 OG cards — identical before and after.

## The part I would actually pass on

Four of five failures produced a green build.

A green build after a major upgrade means the code compiles. It does not mean a single rule in your stylesheet still applies, that a dormant class has not woken up, or that your linter is doing anything at all. Two of these had already shipped to production before anyone noticed, and one of them was hidden behind a comment I had written explaining why it was fine.

So the checklist I would give my past self, in order of how much time each would have saved:

1. **Diff the built output, not the source.** Byte counts, page counts, and a couple of representative pages compared computed-style to computed-style. Every quiet failure here was visible there.
2. **Grep for classes that your current version does not generate.** They are not dead. They are pending.
3. **Verify the tools still run**, not just the build. A linter that exits on its own config reports success in exactly the same way as a linter with nothing to complain about.
4. **Distrust your own comments hardest.** The `:where()` note was written confidently, was half correct, and cost the most.
