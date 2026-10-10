import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/motion-provider";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/features/site/site-footer";
import { SiteHeader } from "@/features/site/site-header";
import { SkipLink } from "@/features/site/skip-link";
import { hasLocale, localeMeta, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata, robotsMetadata } from "@/lib/seo";
import { fontVariables } from "@/styles/fonts";

import "@/styles/globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: dict.meta.siteName,
    title: { default: dict.meta.siteName, template: dict.meta.titleTemplate },
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    robots: robotsMetadata(),
    ...pageMetadata({ locale: lang, path: "/", description: dict.meta.description, siteName: dict.meta.siteName }),
  };
}

export const viewport: Viewport = {
  themeColor: "#0c0d10",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={localeMeta[lang].htmlLang} className={fontVariables}>
      <body id="top" className="flex min-h-dvh flex-col bg-canvas text-ink">
        <SkipLink label={dict.a11y.skipToContent} />
        <MotionProvider>
          <SiteHeader locale={lang} dict={dict} />
          <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col pt-16 focus:outline-none lg:pt-18">
            {children}
          </main>
          <SiteFooter locale={lang} dict={dict} />
        </MotionProvider>
      </body>
    </html>
  );
}
