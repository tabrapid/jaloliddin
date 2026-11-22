import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Rosette } from "@/components/graphics/ornament";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { milestones } from "@/content/milestones";
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
  const achievements = milestones.flatMap((item) =>
    item.href && item.category ? [{ ...item, href: item.href, category: item.category[lang] }] : [],
  );
  const achievementGroups = new Map<string, typeof achievements>();
  for (const item of achievements) {
    const group = achievementGroups.get(item.category) ?? [];
    group.push(item);
    achievementGroups.set(item.category, group);
  }

  return (
    <>
      <PageHeader label={dict.writingPage.title} title={dict.writingPage.lead} />
      {achievements.length > 0 && (
        <Section spacing="tight" aria-labelledby="writing-achievements">
          <Container className="flex flex-col gap-8">
            <h2 id="writing-achievements" className="text-display-md font-semibold text-ink">
              {dict.writingPage.achievements}
            </h2>
            {[...achievementGroups].map(([category, items]) => (
              <div key={category} className="flex flex-col gap-4">
                <h3 className="text-heading font-semibold text-ink">{category}</h3>
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.href} className="rounded-lg border border-line p-6 lg:p-8">
                      <time dateTime={item.date} className="text-label text-ink-3">{item.date}</time>
                      <h4 className="text-heading mt-2 font-semibold text-ink">
                        <LocaleLink locale={lang} href={item.href} className="hover:underline">
                          {item.title[lang]}
                        </LocaleLink>
                      </h4>
                      {item.detail && <p className="mt-2 text-ink-2">{item.detail[lang]}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Container>
        </Section>
      )}
      {(articles.length > 0 || achievements.length === 0) && (
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
      )}
    </>
  );
}
