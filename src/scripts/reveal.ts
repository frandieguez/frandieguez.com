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

	// Anything already in the viewport is revealed by the observer's first,
	// synchronous callback — so there's no flash of hidden content.
	targets.forEach((el) => observer?.observe(el));
}

function teardown() {
	observer?.disconnect();
	observer = null;
	document.documentElement.classList.remove("js-reveal");
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", teardown);

export {};
