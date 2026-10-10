import type { Locale } from "@/i18n/config";
import type { Localized } from "@/types/content";

/** Picks the value for a locale. Content is validated by tests to be complete. */
export function localize<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function localizeAll<T>(values: Localized<T>[], locale: Locale): T[] {
  return values.map((value) => value[locale]);
}
