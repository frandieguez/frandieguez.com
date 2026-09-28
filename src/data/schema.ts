/**
 * JSON-LD builders.
 *
 * The site shipped zero structured data of any kind — no Person, no
 * BlogPosting, no sameAs. That left Google with nothing machine-readable to
 * distinguish this Fran Dieguez from the pharmacist at frandieguez.es or the
 * several doctors who share the name, which is part of why a search for the
 * name returned a mirror domain ahead of this one.
 *
 * Everything here is derived from data that already exists elsewhere in the
 * repo (site.config.ts, career.ts, post frontmatter) so the graph cannot drift
 * away from what the pages actually say.
 *
 * Deliberately NOT emitted:
 * - SearchAction. Pagefind is a client-only index with no crawlable ?q= route,
 *   and Google's guidance is to declare one only when the target URL is real.
 * - HowTo (deprecated Sept 2023), FAQPage (Google retired the rich result for
 *   all sites on 2026-05-07).
 */
import type { CollectionEntry } from "astro:content";
import { currentPosition } from "@/data/career";
import { siteConfig } from "@/site.config";

const ORIGIN = "https://www.frandieguez.com";

export const PERSON_ID = `${ORIGIN}/#person`;
export const WEBSITE_ID = `${ORIGIN}/#website`;

/** Absolute URL for a site-relative path, always with a trailing slash. */
function abs(path: string): string {
	return new URL(path, ORIGIN).href;
}

/**
 * Identity profiles only. `sameAs` asserts "this URL identifies the same
 * entity" — the GNOME Galician team page is an affiliation, not a profile, so
 * it belongs on `memberOf` instead. Both are the rel="me" links already in the
 * footer, which is the same signal search engines cross-check.
 */
const SAME_AS = [
	"https://www.linkedin.com/in/frandieguez/",
	"https://github.com/frandieguez",
];

export function personSchema() {
	const current = currentPosition();

	return {
		"@type": "Person",
		"@id": PERSON_ID,
		name: siteConfig.author,
		// The accented spelling is the one on the GitHub profile, in ~136 post
		// bodies, and in GNOME commit credits going back to 2009, while everything
		// this site renders is unaccented. Declaring both means those external
		// mentions corroborate the same entity instead of splitting it in two —
		// which matters here because several unrelated people share the name.
		alternateName: "Fran Diéguez",
		url: abs("/"),
		jobTitle: current.roles[0]?.title ?? "Web Tech Lead",
		description: siteConfig.description,
		worksFor: {
			"@type": "Organization",
			name: current.org,
			...(current.orgUrl ? { url: current.orgUrl } : {}),
		},
		memberOf: {
			"@type": "Organization",
			name: "GNOME Foundation",
			url: "https://www.gnome.org/foundation/",
		},
		knowsLanguage: ["en", "es", "gl"],
		sameAs: SAME_AS,
	};
}

export function websiteSchema() {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: abs("/"),
		name: siteConfig.title,
		description: siteConfig.description,
		inLanguage: siteConfig.lang,
		author: { "@id": PERSON_ID },
		publisher: { "@id": PERSON_ID },
	};
}

export function blogPostingSchema(post: CollectionEntry<"post">) {
	const url = abs(`/posts/${post.id}/`);
	const published = post.data.publishDate.toISOString();

	return {
		"@type": "BlogPosting",
		"@id": `${url}#blogposting`,
		mainEntityOfPage: url,
		url,
		headline: post.data.title,
		description: post.data.description,
		image: abs(post.data.ogImage ?? `/og-image/${post.id}.png`),
		datePublished: published,
		dateModified: post.data.updatedDate?.toISOString() ?? published,
		inLanguage: post.data.lang,
		...(post.data.tags.length ? { keywords: post.data.tags } : {}),
		// Sourced from siteConfig, never from the per-post `author` frontmatter:
		// that field is not in the collection schema, nothing renders it, and it
		// spent years holding an accented spelling that contradicts every other
		// signal on the site.
		author: { "@id": PERSON_ID },
		publisher: { "@id": PERSON_ID },
		isPartOf: { "@id": WEBSITE_ID },
	};
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: trail.map((crumb, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: crumb.name,
			item: abs(crumb.path),
		})),
	};
}

export function profilePageSchema() {
	return {
		"@type": "ProfilePage",
		"@id": `${abs("/about/")}#profilepage`,
		url: abs("/about/"),
		name: `About — ${siteConfig.author}`,
		mainEntity: { "@id": PERSON_ID },
	};
}

export function collectionPageSchema({
	path,
	name,
	description,
}: {
	path: string;
	name: string;
	description: string;
}) {
	return {
		"@type": "CollectionPage",
		"@id": `${abs(path)}#collectionpage`,
		url: abs(path),
		name,
		description,
		isPartOf: { "@id": WEBSITE_ID },
	};
}
