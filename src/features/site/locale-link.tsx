import Link from "next/link";
import type { ComponentProps } from "react";

import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/paths";

export interface LocaleLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  locale: Locale;
  /** Locale-independent path, e.g. "/work/bloodchain" or "/#work". */
  href: string;
}

/** Next.js Link that prefixes the current locale. */
export function LocaleLink({ locale, href, ...props }: LocaleLinkProps) {
  return <Link href={localizePath(locale, href)} {...props} />;
}
