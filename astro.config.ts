import { execSync } from "node:child_process";
import fs from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { defineConfig, envField } from "astro/config";
import { siteConfig } from "./src/site.config";
import svgr from "vite-plugin-svgr";

// Remark plugins
import remarkDirective from "remark-directive"; /* handle ::: directives as nodes */
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* add admonitions */
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// Rehype plugins
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";

import rehypePrettyCode from "rehype-pretty-code";
import { transformerMetaHighlight, transformerNotationDiff } from "@shikijs/transformers";

import react from "@astrojs/react";

/**
 * Content-collection data, read straight off disk.
 *
 * The sitemap integration's `filter` and `serialize` hooks run while this config
 * is being evaluated, long before `astro:content` exists, so there is no way to
 * ask the collection API for this. A ~30-line frontmatter reader is cheaper than
 * adding gray-matter and fast-glob as build dependencies for two lookups.
 */
const POST_DIR = new URL("./src/content/post/", import.meta.url);

/** Minimum posts a tag needs before its page is offered for indexing. */
const MIN_POSTS_PER_INDEXED_TAG = 3;

/** Routes that render `<meta name="robots" content="noindex">`. Keep in sync. */
const NOINDEX_PATHS = new Set(["/404", "/404/", "/contact/thanks/"]);

/**
 * Listing pages whose collection is currently empty.
 *
 * Derived rather than hardcoded so this corrects itself: the moment a note or a
 * series file exists, its index drops out of this set and back into the sitemap,
 * with no one having to remember to come edit a list here.
 */
const LISTINGS: { route: string; dir: string }[] = [
	{ route: "/notes/", dir: "./src/content/note/" },
	{ route: "/series/", dir: "./src/content/series/" },
];

const EMPTY_LISTINGS = new Set<string>(
	LISTINGS.filter(({ dir }) => {
		const path = new URL(dir, import.meta.url);
		if (!fs.existsSync(path)) return true;
		return !fs.readdirSync(path).some((name) => /\.mdx?$/.test(name));
	}).map(({ route }) => route)
);

const tagCounts = new Map<string, number>();
const postDates = new Map<string, string>();

/**
 * Last commit date per file under src/content/post/, from a single `git log`.
 *
 * Why not just use publishDate: no post in this archive sets `updatedDate`, so
 * a publishDate-derived lastmod says every page is unchanged since its original
 * publication — including the ~124 posts whose description, `lang` attribute and
 * related-links block were all rewritten on 2026-09-28. A post genuinely edited
 * today would tell Google "nothing since 2007", which is worse than sending no
 * lastmod at all: omission is neutral, a false unchanged-since date actively
 * deprioritises re-crawling exactly the pages that did change.
 *
 * Git's own history is the one source of truth that cannot drift, and it needs
 * no authoring discipline to stay accurate. The trade-off is that a pure
 * formatting commit also moves the date; that is the cheaper error.
 *
 * Fails soft: a shallow clone or a missing git binary just leaves the map empty
 * and every post falls back to publishDate.
 */
const gitDates = new Map<string, string>();
try {
	const log = execSync(
		"git log --format=%aI --name-only --no-merges -- src/content/post",
		{ encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }
	);

	let current: string | null = null;
	for (const line of log.split("\n")) {
		if (line === "") continue;
		// An ISO-8601 line starts a commit block; everything after it is a path,
		// until the next date line. First date wins, since log is newest-first.
		if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
			current = line;
		} else if (current && !gitDates.has(line)) {
			gitDates.set(line, current);
		}
	}
} catch {
	// No git history available (shallow clone, export, CI without .git).
}

for (const entry of fs.readdirSync(POST_DIR, { recursive: true, encoding: "utf8" })) {
	if (!/\.mdx?$/.test(entry)) continue;

	const raw = fs.readFileSync(new URL(entry, POST_DIR), "utf8");
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
	if (!frontmatter) continue;
	if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;

	// Mirrors Astro's glob loader: "foo/index.md" and "foo.md" both yield "foo".
	const slug = entry.replace(/\.mdx?$/, "").replace(/\/index$/, "");

	// Precedence: an explicit updatedDate always wins, then the file's last commit
	// date, then publishDate. See the gitDates comment above for why publishDate
	// alone is not good enough.
	const declared =
		/^updatedDate:\s*["']?([\d-]+)/m.exec(frontmatter)?.[1];
	const published =
		/^publishDate:\s*["']?([\d-]+)/m.exec(frontmatter)?.[1];

	// A post dated in the future has no page yet — getAllPosts() in
	// src/data/post.ts holds it back until its date. Counting its tags here would
	// let an unpublished post push a tag over MIN_POSTS_PER_INDEXED_TAG and put a
	// half-empty tag page in the sitemap before the post that justifies it exists.
	if (published && new Date(published).getTime() > Date.now()) continue;

	const committed = gitDates.get(`src/content/post/${entry}`);

	const lastmod = declared
		? new Date(declared).toISOString()
		: (committed ?? (published ? new Date(published).toISOString() : undefined));
	if (lastmod) postDates.set(slug, lastmod);

	// Both YAML shapes appear in this archive: an inline flow sequence and a
	// block sequence of "- value" lines.
	const inline = /^tags:\s*\[(.*?)\]\s*$/m.exec(frontmatter)?.[1];
	const block = /^tags:\s*\r?\n((?:\s*-\s*.*\r?\n?)+)/m.exec(frontmatter)?.[1];
	const tags = inline
		? inline.split(",").map((t) => t.trim().replace(/^["']|["']$/g, ""))
		: block
			? block
					.split(/\r?\n/)
					.map((line) => line.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, ""))
			: [];

	// The collection schema lowercases AND de-duplicates tags per post
	// (removeDupsAndLowerCase), and the routes are built from those values, so the
	// counts have to agree. Without the Set, a post listing the same tag twice in
	// its own frontmatter inflates that tag's count — which would wrongly push a
	// 2-post tag over the 3-post indexing threshold.
	for (const tag of new Set(tags.filter(Boolean).map((t) => t.toLowerCase()))) {
		tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
	}
}

// https://astro.build/config
export default defineConfig({
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		react(),
		icon(),
		tailwind({
			applyBaseStyles: false,
			nesting: true,
		}),
		sitemap({
			// The sitemap listed 450 URLs for 124 real articles: 304 of them were
			// tag pages, and 249 of those existed to list a single post under a
			// templated title. Tags with fewer than three posts are dropped — they
			// stay reachable and linked, they just stop being volunteered as
			// indexing candidates.
			filter: (page) => {
				const { pathname } = new URL(page);

				// Pages that send `noindex` have no business being volunteered for
				// indexing here — offering and refusing at the same time is just a
				// contradictory signal.
				if (NOINDEX_PATHS.has(pathname)) return false;

				// Index pages with nothing on them yet. /notes/ and /series/ both
				// render fine when their collection is empty, but offering an empty
				// listing to a crawler earns a thin-content impression and nothing
				// else. They return to the sitemap the moment they have an entry.
				if (EMPTY_LISTINGS.has(pathname)) return false;

				if (!pathname.startsWith("/tags/") || pathname === "/tags/") return true;
				const tag = decodeURIComponent(pathname.split("/")[2] ?? "");
				return (tagCounts.get(tag) ?? 0) >= MIN_POSTS_PER_INDEXED_TAG;
			},
			// No <lastmod> was emitted at all (nor priority/changefreq — those two
			// are deliberately still omitted, Google ignores them). Posts already
			// carry real per-post dates in frontmatter; this hands them over.
			serialize: (item) => {
				const { pathname } = new URL(item.url);
				const slug = pathname.replace(/^\/posts\//, "").replace(/\/$/, "");
				const lastmod = postDates.get(slug);
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
		mdx(),
		robotsTxt({
			// There were no AI-crawler directives at all, which is not the same as
			// having decided something. This states the decision explicitly:
			// everything here is public and may be read, by search crawlers and by
			// AI crawlers alike. Named groups exist so the position is on the record
			// rather than inherited from a wildcard — and so that revoking access
			// later is a one-line change rather than a redesign.
			policy: [
				{ userAgent: "*", allow: "/" },
				{ userAgent: "GPTBot", allow: "/" },
				{ userAgent: "OAI-SearchBot", allow: "/" },
				{ userAgent: "ClaudeBot", allow: "/" },
				{ userAgent: "Claude-SearchBot", allow: "/" },
				{ userAgent: "PerplexityBot", allow: "/" },
				{ userAgent: "Google-Extended", allow: "/" },
				{ userAgent: "Applebot-Extended", allow: "/" },
				{ userAgent: "CCBot", allow: "/" },
			],
		}),
		webmanifest({
			// See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
			/**
			 * required
			 **/
			name: siteConfig.title,
			/**
			 * optional
			 **/
			// short_name: "Astro_Citrus",
			description: siteConfig.description,
			lang: siteConfig.lang,
			icon: "public/favicon.svg", // the source for generating favicon & icons
			icons: [
				{
					src: "icons/apple-touch-icon.png", // used in src/components/BaseHead.astro L:26
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "icons/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "icons/icon-512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			start_url: "/",
			// The cream and terracotta of the actual identity. These were the Astro
			// Citrus starter's colours and matched nothing in the design system.
			background_color: "#fff1e8",
			theme_color: "#bc4a24",
			display: "standalone",
			config: {
				insertFaviconLinks: false,
				insertThemeColorMeta: false,
				insertManifestLink: false,
			},
		}),
	],
	markdown: {
		syntaxHighlight: false,

		remarkPlugins: [remarkReadingTime, remarkDirective, remarkAdmonitions],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
			footnoteBackContent: "⤴",
		},

		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["nofollow", "noreferrer"],
					target: "_blank",
				},
			],

			[
				rehypePrettyCode,
				{
					theme: {
						light: "rose-pine-dawn", // after changing the theme, the server needs to be restarted
						dark: "rose-pine", // after changing the theme, the server needs to be restarted
					},

					transformers: [transformerNotationDiff(), transformerMetaHighlight()],
				},
			],
			rehypeUnwrapImages,
		],
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	// Drives canonical URLs, the sitemap, the RSS feeds, robots.txt and the
	// absolute og:image URLs. It was still the starter theme's domain.
	site: "https://www.frandieguez.com/",
	vite: {
		build: {
			sourcemap: true, // Source maps generation
		},
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		plugins: [
			rawFonts([".ttf", ".woff"]),
			svgr({
				include: "**/*.svg?react",
				svgrOptions: {
					plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
					svgoConfig: {
						plugins: ["preset-default", "removeTitle", "removeDesc", "removeDoctype", "cleanupIds"],
					},
				},
			}),
		],
	},
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			WEBMENTION_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
			WEBMENTION_PINGBACK: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
	},
	server: {
		// port: 1234,
		host: true,
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
