import { lang } from "next/root-params";

import { NotFoundView } from "@/features/site/not-found-view";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizePath } from "@/i18n/paths";

/** Localised 404 inside the site layout (unknown slugs, unknown paths). */
export default async function NotFound() {
  const value = await lang();
  const locale = hasLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);
  return <NotFoundView dict={dict} homeHref={localizePath(locale)} workHref={localizePath(locale, "/work")} />;
}
