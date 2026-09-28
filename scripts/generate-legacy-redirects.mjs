#!/usr/bin/env node
/**
 * Generate functions/legacy-redirects.ts from the WordPress permalinks kept in
 * post frontmatter.
 *
 * The archive was imported from mabishu.com, which ran WordPress with dated
 * permalinks. Those URLs collected inbound links for eighteen years and every
 * one of them 404s today: /blog/2019/04/dokku-create-your-own-paas/ is gone,
 * the post lives at /posts/dokku-create-your-own-paas/.
 *
 * The export preserved the original URL in a `permalink` field that the content
 * schema ignores, so the old-to-new mapping is already sitting in the content —
 * it only has to be read out. Generating it beats hand-maintaining a redirect
 * list, because a post that gets renamed regenerates its own entry.
 *
 *     node scripts/generate-legacy-redirects.mjs
 *
 * Two permalink shapes appear, both dated: /blog/YYYY/MM/slug/ and
 * /blog/YYYY/MM/DD/slug/. One published post kept WordPress's pre-permalink
 * query form, /?p=1176, which needs the query string and so cannot live in a
 * Cloudflare `_redirects` file — that is why this emits a module for the
 * middleware rather than a _redirects file.
 *
 * Drafts are skipped on purpose: they were published on mabishu.com but never
 * republished here, so there is no destination to send them to. Redirecting
 * them to a 404 on the new domain would be strictly worse than the 404 they
 * already return.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const POST_DIR = "src/content/post";
const NOTE_DIR = "src/content/note";
const OUT = "functions/legacy-redirects.ts";

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) out.push(...walk(path));
		else if (/\.mdx?$/.test(path)) out.push(path);
	}
	return out;
}

/** foo/index.md -> "foo";  foo.md -> "foo". Matches how the glob loader ids them. */
function slugOf(file) {
	return basename(file).startsWith("index.")
		? basename(dirname(file))
		: basename(file).replace(/\.mdx?$/, "");
}

/**
 * Lookup key for a path: no trailing slash, percent-decoded, lowercased.
 *
 * One permalink is `/blog/2007/08/%c2%bfcuando-acabaremos-el-proyecto/`. Percent
 * encoding is case-insensitive, so a crawler may just as well ask for `%C2%BF`;
 * decoding first means both spellings land on the same key. Undecodable input
 * falls back to the raw string rather than throwing.
 */
function key(path) {
	const trimmed = path.replace(/\/+$/, "");
	try {
		return decodeURIComponent(trimmed).toLowerCase();
	} catch {
		return trimmed.toLowerCase();
	}
}

const paths = new Map();
const queryIds = new Map();
let skippedDrafts = 0;
let fromGuid = 0;
let moved = 0;

const postSlugs = new Set(walk(POST_DIR).map(slugOf));

/**
 * A note that used to be a post keeps its old /posts/ URL working.
 *
 * 34 short link posts moved to the note collection, which changed their URL.
 * Every one of them had been live at /posts/<slug>/ and indexed there, and the
 * WordPress redirects below would otherwise point at a page that no longer
 * exists.
 *
 * Emitted for every note, not just the migrated ones: a note that was never a
 * post had no /posts/ URL to begin with, so the entry costs nothing. Guarded
 * against a real post with the same slug, which would otherwise be shadowed.
 */
for (const file of walk(NOTE_DIR)) {
	const slug = slugOf(file);
	if (postSlugs.has(slug)) {
		console.warn(`Both a post and a note claim the slug "${slug}"; leaving /posts/ alone.`);
		continue;
	}
	paths.set(`/posts/${slug}`, `/notes/${slug}/`);
	moved += 1;
}

for (const file of [...walk(POST_DIR), ...walk(NOTE_DIR)]) {
	const source = readFileSync(file, "utf8");
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1];
	if (!frontmatter) continue;

	const raw = /^permalink:\s*(.+)$/m.exec(frontmatter)?.[1];
	if (!raw) continue;

	if (/^draft:\s*true\s*$/m.test(frontmatter)) {
		skippedDrafts += 1;
		continue;
	}

	const permalink = raw.trim().replace(/^["']|["']$/g, "");
	const collection = file.startsWith(NOTE_DIR) ? "notes" : "posts";
	const target = `/${collection}/${slugOf(file)}/`;

	const byId = /^\/\?p=(\d+)$/.exec(permalink);
	if (byId) {
		queryIds.set(byId[1], target);
		continue;
	}

	const normalised = key(permalink);
	if (!/^\/blog\/\d{4}\/\d{2}(\/\d{2})?\/[^/]+$/.test(normalised)) {
		console.warn(`Skipping unrecognised permalink in ${file}: ${permalink}`);
		continue;
	}

	if (paths.has(normalised) && paths.get(normalised) !== target) {
		console.warn(`Duplicate permalink ${normalised}: ${paths.get(normalised)} vs ${target}`);
	}
	paths.set(normalised, target);

	/**
	 * The `guid` field often holds an OLDER URL for the same post — the archive
	 * has `/blog/index.php/2007/06/24/7/` alongside a `/blog/2007/06/7/`
	 * permalink. WordPress documents guid as an opaque identifier rather than a
	 * URL, so this is opportunistic: it is only used when it parses as a blog
	 * path and does not contradict a real permalink.
	 */
	const guid = /^guid:\s*(.+)$/m.exec(frontmatter)?.[1];
	if (!guid) continue;

	let guidPath;
	try {
		guidPath = new URL(guid.trim().replace(/^["']|["']$/g, "")).pathname;
	} catch {
		continue;
	}

	const guidKey = key(guidPath.replace("/blog/index.php/", "/blog/"));
	if (!/^\/blog\/\d{4}\/\d{2}(\/\d{2})?\/[^/]+$/.test(guidKey)) continue;
	if (paths.has(guidKey)) continue;

	paths.set(guidKey, target);
	fromGuid += 1;
}

const sorted = [...paths.entries()].sort(([a], [b]) => a.localeCompare(b));
const sortedIds = [...queryIds.entries()].sort(([a], [b]) => Number(a) - Number(b));

const banner = `/**
 * GENERATED by scripts/generate-legacy-redirects.mjs — do not edit by hand.
 *
 * Original WordPress permalinks from mabishu.com mapped to their current home.
 * Re-run the generator after renaming a post slug.
 */`;

const body = `${banner}

/** Dated permalinks, without a trailing slash. */
export const LEGACY_PATHS = new Map<string, string>([
${sorted.map(([from, to]) => `\t[${JSON.stringify(from)}, ${JSON.stringify(to)}],`).join("\n")}
]);

/** WordPress's pre-permalink form, /?p=<id>. */
export const LEGACY_POST_IDS = new Map<string, string>([
${sortedIds.map(([id, to]) => `\t[${JSON.stringify(id)}, ${JSON.stringify(to)}],`).join("\n")}
]);
`;

writeFileSync(OUT, body);

console.log(`Wrote ${OUT}`);
console.log(`  ${sorted.length} path(s) total`);
console.log(`    ${fromGuid} older URL(s) recovered from guid`);
console.log(`    ${moved} /posts/ -> /notes/ redirect(s) for relocated short posts`);
console.log(`  ${sortedIds.length} /?p=<id> permalink(s)`);
console.log(`  ${skippedDrafts} draft(s) skipped — they have no published destination`);
