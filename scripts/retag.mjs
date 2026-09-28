#!/usr/bin/env node
/**
 * Apply the mechanical tag renames from scripts/tag-vocabulary.mjs to the archive.
 *
 * Only the renames that need no judgement: Spanish/English duplicates of one
 * concept, fossilised typos, and spacing variants. Posts whose tags need an
 * actual editorial decision are left alone and reported at the end.
 *
 *     node scripts/retag.mjs            # dry run, prints every change
 *     node scripts/retag.mjs --apply    # writes the files
 *
 * Frontmatter in this archive uses two shapes, because half of it came from a
 * WordPress export and half was written by hand:
 *
 *     tags: ["ai", "agents"]        <- inline flow sequence
 *     tags:                          <- block sequence
 *       - Archlinux
 *       - AUR
 *
 * Both are handled. Nothing outside the `tags:` block is touched.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { TAG_ALIASES } from "./tag-vocabulary.mjs";

const apply = process.argv.includes("--apply");
const ROOT = "src/content/post";

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) out.push(...walk(path));
		else if (path.endsWith(".md") || path.endsWith(".mdx")) out.push(path);
	}
	return out;
}

/** The schema lowercases tags anyway, so compare that way and rename in kind. */
function rename(tag) {
	const key = tag.trim().toLowerCase();
	return TAG_ALIASES[key];
}

const changed = [];
let renameCount = 0;

for (const file of walk(ROOT)) {
	const original = readFileSync(file, "utf8");

	// Frontmatter only: everything between the first two --- fences.
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(original);
	if (!match) continue;

	const frontmatter = match[1];
	const lines = frontmatter.split("\n");
	const edits = [];
	let inBlockTags = false;

	const updated = lines.map((line) => {
		// Inline form: tags: ["a", "b"]
		const inline = /^(\s*tags:\s*)\[(.*)\]\s*$/.exec(line);
		if (inline) {
			inBlockTags = false;
			const items = inline[2]
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
			const next = items.map((item) => {
				const quote = item.startsWith("'") ? "'" : '"';
				const bare = item.replace(/^['"]|['"]$/g, "");
				const to = rename(bare);
				if (!to) return item;
				edits.push(`${bare} -> ${to}`);
				return `${quote}${to}${quote}`;
			});
			return `${inline[1]}[${next.join(", ")}]`;
		}

		// Start of block form: tags:  (nothing after the colon)
		if (/^\s*tags:\s*$/.test(line)) {
			inBlockTags = true;
			return line;
		}

		// An item inside the block form
		if (inBlockTags) {
			const item = /^(\s*-\s+)(.*?)\s*$/.exec(line);
			if (item) {
				const quote = /^['"]/.test(item[2]) ? item[2][0] : "";
				const bare = item[2].replace(/^['"]|['"]$/g, "");
				const to = rename(bare);
				if (!to) return line;
				edits.push(`${bare} -> ${to}`);
				return `${item[1]}${quote}${to}${quote}`;
			}
			// Any other key ends the block sequence
			if (/^\s*\S+:/.test(line)) inBlockTags = false;
		}

		return line;
	});

	if (edits.length === 0) continue;

	renameCount += edits.length;
	changed.push({ file, edits });

	if (apply) {
		const nextFrontmatter = updated.join("\n");
		writeFileSync(file, original.replace(frontmatter, nextFrontmatter));
	}
}

for (const { file, edits } of changed) {
	console.log(`${file}`);
	for (const edit of edits) console.log(`    ${edit}`);
}

console.log("");
console.log(`${renameCount} rename(s) across ${changed.length} file(s).`);
if (!apply) console.log("Dry run. Re-run with --apply to write.");
