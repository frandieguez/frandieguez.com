import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
  title: z.string().max(260),
});

const post = defineCollection({
  loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema.extend({
      description: z.string(),
      coverImage: z
        .object({
          alt: z.string(),
          src: image(),
        })
        .optional(),
      draft: z.boolean().default(false),
      /**
       * BCP 47 tag for the language this post is actually written in. About half
       * the archive is Spanish or Galician; before this field existed every page
       * declared the site default (en-GB) regardless of its contents, and there
       * was no way to say otherwise.
       */
      lang: z.enum(["en-GB", "es", "gl"]).default("en-GB"),
      /**
       * Social-card override. Must be a root-relative path or an absolute URL —
       * NOT a "./file.png" next to the post.
       *
       * Three published posts used the relative form. The file sits beside
       * index.md and Astro does emit it (hashed, under /_astro/) when the body
       * references it, but this field is a plain string that never resolves to
       * that URL — so og:image and BlogPosting.image each pointed at a different
       * 404. Nothing failed the build; the cards just silently broke.
       *
       * Leaving this unset is the better default anyway: it falls back to the
       * generated /og-image/<slug>.png card, which is 1200x630, branded, and at
       * a stable unhashed path.
       */
      ogImage: z
        .string()
        .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
          message:
            "ogImage must be root-relative ('/foo.png') or absolute ('https://…'). A './file.png' beside the post will not resolve and produces a 404 social card.",
        })
        .optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      // Series
      seriesId: z.string().optional(), // Links this post to a series
      orderInSeries: z.number().optional(), // Optional: ordering within the series
    }),
});

/**
 * Notes: short pieces that are not articles.
 *
 * This collection now also holds the 2007-2008 link posts imported from
 * WordPress — a bare Vimeo URL, one image, a joke — which were sitting in
 * `post` alongside real writing. They carry `lang` and `tags`, so the schema
 * has to as well; moving them into a title-and-date-only collection would have
 * thrown away the language pass that gave every Spanish page a correct
 * `<html lang>` and `og:locale`.
 *
 * Unlike posts, notes are deliberately kept out of the index. See
 * NOTES_ARE_NOINDEXED in astro.config.ts.
 */
const note = defineCollection({
  loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
  schema: baseSchema.extend({
    description: z.string().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(["en-GB", "es", "gl"]).default("en-GB"),
    tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    /**
     * ISO 8601, and stricter than the post schema on purpose: a bare
     * "25 Aug 2024" is rejected rather than guessed at.
     *
     * The `z.date()` branch is not a loophole. An unquoted `2008-12-20T00:03:36+00:00`
     * is a native YAML timestamp, so the parser hands Zod a Date and the string
     * branch never sees it — which is exactly how the 34 posts migrated from the
     * WordPress export arrive. A Date is already unambiguous; what the string
     * branch is guarding against is prose that only looks like a date.
     */
    publishDate: z
      .string()
      .datetime({ offset: true }) // e.g. "2024-01-01T00:00:00Z", "2024-01-01T00:00:00+02:00"
      .or(z.date())
      .transform((val) => new Date(val)),
  }),
});

// Series
const series = defineCollection({
  loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    featured: z.boolean().default(false), // Marks a series as a prominent one
  }),
});
// End

// Series
export const collections = { post, note, series };
