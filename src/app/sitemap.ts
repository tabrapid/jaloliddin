import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { experiments } from "@/features/lab/registry";
import { getArticles } from "@/features/writing/articles";
import { locales, type Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/paths";
import { getProjectSlugs } from "@/lib/projects";

/** One URL per available locale, each listing its translations as alternates. */
function entry(path: string, priority: number, available: readonly Locale[] = locales): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(available.map((locale) => [locale, absoluteUrl(localizePath(locale, path))]));
  return available.map((locale) => ({
    url: absoluteUrl(localizePath(locale, path)),
    changeFrequency: "monthly",
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Articles may exist in only one language; list each only where it exists.
  const articleLocales = new Map<string, Locale[]>();
  for (const locale of locales) {
    for (const article of await getArticles(locale)) {
      articleLocales.set(article.slug, [...(articleLocales.get(article.slug) ?? []), locale]);
    }
  }
  return [
    ...entry("/", 1),
    ...entry("/work", 0.9),
    ...getProjectSlugs().flatMap((slug) => entry(`/work/${slug}`, 0.8)),
    ...entry("/about", 0.7),
    ...entry("/lab", 0.6),
    ...experiments.flatMap((experiment) => entry(`/lab/${experiment.slug}`, 0.6)),
    ...entry("/writing", 0.5),
    ...[...articleLocales].flatMap(([slug, available]) => entry(`/writing/${slug}`, 0.5, available)),
    ...entry("/contact", 0.5),
  ];
}
