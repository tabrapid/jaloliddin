import { profile } from "@/content/profile";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OG_SIZE, renderOgCard } from "@/lib/og/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Jaloliddin — Digital Workshop";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);
  return renderOgCard({
    eyebrow: dict.hero.eyebrow,
    title: profile.name,
    subtitle: profile.heroStatement[locale],
    footer: dict.meta.siteName,
  });
}
