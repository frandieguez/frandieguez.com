/**
 * The controlled tag vocabulary.
 *
 * Before this list existed the archive had 302 distinct tags across 124 posts,
 * 249 of them used exactly once, with Spanish/English duplicates of the same
 * concept (`rendimiento`/`performance`, `seguridad`/`security`) and fossilised
 * typos (`subverstion`, `whatsap`, `oracle xed`).
 *
 * That is not a cosmetic problem. `getRelatedPosts()` in src/data/post.ts scores
 * shared tags by 1/frequency, so a tag used once outweighs everything else — the
 * long tail was generating almost every internal link on the site, and they were
 * bad links. The sitemap compounds it: astro.config.ts drops any tag page with
 * fewer than MIN_POSTS_PER_INDEXED_TAG (3) posts, so singleton tags are pure
 * noise that never reaches an index.
 *
 * Scope: this is the vocabulary for NEW posts, enforced by scripts/new-post.mjs.
 * The 2007-2014 archive keeps its own legacy tags (php, ruby, mysql, debian…),
 * which are fine — they are real topics with real post counts. What this list
 * prevents is inventing a 303rd tag every time something gets published.
 */
export const TAG_VOCABULARY = [
	// AI and agents
	"ai",
	"agents",
	"claude-code",
	"opencode",
	"developer-tools",
	"productivity",
	// Frontend
	"react",
	"redux",
	"javascript",
	"typescript",
	"astro",
	"css",
	"web-performance",
	// Web 3D
	"threejs",
	"maplibre",
	"webgl",
	"3d",
	// Backend
	"spring-boot",
	"java",
	"architecture",
	"testing",
	// Systems
	"linux",
	"devops",
	"security",
	"open-source",
	// Running a site, as opposed to building one
	"seo",
	"content",
	// People and career
	"gnome",
	"l10n",
	"career",
	"leadership",
];

/**
 * Mechanical archive renames: legacy tag -> replacement.
 *
 * Strictly the changes that need no judgement about what a post is about —
 * Spanish/English pairs for one concept, typos, and spacing variants of a term
 * that also exists in TAG_VOCABULARY. Targets here are NOT all vocabulary
 * terms, because the archive legitimately uses topics the new vocabulary does
 * not cover (git, php, ruby…); the point is one spelling per concept.
 *
 * Deciding that an old post tagged "clean code" should now be "architecture" is
 * a judgement call, so it is deliberately absent: those get retagged by hand.
 */
export const TAG_ALIASES = {
	// Spanish/English duplicates of one concept.
	//
	// `rendimiento` maps to the general `performance`, NOT to `web-performance`:
	// the posts carrying it are about MySQL tuning, Ruby benchmarks and SSD wear,
	// none of which are frontend topics. `web-performance` is reserved for the
	// new vocabulary, where it means Core Web Vitals and bundle size.
	rendimiento: "performance",
	seguridad: "security",
	servidor: "server",
	"programación": "programming",
	"bases de datos": "databases",
	pruebas: "testing",
	"control de versiones": "git",
	// Fossilised typos
	subverstion: "subversion",
	whatsap: "whatsapp",
	"oracle xed": "oracle-xe",
	"sofware development": "software development",
	// Spacing variants of a TAG_VOCABULARY term
	"web performance": "web-performance",
	"developer tools": "developer-tools",
	"spring boot": "spring-boot",
	"three.js": "threejs",
	"open source": "open-source",
};
