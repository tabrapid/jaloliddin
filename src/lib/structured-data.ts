import { siteConfig } from "@/config/site";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/paths";

import { getContactLinks } from "./contact";

/**
 * JSON-LD limited to verified facts: name, site URL, stated interests and
 * configured public profiles. No employer, school, awards or birth date.
 */
export function personJsonLd(locale: Locale, description: string) {
  const url = new URL(localizePath(locale), siteConfig.url).toString();
  const sameAs = getContactLinks()
    .filter((link) => link.external)
    .map((link) => link.href);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: profile.name,
        url,
        description,
        knowsAbout: profile.interests.map((interest) => interest.en),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: "Jaloliddin — Digital Workshop",
        inLanguage: ["en", "uz-Latn"],
        author: { "@id": `${siteConfig.url}/#person` },
      },
    ],
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
