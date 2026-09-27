/**
 * Reveal-on-scroll, one observer for the whole page.
 *
 * Two things worth knowing before editing this:
 *
 * 1. It binds on `astro:page-load`, not `DOMContentLoaded`. With <ClientRouter />
 *    active, DOMContentLoaded does not fire again after a client-side navigation.
 *    (Header.astro had exactly this bug: its mobile menu died after the first
 *    in-site navigation.)
 * 2. The `js-reveal` class on <html> is added here, by the same code that removes
 *    it again via .is-revealed. If this script never runs, the hidden initial
 *    state in global.css never applies and everything is simply visible.
 */

const SELECTOR = "[data-reveal],[data-rail],.hand-rule";

let observer: IntersectionObserver | null = null;

function reveal(el: Element) {
	el.classList.add("is-revealed");
}

function init() {
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
	// So: whatever is already on screen at load is revealed directly, and the
	// observer only ever handles what starts below the fold.
	const onScreen: Element[] = [];
	for (const el of targets) {
		const rect = el.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) onScreen.push(el);
		else observer.observe(el);
	}

	// Force a style flush so the hidden state is committed before the class flips;
	// without it the browser collapses both into one recalc and the transition
	// snaps instead of running. Reading a layout property is the standard way.
	// (A requestAnimationFrame would also work, but it never fires in a
	// background tab, which would leave the first screen hidden until focus.)
	void document.documentElement.offsetHeight;

	for (const el of onScreen) reveal(el);
}

function teardown() {
	observer?.disconnect();
	observer = null;
	document.documentElement.classList.remove("js-reveal");
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", teardown);

export {};
