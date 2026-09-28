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
 * Kept deliberately tiny: it runs on every request, including static assets.
 */

const CANONICAL_HOST = "www.frandieguez.com";

/** Hostnames that should 301 to the canonical one, lowercased. */
const ALIASES = new Set([
	"frandieguez.com",
	"frandieguez.dev",
	"www.frandieguez.dev",
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

export const onRequest = async (context: PagesContext): Promise<Response> => {
	const url = new URL(context.request.url);

	if (!ALIASES.has(url.hostname.toLowerCase())) {
		return context.next();
	}

	// Preserve the path, the query string and the fragment-free remainder
	// exactly; only the host changes. `:splat`-style truncation here would
	// silently drop query parameters from inbound campaign and referral links.
	url.hostname = CANONICAL_HOST;
	url.protocol = "https:";
	url.port = "";

	return Response.redirect(url.toString(), 301);
};
