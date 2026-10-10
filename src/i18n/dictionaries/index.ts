import "server-only";

import type { Locale } from "../config";
import type { Dictionary } from "./en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en").then((module) => module.en),
  uz: () => import("./uz").then((module) => module.uz),
};

export type { Dictionary };

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
