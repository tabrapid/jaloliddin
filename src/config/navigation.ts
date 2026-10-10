import type { Dictionary } from "@/i18n/dictionaries/en";

export type NavKey = keyof Pick<Dictionary["nav"], "work" | "about" | "lab" | "writing" | "contact">;

export interface NavItem {
  key: NavKey;
  /** Locale-independent path; localised with localizePath(). */
  path: string;
}

export const primaryNav: NavItem[] = [
  { key: "work", path: "/work" },
  { key: "about", path: "/about" },
  { key: "lab", path: "/lab" },
  { key: "writing", path: "/writing" },
  { key: "contact", path: "/contact" },
];
