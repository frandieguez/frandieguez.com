import { collectionDateSort } from "@/utils/date";
import { type CollectionEntry, getCollection } from "astro:content";

/**
 * All published posts, unsorted.
 *
 * Two gates, and they do different jobs.
 *
 * `draft` means "not finished". Hidden in every environment, including dev.
 *
 * `publishDate` in the future means "finished, but not yet". Before this, the
 * only way to hold a finished post back was to leave `draft: true` and remember
 * to clear it on the day — so a calendar of pre-dated posts was a list of manual
 * chores, and forgetting one meant it simply never appeared. Now a post can be
 * written, reviewed and merged with `draft: false` and a date in the future, and
 * it starts existing on its own.
 *
 * Future-dated posts DO show in `astro dev`, which is the point: you need to
 * read the thing you just scheduled.
 *
 * The date is compared at build time, so nothing changes on a site that is not
 * rebuilt. A scheduled deploy is what actually turns the page over — see
 * .github/workflows/scheduled-publish.yml.
 *
 * Dates without a time are midnight UTC, so a post dated 6 October becomes
 * eligible at 02:00 in Galicia during summer time, 01:00 in winter.
 */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
  const now = Date.now();
  return await getCollection("post", ({ data }) => {
    // In `astro dev` everything is visible, so a piece can be read in place —
    // in the listing, on the homepage, with its real neighbours around it —
    // instead of only as a file. `postStatus()` marks what is not live yet.
    if (import.meta.env.DEV) return true;
    return !data.draft && data.publishDate.getTime() <= now;
  });
}

/**
 * Why a post is not public yet, or null when it is.
 *
 * Only ever non-null under `astro dev`: a production build never returns an
 * unpublished post from getAllPosts() in the first place, so there is nothing
 * left to label. StatusMark checks `import.meta.env.DEV` again anyway — two
 * gates, because the cost of this leaking into a build is a "Draft" pill on a
 * live page and the cost of the extra check is nothing.
 */
export function postStatus(
  post: CollectionEntry<"post">
): "draft" | "scheduled" | null {
  if (post.data.draft) return "draft";
  if (post.data.publishDate.getTime() > Date.now()) return "scheduled";
  return null;
}

/** newest-first posts, optionally excluding some ids and capped at `limit`. */
export async function getLatestPosts(
  limit?: number,
  opts?: { exclude?: string[] }
): Promise<CollectionEntry<"post">[]> {
  const exclude = new Set(opts?.exclude ?? []);
  const posts = (await getAllPosts())
    .filter((post) => !exclude.has(post.id))
    .sort(collectionDateSort);
  return limit === undefined ? posts : posts.slice(0, limit);
}

/**
 * Posts related to `post`, best match first.
 *
 * Across 124 published posts there was exactly one in-body link from one post to
 * another, and it pointed at an article that was never written (404). So the
 * archive was a flat list: every post reachable only through pagination or a tag
 * page, never from a topically adjacent piece. Thirteen years of not hand-linking
 * says the habit is not coming, so this derives the links instead.
 *
 * Scoring: shared tags, weighted by how rare the tag is across the whole corpus.
 * A tag two posts share is a far stronger signal than one shared by forty, and
 * this archive has a long tail of near-unique tags that would otherwise dominate.
 * Ties break towards the more recent post.
 */
export async function getRelatedPosts(
  post: CollectionEntry<"post">,
  limit = 3
): Promise<CollectionEntry<"post">[]> {
  const all = await getAllPosts();
  const tags = new Set(post.data.tags);
  if (tags.size === 0) return [];

  const frequency = new Map<string, number>();
  for (const tag of getAllTags(all)) {
    frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
  }

  return all
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      let score = 0;
      for (const tag of candidate.data.tags) {
        // 1/frequency: a tag on two posts is worth far more than one on forty.
        if (tags.has(tag)) score += 1 / (frequency.get(tag) ?? 1);
      }
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || collectionDateSort(a.candidate, b.candidate)
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
  return posts.reduce<Record<string, CollectionEntry<"post">[]>>(
    (acc, post) => {
      const year = post.data.publishDate.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year]?.push(post);
      return acc;
    },
    {}
  );
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: CollectionEntry<"post">[]) {
  return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
  return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(
  posts: CollectionEntry<"post">[]
): [string, number][] {
  return [
    ...getAllTags(posts).reduce(
      (acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
      new Map<string, number>()
    ),
  ].sort((a, b) => b[1] - a[1]);
}
