import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { localeAlternates, localizePath } from "@/i18n/paths";

export interface PageMetadataInput {
  locale: Locale;
  /** Locale-independent path of the page, e.g. "/work/bloodchain". */
  path: string;
  title?: string;
  description: string;
  siteName: string;
  type?: "website" | "article";
}

/** Page-level metadata with canonical URL, hreflang alternates and Open Graph. */
export function pageMetadata({ locale, path, title, description, siteName, type = "website" }: PageMetadataInput): Metadata {
  const url = localizePath(locale, path);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      languages: localeAlternates(path),
    },
    openGraph: {
      type,
      url,
      siteName,
      title: title ?? siteName,
      description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => localeMeta[other].ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? siteName,
      description,
    },
  };
}

/** Robots policy: indexable only when explicitly enabled (see siteConfig). */
export function robotsMetadata(): Metadata["robots"] {
  return siteConfig.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } };
}
