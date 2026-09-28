#!/usr/bin/env node
/**
 * Move short archive posts out of `post` and into `note`.
 *
 * 54 of the 125 published posts are under 200 words. Almost all are 2007-2008
 * link posts carried over from WordPress: a bare Vimeo URL, a single image, a
 * three-word joke. They were being served as articles — masthead, reading time,
 * table of contents, related posts — and, more to the point, they were 43% of
 * the archive sitting in the sitemap as thin pages.
 *
 * Moving them is a URL change, so it is only safe alongside the redirects in
 * functions/_middleware.ts. Run `yarn redirects` afterwards.
 *
 *     node scripts/posts-to-notes.mjs             # dry run
 *     node scripts/posts-to-notes.mjs --apply
 *     node scripts/posts-to-notes.mjs --max-words 100
 *
 * Uses `git mv`, so history follows the file and the move is reviewable as a
 * rename rather than a delete plus an add.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const maxWords = Number(args[args.indexOf("--max-words") + 1]) || 200;

const POST_DIR = "src/content/post";
const NOTE_DIR = "src/content/note";

/** Above this, a post containing code is treated as a tutorial and left alone. */
const CODE_FLOOR = 50;

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) out.push(...walk(path));
		else if (/\.mdx?$/.test(path)) out.push(path);
	}
	return out;
}

/**
 * Body words, ignoring fenced code and image markup.
 *
 * Counting those would rate a post with one screenshot and a config dump as
 * substantial prose, which is the opposite of what this is looking for.
 */
function bodyWords(body) {
	return body
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.split(/\s+/)
		.filter(Boolean).length;
}

const moves = [];

for (const file of walk(POST_DIR)) {
	const source = readFileSync(file, "utf8");
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
	if (!match) continue;

	const frontmatter = match[1];
	if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;

	const body = source.slice(match[0].length);
	const words = bodyWords(body);
	if (words >= maxWords) continue;

	/**
	 * A short post that carries code is a tutorial, not a link post.
	 *
	 * Word count alone gets this wrong, because bodyWords() strips fenced code —
	 * so a piece that is 80% nginx config reads as thin. That is how parts II and
	 * III of the 2008 nginx series landed in the first pass of this list, at 154
	 * and 188 words, next to a three-word joke.
	 *
	 * The floor matters too: below it the code is incidental rather than the
	 * point — a programmer joke whose punchline is a snippet, an embed. Those are
	 * still notes.
	 */
	const hasCode = /```|^ {4}\S/m.test(body);
	if (hasCode && words >= CODE_FLOOR) continue;

	// The note schema demands ISO 8601 with an offset. Every candidate already
	// has one because they came through the WordPress export, but a post written
	// by hand would have a bare date and must not be moved silently.
	const publishDate = /^publishDate:\s*(.+)$/m
		.exec(frontmatter)?.[1]
		?.trim()
		.replace(/^["']|["']$/g, "");
	if (!publishDate || !/T.*(Z|[+-]\d{2}:?\d{2})$/.test(publishDate)) {
		console.warn(`SKIP ${file}: publishDate "${publishDate}" is not ISO 8601 with an offset`);
		continue;
	}

	const isDir = basename(file).startsWith("index.");
	const from = isDir ? dirname(file) : file;
	const slug = isDir ? basename(dirname(file)) : basename(file).replace(/\.mdx?$/, "");
	const to = join(NOTE_DIR, isDir ? slug : basename(file));

	moves.push({ from, to, slug, words, isDir });
}

moves.sort((a, b) => a.words - b.words);

for (const { from, to, words } of moves) {
	console.log(`${String(words).padStart(4)}w  ${from}  ->  ${to}`);
}

if (apply) {
	for (const { from, to } of moves) {
		execFileSync("git", ["mv", from, to]);
	}
}

console.log("");
console.log(`${moves.length} item(s) under ${maxWords} words.`);
console.log(
	apply
		? "Moved. Now run `yarn redirects` so the old /posts/ URLs point at /notes/."
		: "Dry run. Re-run with --apply to move."
);
