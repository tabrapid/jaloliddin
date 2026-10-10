import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactList } from "@/features/site/contact-list";
import { PageHeader } from "@/features/site/page-header";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContactLinks } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ locale: lang, path: "/contact", title: dict.contactPage.title, description: dict.contactPage.description, siteName: dict.meta.siteName });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const links = getContactLinks();

  return (
    <>
      <PageHeader label={dict.contactPage.title} title={dict.contactPage.lead} size="md" lead={links.length > 0 ? dict.contactPage.body : undefined} />
      <Section spacing="tight">
        <Container className="grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
          <h2 className="text-label col-span-4 text-ink-3 md:col-span-8 lg:col-span-3 lg:pt-6">{dict.contactPage.channels}</h2>
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            {links.length > 0 ? (
              <ContactList links={links} dict={dict} />
            ) : (
              <div className="flex flex-col gap-3 border-t border-line pt-6" data-testid="contact-empty">
                <p className="text-heading font-semibold text-ink">{dict.contactPage.emptyTitle}</p>
                <p className="text-ink-2">{dict.contactPage.emptyBody}</p>
                {process.env.NODE_ENV === "development" ? (
                  <p className="mt-4 rounded-md border border-dashed border-line-strong p-4 font-mono text-[0.8125rem] text-ink-3">
                    Development note (hidden in production): no contact channels are configured. Add them in
                    src/config/contact.ts.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
