import type { Milestone } from "@/types/content";

/**
 * Verified milestones only (competitions, releases, certificates…), each with
 * a real date. The home page hides the milestones section while this is empty.
 * See CONTENT_TODO.md.
 */
export const milestones: Milestone[] = [
  {
    date: "2026-11",
    title: {
      en: "First Place — Medical Track",
      uz: "1-o‘rin — Tibbiyot yo‘nalishi",
    },
    detail: {
      en: "Nauka 0+ International Science Festival 2026 · Bloodchain",
      uz: "НАУКА 0+ xalqaro fan festivali 2026 · Bloodchain",
    },
    href: "/en/awards/nauka-0-bloodchain",
  },
];
