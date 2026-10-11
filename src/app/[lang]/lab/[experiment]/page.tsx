import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { experiments, getExperiment } from "@/features/lab/registry";
import { experimentViews } from "@/features/lab/views";
import { LocaleLink } from "@/features/site/locale-link";
import { PageHeader } from "@/features/site/page-header";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((lang) => experiments.map((experiment) => ({ lang, experiment: experiment.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/lab/[experiment]">): Promise<Metadata> {
  const { lang, experiment: slug } = await params;
  const experiment = getExperiment(slug);
  if (!hasLocale(lang) || !experiment) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    path: `/lab/${slug}`,
    title: experiment.title(dict),
    description: experiment.description(dict),
    siteName: dict.meta.siteName,
  });
}

export default async function ExperimentPage({ params }: PageProps<"/[lang]/lab/[experiment]">) {
  const { lang, experiment: slug } = await params;
  const experiment = getExperiment(slug);
  const View = experimentViews[slug];
  if (!hasLocale(lang) || !experiment || !View) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader label={`${dict.labPage.title} / ${experiment.topic(dict)}`} title={experiment.title(dict)} lead={experiment.summary(dict)} />
      <Section spacing="tight">
        <Container className="flex flex-col gap-12">
          <View dict={dict} />
          <Button asChild variant="link" className="self-start">
            <LocaleLink locale={lang} href="/lab">
              <ArrowLeftIcon size={18} />
              {dict.labPage.backToLab}
            </LocaleLink>
          </Button>
        </Container>
      </Section>
    </>
  );
}
