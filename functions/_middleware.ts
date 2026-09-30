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

	if (url.pathname.startsWith("/blog/") || url.pathname.startsWith("/posts/")) {
		const exact = LEGACY_PATHS.get(legacyKey(url.pathname));
		if (exact) return exact;
	}

	return structuralTarget(url.pathname);
}

/**
 * WordPress's own furniture: the blog index, the feeds, the tag, category,
 * author and date archives.
 *
 * The generated map covers individual posts, because it is built from the
 * `permalink` and `guid` fields those posts carry. Nothing in the content
 * records the URLs WordPress produced on its own, so every one of these was
 * answering 404 — including `/blog/`, which is the most linked-to URL the old
 * site had, and `/blog/feed/`, which is where its RSS subscribers still point.
 *
 * Tag and category slugs are passed straight through to /tags/. Where the slug
 * survived the move this turns a 404 into a topic page; where it did not, the
 * result is the 404 that was already being served. It cannot be worse than the
 * current behaviour, which is what makes guessing acceptable here.
 */
/**
 * Old taxonomy slugs with no counterpart under /tags/, sent to the post they
 * described instead of through a redirect that only reaches another 404.
 *
 * Sourced from Search Console's "Not found (404)" report rather than guessed:
 * across the whole migration it lists exactly one URL, and the slug carries a
 * typo — "teminologia" for "terminología" — which is why nothing here matches it.
 */
const DEAD_TAXONOMY = new Map<string, string>([
	["teminologia", "/posts/complementos-terminoloxicos-galegos-para-fantasdic/"],
]);

function structuralTarget(pathname: string): string | undefined {
	const path = pathname.replace("/blog/index.php/", "/blog/").toLowerCase();
	const rest = path.startsWith("/blog/") ? path.slice(5) : path;

	// Feeds: /blog/feed/, /feed/, /blog/comments/feed/, and the per-archive feeds
	// WordPress hangs off a tag or category. Anchored at both ends on purpose —
	// an unanchored /feed/?$ would also catch a post whose slug ends in "feed".
	if (/^\/(comments\/|(tag|category)\/[^/]+\/)?feed\/?$/.test(rest)) return "/rss.xml";

	const archive = /^\/(tag|category)\/([^/]+)\/?$/.exec(rest);
	if (archive) {
		const slug = archive[2] ?? "";
		return DEAD_TAXONOMY.get(slug) ?? `/tags/${slug}/`;
	}

	if (/^\/author\//.test(rest)) return "/about/";

	// Date archives: /blog/2008/, /blog/2008/12/. A dated path with a slug on the
	// end is a post, and belongs to the generated map rather than here.
	if (/^\/\d{4}(\/\d{2})?\/?$/.test(rest)) return "/posts/";

	// The blog index itself, and its pagination.
	if (path === "/blog" || path === "/blog/" || /^\/blog\/page\/\d+\/?$/.test(path)) {
		return "/posts/";
	}

	// Submitted to Search Console for years, and never a real file here.
	if (path === "/sitemap.xml") return "/sitemap-index.xml";

	return undefined;
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
