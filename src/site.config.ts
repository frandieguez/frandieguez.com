import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "Fran Dieguez",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "en-US",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  // Used as the default description meta property and webmanifest description
  description:
    "Fran Dieguez — full stack developer and Web Tech Lead at Situm, building the visual layer of indoor positioning. Writing about code agents, web performance and open source since 2007.",
  // HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
  lang: "en-GB",
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: "en_GB",
  // Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
  title: "Fran Dieguez",
};

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
  {
    path: "/about/",
    title: "Work",
  },
  {
    path: "/posts/",
    title: "Blog",
  },
  {
    // Trailing slash matters: the site canonicalises to it, so "/contact"
    // costs every visitor an extra 308 on a link in the main navigation.
    path: "/contact/",
    title: "Contact",
  },
];
