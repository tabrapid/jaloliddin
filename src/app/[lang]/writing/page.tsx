import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Rosette } from "@/components/graphics/ornament";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { LocaleLink } from "@/features/site/locale-link";
import { PageHeader } from "@/features/site/page-header";
import { ArticlePreview } from "@/features/writing/article-preview";
import { getArticles } from "@/features/writing/articles";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import { localizePath } from "@/i18n/paths";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/writing">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ locale: lang, path: "/writing", title: dict.writingPage.title, description: dict.writingPage.description, siteName: dict.meta.siteName });
}

export default async function WritingPage({ params }: PageProps<"/[lang]/writing">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const articles = await getArticles(lang);

  return (
    <>
      <PageHeader label={dict.writingPage.title} title={dict.writingPage.lead} />
      <Section spacing="tight">
        <Container>
          {articles.length > 0 ? (
            <ol className="flex flex-col gap-4">
              <Stagger itemAs="li">
                {articles.map((article) => (
                  <ArticlePreview
                    key={article.slug}
                    href={localizePath(lang, `/writing/${article.slug}`)}
                    title={article.title}
                    summary={article.summary}
                    date={article.date}
                    dateLabel={formatDate(article.date, lang)}
                    readingTime={format(dict.writingPage.readingTime, { minutes: article.readingMinutes })}
                    tags={article.tags}
                  />
                ))}
              </Stagger>
            </ol>
          ) : (
            <div
              className="relative isolate grid overflow-hidden rounded-lg border border-dashed border-line-strong px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-12"
              data-testid="writing-empty"
            >
              <Rosette className="pointer-events-none absolute top-1/2 right-[-12rem] -z-10 w-[36rem] -translate-y-1/2 text-silver-dim opacity-[0.12]" />
              <div className="flex flex-col gap-5 lg:col-span-7">
                <p className="text-label text-ink-3">00</p>
                <h2 className="text-display-md font-semibold text-ink">{dict.writingPage.emptyTitle}</h2>
                <p className="text-lead text-ink-2">{dict.writingPage.emptyBody}</p>
                <Button asChild variant="secondary" size="lg" className="mt-2 self-start">
                  <LocaleLink locale={lang} href="/lab">
                    {dict.writingPage.emptyCta}
                    <ArrowRightIcon size={18} />
                  </LocaleLink>
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
