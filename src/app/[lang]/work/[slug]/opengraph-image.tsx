import { defaultLocale, hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { OG_SIZE, renderOgCard } from "@/lib/og/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Project case study — Jaloliddin";

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjectSlugs().map((slug) => ({ lang, slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);
  const project = getProject(slug, locale);
  return renderOgCard({
    eyebrow: project ? `${dict.nav.work} · ${dict.project.statusLabels[project.status]}` : dict.nav.work,
    title: project?.title ?? "Jaloliddin",
    subtitle: project?.tagline ?? dict.meta.description,
    footer: dict.meta.siteName,
  });
}
