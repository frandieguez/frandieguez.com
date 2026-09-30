/**
 * The two shared-element morphs, and the one guard they both need.
 *
 * 1. POST TITLE — a title in a listing becomes the <h1> on the post page.
 * 2. BRAND — the glasses stay still while the wordmark unfurls beside them.
 *
 * The two are named in opposite ways, and the asymmetry is deliberate.
 *
 * The title is named HERE, at navigation time, because the obvious alternative —
 * `transition:name={`post-title-${post.id}`}` on every title — costs far more
 * than it looks. /posts renders 91 titles, so the browser would capture 91
 * transition groups on EVERY navigation away from that page, including
 * navigations to /about that have nothing to do with any of them. A named
 * element is not free just because nothing on the other side matches it.
 *
 * The brand is named in global.css instead, because there is exactly one lockup
 * per page and that reasoning simply does not apply. Keeping it in CSS also keeps
 * it inside the `prefers-reduced-motion: no-preference` block for free.
 *
 * Both run in both directions. `astro:before-preparation` knows `from` and `to`,
 * so whichever side is a post URL identifies the title pair; `astro:after-swap`
 * tags the matching element in the incoming DOM, while still inside the update
 * callback, which is where the "new" snapshot is taken from.
 *
 * ---
 *
 * THE VIEWPORT GUARD, which is why these two live in one file.
 *
 * A view transition animates a named element from where it WAS to where it is,
 * and "where it was" is recorded before the scroll position resets. Leave a long
 * post from its foot and the outgoing <h1> is thousands of pixels above the
 * viewport, so the group animates that entire flight in 420ms. Above the `md`
 * breakpoint the header is `relative`, so the brand has the same problem.
 *
 * This shipped with the title morph and was found while planning the brand one.
 * The fix belongs to both: if an element is not on screen, do not name it. Below
 * `md` the header is `fixed` and never triggers it.
 */

const TITLE_NAME = "post-title";
const TITLE_ATTR = "data-post-title";
const BRAND_ATTRS = ["data-brand-mark", "data-brand-word"];

/** `/posts/<slug>/` -> `<slug>`, and null for every other URL shape. */
function postSlug(url: string): string | null {
	const { pathname } = new URL(url);
	const match = pathname.match(/^\/posts\/([^/]+)\/?$/);
	return match?.[1] ?? null;
}

/**
 * Is any part of the element within the viewport? Horizontal is ignored on
 * purpose: nothing here moves sideways off screen, and a title clipped by a
 * narrow column would otherwise be skipped for no reason.
 */
function onScreen(el: Element): boolean {
	const { top, bottom } = el.getBoundingClientRect();
	return bottom > 0 && top < window.innerHeight;
}

function titleEl(slug: string): HTMLElement | null {
	// The listing and the post page both carry the id, so one selector serves
	// both ends of the morph.
	return document.querySelector<HTMLElement>(`[${TITLE_ATTR}="${CSS.escape(slug)}"]`);
}

function untagTitles(): void {
	for (const el of document.querySelectorAll<HTMLElement>(`[${TITLE_ATTR}]`)) {
		el.style.viewTransitionName = "";
	}
}

/**
 * The brand's names come from CSS, so JS can only ever SUBTRACT them. `none` is
 * what turns a named element back into part of the root snapshot.
 */
function setBrandSuppressed(suppressed: boolean): void {
	for (const attr of BRAND_ATTRS) {
		for (const el of document.querySelectorAll<HTMLElement>(`#main-header [${attr}]`)) {
			el.style.viewTransitionName = suppressed ? "none" : "";
		}
	}
}

function brandOffScreen(): boolean {
	const mark = document.querySelector("#main-header [data-brand-mark]");
	return mark !== null && !onScreen(mark);
}

function init(): void {
	const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

	// Carried from before-preparation to after-swap: the old document is gone by
	// the time the new one needs tagging.
	let pendingSlug: string | null = null;
	let suppressBrand = false;

	document.addEventListener("astro:before-preparation", (event) => {
		pendingSlug = null;

		// Clear BEFORE deciding whether this navigation is relevant, not after. A
		// name is set on the outgoing page and survives into the next navigation,
		// so returning early without clearing leaves the browser capturing a named
		// element on a trip that has nothing to do with it — listing to post to
		// listing to /about would still snapshot the title. That is the exact cost
		// this approach exists to avoid, and it was a real bug here until a probe
		// caught a stale name on a navigation to /about.
		untagTitles();

		// Suppress the brand on BOTH sides or neither. Killing only the outgoing
		// half would leave the incoming wordmark with no partner, so it would play
		// the `:only-child` write-in animation on a navigation where the name was
		// already on screen and simply moved.
		suppressBrand = !motion.matches || brandOffScreen();
		setBrandSuppressed(suppressBrand);

		if (!motion.matches) return;

		const { from, to } = event as unknown as { from: URL; to: URL };
		// Exactly one side of a listing <-> post navigation is a post URL. If both
		// are (post to post, via a series or a related link) the destination wins,
		// which is the title the reader is moving towards.
		const slug = postSlug(to.href) ?? postSlug(from.href);
		if (!slug) return;

		const el = titleEl(slug);
		if (!el || !onScreen(el)) return;

		el.style.viewTransitionName = TITLE_NAME;
		pendingSlug = slug;
	});

	document.addEventListener("astro:after-swap", () => {
		if (suppressBrand) setBrandSuppressed(true);
		suppressBrand = false;

		if (!pendingSlug) return;
		const el = titleEl(pendingSlug);
		if (el) el.style.viewTransitionName = TITLE_NAME;
		pendingSlug = null;
	});
}

init();
