import { localeMeta, type Locale } from "@/i18n/config";

/** Formats an ISO date (YYYY-MM-DD) deterministically in UTC for the locale. */
export function formatDate(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat(localeMeta[locale].htmlLang, { dateStyle: "long", timeZone: "UTC" }).format(date);
}
