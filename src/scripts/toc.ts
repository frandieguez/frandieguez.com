/**
 * Table of contents: reading progress + current section.
 *
 * Two jobs, both driven from a single rAF-throttled scroll handler:
 *
 * 1. Scale the terracotta rail fill to how far the reader is through the
 *    article — real progress, not "which heading is highlighted".
 * 2. Mark the current heading with aria-current, which is what `.toc-link` in
 *    global.css styles against.
 *
 * The "current" heading is the last one that has crossed a reading line a
 * quarter of the way down the viewport. That beats an IntersectionObserver here
 * because short sections can leave no heading intersecting at all, and the
 * highlight would flicker off.
 *
 * Binds on astro:page-load, not DOMContentLoaded — with <ClientRouter /> the
 * latter never fires again after a client-side navigation.
 */

let teardown: (() => void) | null = null;

function init() {
	const links = Array.from(
		document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")
	);
	if (links.length === 0) return;

	const article = document.querySelector("article");
	const fills = Array.from(
		document.querySelectorAll<HTMLElement>("[data-toc-progress]")
	);

	// Unique heading ids, in document order. Both TOC variants render the same
	// slugs, so dedupe before resolving them.
	const slugs = [
		...new Set(
			links.map((link) => decodeURIComponent(link.hash.slice(1))).filter(Boolean)
		),
	];
	const headings = slugs
		.map((slug) => document.getElementById(slug))
		.filter((el): el is HTMLElement => el !== null);

	if (headings.length === 0) return;

	let queued = false;

	const update = () => {
		queued = false;

		if (article && fills.length > 0) {
			const rect = article.getBoundingClientRect();
			const scrollable = rect.height - window.innerHeight;
			const progress =
				scrollable > 0
					? Math.min(1, Math.max(0, -rect.top / scrollable))
					: rect.top <= 0
						? 1
						: 0;
			for (const fill of fills) fill.style.transform = `scaleY(${progress})`;
		}

		const line = window.innerHeight * 0.25;
		let active = headings[0];
		for (const heading of headings) {
			if (heading.getBoundingClientRect().top > line) break;
			active = heading;
		}

		for (const link of links) {
			const isActive = decodeURIComponent(link.hash.slice(1)) === active?.id;
			if (isActive) link.setAttribute("aria-current", "true");
			else link.removeAttribute("aria-current");
		}
	};

	const onScroll = () => {
		if (queued) return;
		queued = true;
		requestAnimationFrame(update);
	};

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });
	update();

	teardown = () => {
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onScroll);
		teardown = null;
	};
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", () => teardown?.());

export {};
