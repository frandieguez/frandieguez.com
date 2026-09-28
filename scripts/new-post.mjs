#!/usr/bin/env node
/**
 * Scaffold a new post or note with valid frontmatter.
 *
 * The content schema in src/content.config.ts fails the build when `description`
 * or `publishDate` is missing, and `note` additionally demands ISO 8601 with an
 * offset — which is easy to get wrong by hand and only tells you at build time.
 * This writes a file that is correct by construction, and refuses tags outside
 * the controlled vocabulary so the 302-tags-for-124-posts situation does not
 * quietly rebuild itself.
 *
 *     yarn new:post threejs-maplibre-depth-buffer
 *     yarn new:post six-months-of-agent-skills --title "Six Months of Agent Skills"
 *     yarn new:post maplibre-camera-sync --tags threejs,maplibre,3d --date 2026-12-15
 *     yarn new:post 3d-indoor-map-60fps --series indoor-3d-web --order 2
 *     yarn new:post local-gitignore --note
 *
 * Posts land in src/content/post/<slug>/index.md — the directory form, so images
 * can sit beside the markdown. Notes are single files in src/content/note/.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { TAG_VOCABULARY } from "./tag-vocabulary.mjs";

const VALUE_FLAGS = ["title", "tags", "date", "series", "order"];

const args = process.argv.slice(2);
const options = {};
const positional = [];

for (let i = 0; i < args.length; i += 1) {
	const arg = args[i];
	if (!arg.startsWith("--")) {
		positional.push(arg);
		continue;
	}
	const name = arg.slice(2);
	if (VALUE_FLAGS.includes(name)) {
		options[name] = args[i + 1];
		i += 1; // consume the value so it never looks like the slug
	} else {
		options[name] = true;
	}
}

const flag = (name) => (typeof options[name] === "string" ? options[name] : undefined);
const slug = positional[0];
const isNote = options.note === true;

if (!slug) {
	console.error("Usage: yarn new:post <slug> [--title T] [--tags a,b] [--date YYYY-MM-DD]");
	console.error("                          [--series ID] [--order N] [--note]");
	process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
	console.error(`Slug "${slug}" is not kebab-case. The slug becomes the URL, so keep it`);
	console.error("lowercase with single hyphens: threejs-maplibre-depth-buffer");
	process.exit(1);
}

const tags = (flag("tags") ?? "")
	.split(",")
	.map((tag) => tag.trim().toLowerCase())
	.filter(Boolean);

const unknown = tags.filter((tag) => !TAG_VOCABULARY.includes(tag));
if (unknown.length > 0) {
	console.error(`Unknown tag(s): ${unknown.join(", ")}`);
	console.error("");
	console.error("The vocabulary is:");
	console.error(`  ${TAG_VOCABULARY.join(" · ")}`);
	console.error("");
	console.error("Add a genuinely new one to scripts/tag-vocabulary.mjs on purpose,");
	console.error("rather than inventing it here.");
	process.exit(1);
}

/** "threejs-maplibre-depth-buffer" -> "Threejs Maplibre Depth Buffer" */
function titleFromSlug(value) {
	return value
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

const title = flag("title") ?? titleFromSlug(slug);
const date = flag("date") ?? new Date().toISOString().slice(0, 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
	console.error(`--date must be YYYY-MM-DD, got "${date}"`);
	process.exit(1);
}

const target = isNote
	? join("src/content/note", `${slug}.md`)
	: join("src/content/post", slug, "index.md");

if (existsSync(target)) {
	console.error(`${target} already exists. Not overwriting.`);
	process.exit(1);
}

let frontmatter;

if (isNote) {
	// The note schema is the strict one: .datetime({ offset: true }). Anything
	// looser is a build failure, so emit a full ISO instant rather than a date.
	const instant = `${date}T09:00:00Z`;
	frontmatter = [
		"---",
		`title: "${title}"`,
		`description: ""`,
		`publishDate: "${instant}"`,
		"---",
	];
} else {
	const series = flag("series");
	const order = flag("order");
	frontmatter = [
		"---",
		`title: "${title}"`,
		`description: ""`,
		`publishDate: ${date}`,
		`lang: "en-GB"`,
		`tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]`,
		...(series ? [`seriesId: ${series}`] : []),
		...(order ? [`orderInSeries: ${order}`] : []),
		"draft: true",
		"---",
	];
}

const body = isNote
	? "\n"
	: `\n<!-- description is required and must be filled in before publishing. -->\n`;

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${frontmatter.join("\n")}\n${body}`);

console.log(`Created ${target}`);
if (!isNote) {
	console.log("");
	console.log("Next: write `description` (the build fails without it), then drop");
	console.log("`draft: true` when it is ready to ship.");
}
