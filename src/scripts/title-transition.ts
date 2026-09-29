/**
 * Morphs a post title from a listing into the title on the post page, using the
 * View Transition API through Astro's <ClientRouter />.
 *
 * The one design decision worth understanding before editing this:
 *
 * There is exactly ONE view-transition-name, `post-title`, and it is assigned at
 * navigation time rather than declared in the markup. The obvious approach —
 * `transition:name={`post-title-${post.id}`}` on every title — works, and costs
 * far more than it looks. /posts renders 91 titles, so the browser would capture
 * 91 separate transition groups on EVERY navigation away from that page,
 * including navigations to /about that have nothing to do with any of them. A
 * named element is not free just because nothing on the other side matches it.
 *
 * Assigning one name to one element means the browser snapshots two elements per
 * navigation, which is the actual work being asked for.
 *
 * It runs in both directions. `astro:before-preparation` knows both `from` and
 * `to`, so whichever side is a post URL identifies the pair: going to a post,
 * the listing entry is tagged before the snapshot; coming back, the post's <h1>
 * is. `astro:after-swap` then tags the matching element in the incoming DOM,
 * while still inside the update callback, which is where the "new" snapshot is
 * taken from.
 *
 * Reduced motion is handled by not participating at all — see PREFERS_MOTION.
 * Leaving the names in place and letting the global reduced-motion block
 * fast-forward the animation would still pay the capture cost, and the capture
 * is the part that can visibly flicker on a slow machine.
 */

const NAME = "post-title";
const ATTR = "data-post-title";

/** `/posts/<slug>/` -> `<slug>`, and null for every other URL shape. */
function postSlug(url: string): string | null {
	const { pathname } = new URL(url);
	const match = pathname.match(/^\/posts\/([^/]+)\/?$/);
	return match?.[1] ?? null;
}

function tag(slug: string): void {
	// The listing and the post page both carry the id, so one selector serves
	// both ends of the morph.
	const el = document.querySelector<HTMLElement>(`[${ATTR}="${CSS.escape(slug)}"]`);
	if (el) el.style.viewTransitionName = NAME;
}

function untagAll(): void {
	for (const el of document.querySelectorAll<HTMLElement>(`[${ATTR}]`)) {
		el.style.viewTransitionName = "";
	}
}

function init(): void {
	const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

	// The slug carried from before-preparation to after-swap: the old document is
	// gone by the time we need to tag the new one.
	let pending: string | null = null;

	document.addEventListener("astro:before-preparation", (event) => {
		pending = null;

		// Clear BEFORE deciding whether this navigation is relevant, not after.
		// A name is set on the outgoing page and survives into the next
		// navigation, so returning early without clearing leaves the browser
		// capturing a named element on a trip that has nothing to do with it —
		// listing to post to listing to /about would still snapshot the title.
		// That is the exact cost this approach exists to avoid, and it was a real
		// bug here until a probe caught a stale name on a navigation to /about.
		untagAll();

		if (!motion.matches) return;

		const { from, to } = event as unknown as { from: URL; to: URL };
		// Exactly one side of a listing <-> post navigation is a post URL. If both
		// are (post to post, via a series or a related link) the destination wins,
		// which is the title the reader is moving towards.
		const slug = postSlug(to.href) ?? postSlug(from.href);
		if (!slug) return;

		tag(slug);
		pending = slug;
	});

	document.addEventListener("astro:after-swap", () => {
		if (!pending) return;
		tag(pending);
		pending = null;
	});
}

init();
