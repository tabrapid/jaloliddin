export const locales = ["en", "uz"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie remembering an explicit language choice (read by src/proxy.ts). */
export const localeCookie = "preferred-locale";

export interface LocaleMeta {
  /** Native name shown in the language switcher. */
  label: string;
  /** Short code shown in compact UI. */
  short: string;
  /** BCP 47 tag for <html lang> and hreflang. */
  htmlLang: string;
  /** Open Graph locale. */
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US" },
  uz: { label: "Oʻzbekcha", short: "UZ", htmlLang: "uz-Latn", ogLocale: "uz_UZ" },
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
