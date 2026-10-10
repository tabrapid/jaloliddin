import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

/** Blocks all crawling unless indexing is explicitly enabled (see siteConfig). */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
