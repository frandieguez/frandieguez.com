# frandieguez.com

Source and content for [www.frandieguez.com](https://www.frandieguez.com) — Fran
Dieguez's blog and portfolio. Roughly half the archive is in English and half in
Spanish, with a couple of posts in Galician, going back to 2007.

Built with **Astro 5** (fully static), **Tailwind 3**, and Markdown content
collections. React 19 is a dependency but ships no hydrated islands: it is only
needed at build time, because the logos are imported through `?react`.

## Quick start

Requires **yarn 4** (pinned in `packageManager`). Do not use npm or pnpm.

```sh
yarn install
yarn dev        # dev server
```

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Astro dev server |
| `yarn build` | `astro build` + Pagefind search indexing |
| `yarn preview` | Serve the production build locally |
| `yarn new:post <slug>` | Scaffold a post or note with valid frontmatter |
| `yarn indexnow` | Push changed URLs to Bing/Yandex/Seznam/Naver — run *after* deploy |
| `yarn redirects` | Regenerate the legacy WordPress redirect map — run after renaming a slug |
| `yarn check` | `astro check` — baseline is 3 pre-existing errors, see DESIGN.md §9 |
| `yarn format` | Biome + Prettier |
| `yarn lint` | Biome — ⚠️ currently broken: `biome.json` still uses Biome v1 keys |

## Writing a post

```sh
yarn new:post threejs-maplibre-depth-buffer --tags threejs,maplibre,3d
yarn new:post some-short-thought --note
```

Posts live in `src/content/post/<slug>/index.md`, so images can sit beside the
markdown. The slug is the URL: `/posts/<slug>/`. The Zod schema in
`src/content.config.ts` **fails the build** if `description` or `publishDate` is
missing, and tags are restricted to the vocabulary in
`scripts/tag-vocabulary.mjs`.

Shorter pieces go to `src/content/note/` and get their own feed at
`/notes/rss.xml`. Multi-part posts link to a `src/content/series/<id>.md` entry
through `seriesId` + `orderInSeries`.

Images always go through `<Image>` from `astro:assets`, imported from
`src/assets/` — never `public/`, which emits the asset twice.

## Structure

```text
src/
  pages/        Routes (index, about, contact, posts/, notes/, tags/, series/)
  layouts/      Base.astro, BlogPost.astro, Series.astro
  components/   ui/ home/ career/ blog/ layout/
  data/         career.ts, post.ts, schema.ts — sources of truth, no ad-hoc queries
  content/      post / note / series collections
  plugins/      remark-admonitions, remark-reading-time
  styles/       global.css — theme variables, reveals, code blocks
scripts/        indexnow.mjs, new-post.mjs, tag-vocabulary.mjs
functions/      Cloudflare Pages middleware (apex + .dev domain redirects)
public/_headers CSP and cache policy
```

Imports use the `@/` → `src/` alias.

## Before touching any UI

**[DESIGN.md](./DESIGN.md) is required reading** before writing markup, CSS, or
Tailwind classes here. It documents the real design system — colour tokens,
typography, components, motion — plus a list of known debt not to propagate.
[AGENTS.md](./AGENTS.md) covers repo conventions.

## Deployment

Pushing to `master` deploys to **Cloudflare Pages** (build settings live in the
Cloudflare dashboard; there is no CI config in this repo). `public/_headers`
carries the CSP, HSTS, and cache rules; `functions/_middleware.ts` 301s
`frandieguez.com`, `frandieguez.dev`, and `www.frandieguez.dev` to
`www.frandieguez.com`.

After a production deploy, run `yarn indexnow`. It is deliberately outside the
build so preview deploys are not announced to search engines.

`functions/_middleware.ts` also restores the WordPress URLs this archive was
published under on mabishu.com for eighteen years: `/blog/YYYY/MM/slug/` and the
older `/blog/index.php/YYYY/MM/DD/id/` both 301 to `/posts/slug/`. That map is
generated from the `permalink` and `guid` fields the WordPress export left in
post frontmatter, so **run `yarn redirects` after renaming a post slug** or the
old URL will keep pointing at the old location.

## Features

Pagefind search · RSS for posts and notes · sitemap with `lastmod` derived from
`git log` · OG images generated with satori + resvg · JSON-LD structured data ·
webmentions via webmention.io · `llms.txt` · light/dark themes · admonitions and
reading time via custom remark plugins.
