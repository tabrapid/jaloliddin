import { notFound } from "next/navigation";

import { Hero } from "@/features/home/hero";
import { AboutIntro, Capabilities, ContactBand, LabPreview, Milestones, SelectedWork } from "@/features/home/sections";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProjects } from "@/lib/projects";
import { jsonLdScript, personJsonLd } from "@/lib/structured-data";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const projects = getProjects(lang);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd(lang, dict.meta.description)) }} />
      <Hero locale={lang} dict={dict} />
      <SelectedWork locale={lang} dict={dict} projects={projects} />
      <AboutIntro locale={lang} dict={dict} />
      <Capabilities locale={lang} dict={dict} />
      <LabPreview locale={lang} dict={dict} />
      <Milestones locale={lang} dict={dict} />
      <ContactBand locale={lang} dict={dict} />
    </>
  );
}
