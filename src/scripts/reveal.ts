/**
 * Reveal-on-scroll, one observer for the whole page.
 *
 * Three things worth knowing before editing this:
 *
 * 1. The `js-reveal` class on <html> is added here, by the same code that removes
 *    it again via .is-revealed. If this script never runs, the hidden initial
 *    state in global.css never applies and everything is simply visible — which
 *    is what every crawler and every reduced-motion visitor gets.
 * 2. It binds on Astro's lifecycle events, not `DOMContentLoaded`. With
 *    <ClientRouter /> active, DOMContentLoaded does not fire again after a
 *    client-side navigation. (Header.astro had exactly this bug: its mobile menu
 *    died after the first in-site navigation.)
 * 3. Whether the first screen *animates* is decided by one line: the forced
 *    style flush. See `flushBeforeReveal` below — that is the entire mechanism,
 *    and it is why navigations and cold loads are handled differently.
 */

const SELECTOR = "[data-reveal],[data-rail],.hand-rule";

let observer: IntersectionObserver | null = null;

function reveal(el: Element) {
	el.classList.add("is-revealed");
}

/**
 * @param flushBeforeReveal
 *   `true` on a cold load: commit the hidden state, then flip the class, so the
 *   browser runs a real transition and the first screen animates in.
 *
 *   `false` on a client-side navigation: let both changes coalesce into a single
 *   style recalculation, so on-screen content resolves straight to its final
 *   state and never paints at opacity 0.
 *
 *   That difference is the fix for a measured bug. Binding only to
 *   `astro:page-load` meant that navigating back to an already-visited page
 *   showed the previous page, then ~190ms of fully blank hero, then a 470ms
 *   fade-in — because the swapped-in DOM was hidden and nothing revealed it
 *   until after the browser had already painted a frame.
 */
function init(flushBeforeReveal: boolean) {
	// Re-entrant: both `astro:after-swap` and `astro:page-load` call this on a
	// navigation, so never leak the previous observer.
	observer?.disconnect();
	observer = null;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	const targets = document.querySelectorAll(SELECTOR);
	if (targets.length === 0) return;

	if (prefersReducedMotion || !("IntersectionObserver" in window)) {
		// Don't add js-reveal at all: nothing is ever hidden.
		targets.forEach(reveal);
		return;
	}

	document.documentElement.classList.add("js-reveal");

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				reveal(entry.target);
				observer?.unobserve(entry.target);
			}
		},
		{ threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
	);

	// The observer's negative rootMargin delays a reveal until the element is a
	// little way into the viewport. That's right for content you scroll down to,
	// and wrong for the first screen: it leaves a dead band along the bottom, so
	// anything sitting there — the hero's tech stack line, for one — stayed
	// hidden until the visitor scrolled and came back.
	//
	// So: whatever is already on screen is revealed directly, and the observer
	// only ever handles what starts below the fold.
	const onScreen: Element[] = [];
	for (const el of targets) {
		if (el.classList.contains("is-revealed")) continue;
		const rect = el.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) onScreen.push(el);
		else observer.observe(el);
	}

	if (flushBeforeReveal) {
		// Reading a layout property is the standard way to force a style flush.
		// (A requestAnimationFrame would also work, but it never fires in a
		// background tab, which would leave the first screen hidden until focus.)
		void document.documentElement.offsetHeight;
	}

	for (const el of onScreen) reveal(el);
}

function teardown() {
	observer?.disconnect();
	observer = null;
	document.documentElement.classList.remove("js-reveal");
}

// Fires on a cold load and again after every client-side navigation. Only the
// cold load should animate, and by the time this runs after a navigation
// `astro:after-swap` has already revealed the first screen, so the animated path
// finds nothing left to animate.
document.addEventListener("astro:page-load", () => init(true));

// Fires after the new document is in place but before the browser paints it.
// This is the hook that keeps a navigation from flashing blank.
document.addEventListener("astro:after-swap", () => init(false));

document.addEventListener("astro:before-swap", teardown);

export {};
