#!/usr/bin/env node
/**
 * Push recently changed URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Without this, a newly published post is only discovered whenever those engines
 * next decide to re-crawl the sitemap. IndexNow turns that into a push.
 *
 * Run it AFTER `yarn build`, from a machine or CI job that can reach the
 * internet:
 *
 *     yarn indexnow            # URLs with a lastmod in the past 7 days
 *     yarn indexnow --days 30
 *     yarn indexnow --all      # everything in the sitemap; use sparingly
 *     yarn indexnow --dry-run
 *
 * Deliberately not wired into the build: `astro build` runs on every preview
 * deploy and on every local build, and announcing a preview build to four search
 * engines is not what anyone wants. Google does not participate in IndexNow at
 * all, so this has no effect there either way.
 */
import { readFileSync, readdirSync } from "node:fs";

const ORIGIN = "https://www.frandieguez.com";
const SITEMAP = "dist/sitemap-0.xml";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const days = Number(args[args.indexOf("--days") + 1]) || 7;

/** The key is whatever <hex>.txt sits in public/ — same convention IndexNow uses. */
function readKey() {
	const file = readdirSync("public").find((name) => /^[0-9a-f]{32}\.txt$/.test(name));
	if (!file) {
		throw new Error(
			"No IndexNow key file found in public/. Expected a <32-hex>.txt file."
		);
	}
	return { key: file.replace(/\.txt$/, ""), keyLocation: `${ORIGIN}/${file}` };
}

function collectUrls() {
	const xml = readFileSync(SITEMAP, "utf8");
	const cutoff = Date.now() - days * 86_400_000;
	const urls = [];

	for (const block of xml.split("<url>").slice(1)) {
		const loc = /<loc>(.*?)<\/loc>/.exec(block)?.[1];
		if (!loc) continue;
		if (all) {
			urls.push(loc);
			continue;
		}
		// No lastmod means we cannot tell whether it changed, so leave it alone
		// rather than announcing the whole archive every week.
		const lastmod = /<lastmod>(.*?)<\/lastmod>/.exec(block)?.[1];
		if (lastmod && Date.parse(lastmod) >= cutoff) urls.push(loc);
	}

	return urls;
}

const { key, keyLocation } = readKey();
const urlList = collectUrls();

if (urlList.length === 0) {
	console.log(`IndexNow: nothing changed in the past ${days} days. Skipping.`);
	process.exit(0);
}

console.log(`IndexNow: ${urlList.length} URL(s)`);
for (const url of urlList) console.log(`  ${url}`);

if (dryRun) {
	console.log("IndexNow: --dry-run, nothing submitted.");
	process.exit(0);
}

const response = await fetch(ENDPOINT, {
	method: "POST",
	headers: { "Content-Type": "application/json; charset=utf-8" },
	body: JSON.stringify({
		host: new URL(ORIGIN).hostname,
		key,
		keyLocation,
		urlList,
	}),
});

// 200 accepted, 202 accepted but key still being validated. Both are fine.
if (response.ok || response.status === 202) {
	console.log(`IndexNow: submitted (HTTP ${response.status}).`);
} else {
	console.error(`IndexNow: failed with HTTP ${response.status}`);
	console.error(await response.text());
	process.exit(1);
}
