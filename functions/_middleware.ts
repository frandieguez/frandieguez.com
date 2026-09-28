/**
 * Hostname canonicalisation for Cloudflare Pages.
 *
 * Four hostnames used to serve this site with HTTP 200 and byte-identical
 * bodies, with no redirect between them:
 *
 *   www.frandieguez.com   frandieguez.com   www.frandieguez.dev   frandieguez.dev
 *
 * Every one of them declared <link rel="canonical"> pointing at
 * https://www.frandieguez.com/ — correctly, because the canonical is built from
 * the `site` value in astro.config.ts at build time rather than from the
 * request's Host header. But a canonical is a hint, not a directive, and Google
 * was visibly not taking it: a search for "Fran Dieguez" returned
 * frandieguez.dev ahead of frandieguez.com, whose homepage did not place at all.
 *
 * Cloudflare Pages' `_redirects` file matches on path only, so it cannot express
 * "redirect a whole hostname". A zone-level Redirect Rule in the Cloudflare
 * dashboard would also work and would run before the Worker; this middleware is
 * the version that lives in the repository, gets reviewed, and survives a
 * dashboard being reconfigured by someone else.
 *
 * It also resurrects the WordPress URLs. mabishu.com ran dated permalinks for
 * eighteen years and every one of them 404s here, so inbound links accumulated
 * over that time land on nothing. The mapping is generated from the `permalink`
 * and `guid` fields the WordPress export left in post frontmatter — see
 * scripts/generate-legacy-redirects.mjs. Doing it here rather than in a
 * `_redirects` file keeps it to a single 301 (host and path change together)
 * and is the only way to match the `/?p=<id>` form, which needs a query string.
 *
 * Kept deliberately tiny: it runs on every request, including static assets.
 * The legacy lookups are guarded behind a /blog/ prefix check for that reason.
 */
import { LEGACY_PATHS, LEGACY_POST_IDS } from "./legacy-redirects";

const CANONICAL_HOST = "www.frandieguez.com";

/**
 * Hostnames that should 301 to the canonical one, lowercased.
 *
 * mabishu.com is the original domain this archive was published on for eighteen
 * years. It is a custom domain on this same Pages project, so it was serving the
 * whole site with HTTP 200 — the exact duplicate-content situation described
 * above, on the one hostname with the most accumulated inbound links.
 */
const ALIASES = new Set([
	"frandieguez.com",
	"frandieguez.dev",
	"www.frandieguez.dev",
	"mabishu.com",
	"www.mabishu.com",
]);

/**
 * The shape Pages passes in. Declared locally rather than pulling in
 * @cloudflare/workers-types, which would be a ~2 MB dev dependency and a
 * tsconfig change for the two properties this file actually touches.
 */
interface PagesContext {
	request: Request;
	next: () => Promise<Response>;
}

/** Paths the `?p=<id>` form could be hung off, across the blog's three layouts. */
const ROOTS = new Set(["/", "/blog/", "/blog/index.php/"]);

/**
 * Lookup key for a legacy path. Must match scripts/generate-legacy-redirects.mjs
 * exactly: `/blog/index.php/` collapsed to `/blog/`, trailing slashes dropped,
 * percent-decoded, lowercased.
 *
 * The index.php step matters because the oldest URLs in the archive carry it —
 * `/blog/index.php/2007/06/24/7/` — and the generator stores them collapsed.
 * Normalising on only one side silently misses every one of them.
 */
function legacyKey(pathname: string): string {
	const trimmed = pathname.replace("/blog/index.php/", "/blog/").replace(/\/+$/, "");
	try {
		return decodeURIComponent(trimmed).toLowerCase();
	} catch {
		return trimmed.toLowerCase();
	}
}

/**
 * The old URL this request is asking for, if any.
 *
 * Two families live in the same map. Every path on the WordPress blog began
 * with /blog/, and its pre-permalink form is a `p` query parameter. The second
 * family is /posts/<slug>/ for the short link posts that moved to the note
 * collection — those URLs were live and indexed here, so they redirect rather
 * than 404.
 *
 * Guarded by prefix so the Map lookups never run for ordinary traffic. Static
 * assets fall straight through.
 */
function legacyTarget(url: URL): string | undefined {
	const id = url.searchParams.get("p");
	if (id && ROOTS.has(url.pathname)) {
		const target = LEGACY_POST_IDS.get(id);
		if (target) return target;
	}

	if (!url.pathname.startsWith("/blog/") && !url.pathname.startsWith("/posts/")) {
		return undefined;
	}
	return LEGACY_PATHS.get(legacyKey(url.pathname));
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
	const url = new URL(context.request.url);

	const isAlias = ALIASES.has(url.hostname.toLowerCase());
	const target = legacyTarget(url);

	if (!isAlias && !target) {
		return context.next();
	}

	if (target) {
		// The old URL's query string described the old routing (`?p=1176`), so
		// carrying it onto the new path would be meaningless noise.
		url.pathname = target;
		url.search = "";
	}

	// Preserve the path, the query string and the fragment-free remainder
	// exactly; only the host changes. `:splat`-style truncation here would
	// silently drop query parameters from inbound campaign and referral links.
	url.hostname = CANONICAL_HOST;
	url.protocol = "https:";
	url.port = "";

	return Response.redirect(url.toString(), 301);
};
