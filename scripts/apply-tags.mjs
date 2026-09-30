/**
 * Writes the tags in tag-assignments.mjs into post frontmatter.
 *
 * Reports three things it will not fix on its own, because each one means the
 * assignments and the archive have drifted apart and a human has to say which
 * side is wrong:
 *
 *   - published posts with no entry in the map (silently keeping their old tags)
 *   - entries in the map whose post does not exist (a slug typo)
 *   - tags that end up on fewer than three posts, which the three-post rule
 *     will noindex — useful to see before it happens, not after
 *
 * Run with --dry-run first. Always.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSIGNMENTS } from "./tag-assignments.mjs";

const POST_DIR = "src/content/post";
const DRY = process.argv.includes("--dry-run");
const MIN_POSTS_PER_INDEXED_TAG = 3;

const walk = (dir) =>
	readdirSync(dir).flatMap((entry) => {
		const path = join(dir, entry);
		return statSync(path).isDirectory() ? walk(path) : /\.mdx?$/.test(path) ? [path] : [];
	});

const seenSlugs = new Set();
const missing = [];
const counts = new Map();
let written = 0;

for (const file of walk(POST_DIR)) {
	const raw = readFileSync(file, "utf8");
	const match = /^(---\r?\n)([\s\S]*?)(\r?\n---)/.exec(raw);
	if (!match) continue;

	const [full, open, frontmatter, close] = match;
	if (/^draft:\s*true/m.test(frontmatter)) continue;

	const slug = file
		.replace(/^src\/content\/post\//, "")
		.replace(/\.mdx?$/, "")
		.replace(/\/index$/, "");

	const tags = ASSIGNMENTS.get(slug);
	if (!tags) {
		missing.push(slug);
		continue;
	}
	seenSlugs.add(slug);
	for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);

	// Both YAML shapes exist here: 8 posts inline, 78 in block form from the
	// WordPress export, and a handful with no tags key at all. All three are
	// replaced with one inline list — the only place in this archive where every
	// post ends up written the same way.
	const line = `tags: [${tags.map((t) => `"${t}"`).join(", ")}]`;
	let updated;
	if (/^tags:\s*\[.*?\]\s*$/m.test(frontmatter)) {
		updated = frontmatter.replace(/^tags:\s*\[.*?\]\s*$/m, line);
	} else if (/^tags:[ \t]*\r?\n(?:[ \t]*-[ \t]*.*(?:\r?\n|$))+/m.test(frontmatter)) {
		updated = frontmatter.replace(
			/^tags:[ \t]*\r?\n((?:[ \t]*-[ \t]*.*(?:\r?\n|$))+)/m,
			`${line}\n`
		);
	} else {
		updated = `${frontmatter}\n${line}`;
	}

	if (updated === frontmatter) continue;
	written++;
	if (!DRY) writeFileSync(file, raw.replace(full, `${open}${updated}${close}`));
}

const orphanEntries = [...ASSIGNMENTS.keys()].filter((slug) => !seenSlugs.has(slug));
const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const indexed = sorted.filter(([, n]) => n >= MIN_POSTS_PER_INDEXED_TAG);
const thin = sorted.filter(([, n]) => n < MIN_POSTS_PER_INDEXED_TAG);

console.log(`${DRY ? "[dry run] " : ""}${written} posts written, ${seenSlugs.size} assigned\n`);
console.log(`${sorted.length} tags total — ${indexed.length} indexed, ${thin.length} below the threshold\n`);
console.log("indexed:");
for (const [tag, n] of indexed) console.log(`  ${String(n).padStart(2)}  ${tag}`);
console.log("\nbelow threshold (will be noindex):");
console.log(`  ${thin.map(([t, n]) => `${t} (${n})`).join(", ")}`);

if (missing.length) {
	console.log(`\n!! ${missing.length} published posts with no assignment, tags left untouched:`);
	for (const slug of missing) console.log(`   ${slug}`);
}
if (orphanEntries.length) {
	console.log(`\n!! ${orphanEntries.length} assignments matched no post (check the slug):`);
	for (const slug of orphanEntries) console.log(`   ${slug}`);
}
