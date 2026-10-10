import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/features/portfolio/case-study";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getNextProject, getProject, getProjectSlugs } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjectSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const project = getProject(slug, lang);
  if (!project) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    path: `/work/${slug}`,
    title: project.title,
    description: project.summary,
    siteName: dict.meta.siteName,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const project = getProject(slug, lang);
  if (!project) notFound();
  const dict = await getDictionary(lang);
  const index = getProjectSlugs().indexOf(slug) + 1;

  return <CaseStudy project={project} index={index} next={getNextProject(slug, lang)} locale={lang} dict={dict} />;
}
