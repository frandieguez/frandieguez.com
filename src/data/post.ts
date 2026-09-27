import { collectionDateSort } from "@/utils/date";
import { type CollectionEntry, getCollection } from "astro:content";

/** all non-draft posts, unsorted. Drafts are hidden in every environment: the
 *  content collection still holds the Astro Citrus fixture posts, and they are
 *  all drafts, so showing drafts in dev would flood the local site with them. */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
  return await getCollection("post", ({ data }) => !data.draft);
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
