/**
 * /llms.txt — llmstxt.org's proposed index format.
 *
 * Honest caveat, so nobody over-invests in this: Google Search does not read
 * this file, and no major AI search crawler (OAI-SearchBot, ClaudeBot,
 * PerplexityBot) has committed to reading it either. Its real consumers today
 * are developer tooling and some agent frameworks that fetch it opportunistically.
 * It is cheap hygiene and a forward bet, not a citability lever — do not expect
 * it to move AI Overview or ChatGPT inclusion.
 *
 * Generated rather than kept as a static file in public/, so the recent-writing
 * list cannot drift away from what is actually published.
 */
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { collectionDateSort } from "@/utils/date";
import type { APIRoute } from "astro";

const ORIGIN = "https://www.frandieguez.com";
const RECENT_COUNT = 10;

export const GET: APIRoute = async () => {
	const posts = (await getAllPosts()).sort(collectionDateSort);
	const recent = posts.slice(0, RECENT_COUNT);

	const body = `# ${siteConfig.title}

> Full stack developer and Web Tech Lead at Situm, where the work is indoor
> positioning for people and robots — map viewers, 3D layers, and the code that
> turns spatial data into something fast enough to think with. Long-time GNOME
> Foundation member and coordinator of the Galician translation team. Based in
> Galicia, Spain, building for the web since 2006.

This blog is bilingual: roughly half the archive is in English, half in Spanish,
with a couple of posts in Galician. Each post declares its own language in the
\`lang\` attribute of its HTML document.

## About

- [About and work history](${ORIGIN}/about/): Situm Technologies (Web Tech Lead, 2019–now), OpenHost / Opennemas (Full Stack Developer through CTO to Head of R&D, 2009–2019), University of Santiago de Compostela (open-source consultant, 2009–2011), GNOME (contributor and Galician team coordinator, 2006–now).
- [Contact](${ORIGIN}/contact/)

## Recent writing

${recent
	.map(
		(post) =>
			`- [${post.data.title}](${ORIGIN}/posts/${post.id}/): ${post.data.description}`,
	)
	.join("\n")}

## Full index

- [All ${posts.length} posts](${ORIGIN}/posts/)
- [Topics](${ORIGIN}/tags/)
- [RSS feed](${ORIGIN}/rss.xml)
- [Sitemap](${ORIGIN}/sitemap-index.xml)

## Elsewhere

- [GitHub](https://github.com/frandieguez)
- [LinkedIn](https://www.linkedin.com/in/frandieguez/)
- [GNOME Galician translation team](https://l10n.gnome.org/teams/gl)
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
