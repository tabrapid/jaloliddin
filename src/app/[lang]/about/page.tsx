import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StarMark } from "@/components/graphics/ornament";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import { LocaleLink } from "@/features/site/locale-link";
import { PageHeader } from "@/features/site/page-header";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ locale: lang, path: "/about", title: dict.aboutPage.title, description: dict.aboutPage.description, siteName: dict.meta.siteName });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader label={dict.aboutPage.title} title={profile.aboutLead[lang]} size="md" />

      <Section aria-label={dict.aboutPage.title}>
        <Container className="flex flex-col gap-20 lg:gap-28">
          {profile.aboutChapters.map((chapter, index) => (
            <Reveal
              key={chapter.id}
              as="article"
              className="grid grid-cols-4 gap-x-6 gap-y-5 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8"
            >
              <p className="text-label col-span-4 flex items-center gap-3 text-ink-3 md:col-span-8 lg:col-span-3 lg:pt-2">
                <span className="text-accent-ink">{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                {chapter.label[lang]}
              </p>
              <div
                className={cn(
                  "col-span-4 flex flex-col gap-5 md:col-span-7 lg:col-span-7",
                  index % 2 === 0 ? "lg:col-start-4" : "lg:col-start-6",
                )}
              >
                <h2 className="text-display-md font-semibold text-ink">{chapter.title[lang]}</h2>
                <p className="text-lead max-w-[40rem] text-ink-2">{chapter.body[lang]}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </Section>

      <Section tone="blueprint" divided aria-labelledby="interests-title">
        <Container className="grid grid-cols-4 gap-x-6 gap-y-10 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
          <h2 id="interests-title" className="text-label col-span-4 text-ink-3 md:col-span-8 lg:col-span-3 lg:pt-4">
            {dict.aboutPage.interestsTitle}
          </h2>
          <ol className="col-span-4 border-t border-line-strong md:col-span-8 lg:col-span-9">
            <Stagger itemAs="li" itemClassName="border-b border-line">
              {profile.interests.map((interest, index) => (
                <div key={interest.en} className="flex items-baseline gap-6 py-5">
                  <span className="text-label w-8 shrink-0 text-ink-3">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-heading font-medium text-ink">{interest[lang]}</span>
                </div>
              ))}
            </Stagger>
          </ol>
        </Container>
      </Section>

      <Section divided aria-labelledby="principles-title">
        <Container className="flex flex-col gap-12">
          <h2 id="principles-title" className="text-display-md font-semibold text-ink">
            {dict.aboutPage.principlesTitle}
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
            {profile.principles.map((principle) => (
              <li key={principle.title.en} className="flex flex-col gap-4 bg-canvas p-6 sm:p-8">
                <StarMark size={16} className="text-accent-ink" />
                <h3 className="text-[1.25rem] font-semibold text-ink">{principle.title[lang]}</h3>
                <p className="text-ink-2">{principle.body[lang]}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 xs:flex-row">
            <Button asChild size="lg">
              <LocaleLink locale={lang} href="/work">
                {dict.aboutPage.workCta}
                <ArrowRightIcon size={18} />
              </LocaleLink>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <LocaleLink locale={lang} href="/contact">
                {dict.aboutPage.contactCta}
              </LocaleLink>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
