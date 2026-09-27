/**
 * Single source of truth for career history.
 *
 * Before this file there were two competing copies — `WorkingExperience.tsx`
 * (homepage) and `Workline.astro` (/about) — and they disagreed about job
 * titles and dates. Everything career-related should read from here.
 */
import type { ImageMetadata } from "astro";

import gnome1 from "@/assets/projects/gnome/1.png";
import gnome2 from "@/assets/projects/gnome/2.png";
import opennemas1 from "@/assets/projects/opennemas/1.jpeg";
import opennemas2 from "@/assets/projects/opennemas/2.jpeg";
import oslusc1 from "@/assets/projects/oslusc/1.jpeg";
import oslusc2 from "@/assets/projects/oslusc/2.jpeg";
import oslusc3 from "@/assets/projects/oslusc/3.jpeg";
import situm1 from "@/assets/projects/situm/1.jpeg";
import situm2 from "@/assets/projects/situm/2.jpeg";
import situm3 from "@/assets/projects/situm/3.jpeg";
import situm4 from "@/assets/projects/situm/4.png";

export interface CareerMedia {
  src: ImageMetadata;
  alt: string;
}

export interface CareerRole {
  title: string;
  /** Year or YYYY-MM. Omit when the exact span isn't confirmed. */
  start?: string;
  /** Omit for an ongoing role. */
  end?: string;
}

export interface CareerEntry {
  /** Stable key, also the media folder name under src/assets/projects/. */
  id: string;
  org: string;
  orgUrl?: string;
  /** GNOME is not a job — it renders differently and never claims a salary. */
  kind: "employment" | "community";
  location?: string;
  /** Newest role first. Plural because several of these were progressions. */
  roles: CareerRole[];
  /** Shown on the homepage timeline. Keep it to two lines. */
  summaryShort: string;
  /** Shown on /about. */
  summaryLong: string;
  link?: { href: string; label: string };
  /** Short kicker above the title on /about. */
  eyebrow?: string;
  /** Only rendered on /about, never on the homepage. */
  media?: CareerMedia[];
  /** Ongoing entries group under "Now", finished ones under "Before". */
  ongoing: boolean;
}

export const career: CareerEntry[] = [
  {
    id: "situm",
    org: "Situm Technologies",
    orgUrl: "https://situm.com",
    kind: "employment",
    location: "Galicia, Spain",
    ongoing: true,
    roles: [
      { title: "Web Tech Lead", start: "2020" },
      { title: "Senior Software Developer", start: "2019", end: "2020" },
    ],
    summaryShort:
      "Indoor positioning for people and robots. I own the visual layer — the map viewer and its 3D layers — turning complex spatial data into web experiences fast enough to think with.",
    summaryLong:
      "I lead the web technology at Situm, an indoor positioning company serving people and robots across multiple industries. My work is the visual layer of Situm's products: designing and building the map viewer and its 3D layers, and turning complex spatial data into intuitive, high-performance web experiences that power advanced business intelligence.",
    link: { href: "https://situm.com", label: "Visit the site" },
    eyebrow: "Map viewer & 3D layers",
    media: [
      { src: situm1, alt: "Situm indoor map viewer showing a 3D building" },
      { src: situm2, alt: "Situm map viewer with indoor positioning overlays" },
      { src: situm3, alt: "Situm 3D layer rendering of a multi-floor venue" },
      { src: situm4, alt: "Situm business intelligence dashboard" },
    ],
  },
  {
    id: "gnome",
    org: "GNOME",
    orgUrl: "https://l10n.gnome.org/teams/gl",
    kind: "community",
    ongoing: true,
    roles: [{ title: "Contributor & maintainer", start: "2006" }],
    summaryShort:
      "Galician translations plus i18n tooling used by translators worldwide. Long-time GNOME Foundation member; I also coordinated the Galician translation team for Ubuntu.",
    summaryLong:
      "For close to twenty years I've contributed to the GNOME project — translating its modules into Galician, and building and maintaining the i18n tooling that streamlines the translation workflow for contributors worldwide. I'm a long-time member of the GNOME Foundation, and I coordinated the Galician translation team for Ubuntu.",
    link: { href: "https://l10n.gnome.org/teams/gl", label: "Galician team" },
    eyebrow: "Contributions and Galician translations",
    media: [
      { src: gnome1, alt: "The GNOME desktop translated into Galician" },
      { src: gnome2, alt: "GNOME translation tooling in use" },
    ],
  },
  {
    id: "openhost",
    org: "OpenHost",
    orgUrl: "http://www.opennemas.com/",
    kind: "employment",
    location: "Galicia, Spain",
    ongoing: false,
    // The entry spans 2009–2019. The internal split between the three roles is
    // deliberately undated: a role only renders a range when it has both a start
    // and an end, so these list in order without dates.
    roles: [
      { title: "Head of Research and Development", end: "2019" },
      { title: "CTO" },
      { title: "Full Stack Developer", start: "2009" },
    ],
    summaryShort:
      "A decade building Opennemas, a high-performance news publishing platform journalists used to reach millions of readers.",
    summaryLong:
      "I spent a decade building high-performance tools and large-scale systems for the media industry. I led the development of Opennemas, a news publishing platform that let journalists manage and deliver online content to millions of readers.",
    link: { href: "http://www.opennemas.com/", label: "Visit the site" },
    eyebrow: "High-performance news publishing",
    media: [
      { src: opennemas1, alt: "An Opennemas-powered online newspaper" },
      { src: opennemas2, alt: "The Opennemas content management interface" },
    ],
  },
  {
    id: "usc",
    org: "University of Santiago de Compostela",
    kind: "employment",
    location: "Galicia, Spain",
    ongoing: false,
    // Overlaps the OpenHost span on purpose — they ran in parallel.
    roles: [{ title: "Open Source Consultant", start: "2009", end: "2011" }],
    summaryShort:
      "A custom Linux-based desktop and large-scale open-source migrations in education. Won the Libre Software Award in Galicia in 2009.",
    summaryLong:
      "Early in my career I worked as an open-source software consultant at the University of Santiago de Compostela, building a custom Linux-based desktop to simplify administrative workflows and leading large-scale migrations to open source in educational environments. The work earned the Libre Software Award in Galicia.",
    link: {
      href: "http://www.mancomun.org/es/no_cache/actualidade/detalledenova/nova/a-osl-da-usc-gana-o-premio-eganet-2009-na-categoria-software-libre/",
      label: "About the award",
    },
    eyebrow: "Open source in education",
    media: [
      {
        src: oslusc1,
        alt: "The custom Linux desktop built for the university",
      },
      { src: oslusc2, alt: "Open source migration work at the university" },
      { src: oslusc3, alt: "The university's open source software lab" },
    ],
  },
];

/** Entries still in progress, for the "Now" group. */
export const careerNow = career.filter((entry) => entry.ongoing);

/** Finished entries, for the "Before" group. */
export const careerBefore = career.filter((entry) => !entry.ongoing);

/** The current job — feeds the hero so it can never drift from the timeline. */
export function currentPosition(): CareerEntry {
  const current = career.find(
    (entry) => entry.ongoing && entry.kind === "employment",
  );
  if (!current) throw new Error("career.ts: no ongoing employment entry");
  return current;
}

/** Formats an entry's span as "2019 — now" / "2009 — 2019", or "" if undated. */
export function formatSpan(entry: CareerEntry): string {
  const starts = entry.roles
    .map((role) => role.start)
    .filter((start): start is string => Boolean(start));
  if (starts.length === 0) return "";

  const start = starts.reduce((a, b) => (a < b ? a : b));
  if (entry.ongoing) return `${start} — now`;

  const ends = entry.roles
    .map((role) => role.end)
    .filter((end): end is string => Boolean(end));
  return ends.length > 0
    ? `${start} — ${ends.reduce((a, b) => (a > b ? a : b))}`
    : start;
}

/**
 * Formats a single role's span, e.g. "2019–2020" or "since 2020".
 * Returns "" unless the span is actually known — "since 2009" on a job that
 * ended in 2019 would be worse than no date at all.
 */
export function formatRoleSpan(role: CareerRole, ongoing = false): string {
  if (role.start && role.end) return `${role.start}–${role.end}`;
  if (role.start && ongoing && !role.end) return `since ${role.start}`;
  return "";
}
