import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { LocaleLink } from "@/features/site/locale-link";
import { getArticle, getArticles } from "@/features/writing/articles";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async (lang) => (await getArticles(lang)).map((article) => ({ lang, slug: article.slug }))),
  );
  return perLocale.flat();
}

export async function generateMetadata({ params }: PageProps<"/[lang]/writing/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const article = await getArticle(lang, slug);
  if (!article) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ locale: lang, path: `/writing/${slug}`, title: article.title, description: article.summary, siteName: dict.meta.siteName, type: "article" });
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/writing/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const article = await getArticle(lang, slug);
  if (!article) notFound();
  const dict = await getDictionary(lang);

  return (
    <article className="pb-section" aria-labelledby="article-title">
      <header className="atmosphere border-b border-line">
        <Container size="reading" className="flex flex-col gap-6 pt-16 pb-12 lg:pt-24">
          <p className="text-label flex flex-wrap gap-x-4 gap-y-1 text-ink-3">
            <span>
              {dict.writingPage.published} <time dateTime={article.date}>{formatDate(article.date, lang)}</time>
            </span>
            <span>{format(dict.writingPage.readingTime, { minutes: article.readingMinutes })}</span>
          </p>
          <h1 id="article-title" className="text-display-md font-semibold text-ink">
            {article.title}
          </h1>
          <p className="text-lead text-ink-2">{article.summary}</p>
        </Container>
      </header>
      <Container size="reading" className="flex flex-col gap-14 pt-12">
        <div className="prose-workshop" dangerouslySetInnerHTML={{ __html: article.html }} />
        <Button asChild variant="link" className="self-start">
          <LocaleLink locale={lang} href="/writing">
            <ArrowLeftIcon size={18} />
            {dict.writingPage.backToWriting}
          </LocaleLink>
        </Button>
      </Container>
    </article>
  );
}
