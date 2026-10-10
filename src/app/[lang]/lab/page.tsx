import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HoverSurface } from "@/components/motion/hover-surface";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ArrayStrip } from "@/features/lab/binary-search/array-strip";
import { createSortedSample, traceBinarySearch } from "@/features/lab/binary-search/algorithm";
import { experiments } from "@/features/lab/registry";
import { LocaleLink } from "@/features/site/locale-link";
import { PageHeader } from "@/features/site/page-header";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/lab">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ locale: lang, path: "/lab", title: dict.labPage.title, description: dict.labPage.description, siteName: dict.meta.siteName });
}

export default async function LabPage({ params }: PageProps<"/[lang]/lab">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sample = createSortedSample(5, 12);
  const preview = traceBinarySearch(sample, sample[9]!);

  return (
    <>
      <PageHeader label={dict.labPage.title} title={dict.labPage.lead} lead={dict.labPage.body} />
      <Section spacing="tight">
        <Container>
          <ol className="grid gap-6 md:grid-cols-2">
            {experiments.map((experiment, index) => (
              <li key={experiment.slug}>
                <HoverSurface className="h-full rounded-lg">
                  <article className="relative flex h-full flex-col gap-6 rounded-lg border border-line bg-raised p-6 transition-colors group-hover/hover:border-line-strong sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-label text-ink-3">{String(index + 1).padStart(2, "0")} · {experiment.topic}</span>
                      <Badge tone="success" dot>
                        {dict.labPage.available}
                      </Badge>
                    </div>
                    <div className="rounded-md border border-line bg-canvas-deep p-4" aria-hidden="true">
                      <ArrayStrip
                        array={sample}
                        step={preview.steps[2] ?? preview.steps[0]!}
                        compact
                        labels={{ low: "low", mid: "mid", high: "high", index: "index" }}
                      />
                    </div>
                    <h2 className="text-heading font-semibold text-ink">
                      <LocaleLink
                        locale={lang}
                        href={`/lab/${experiment.slug}`}
                        className="rounded-xs after:absolute after:inset-0 after:rounded-lg after:content-['']"
                      >
                        {experiment.title(dict)}
                      </LocaleLink>
                    </h2>
                    <p className="text-ink-2">{experiment.summary(dict)}</p>
                    <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 font-medium text-ink">
                      {dict.labPage.open}
                      <ArrowRightIcon size={18} className="transition-transform duration-300 group-hover/hover:translate-x-1" />
                    </span>
                  </article>
                </HoverSurface>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
