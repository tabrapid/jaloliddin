"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeCookie, localeMeta, locales, type Locale } from "@/i18n/config";
import { format } from "@/i18n/format";
import { switchLocalePath } from "@/i18n/paths";
import { cn } from "@/lib/cn";

export interface LanguageSwitcherProps {
  current: Locale;
  labels: { language: string; switchTo: string };
  size?: "sm" | "lg";
  className?: string;
}

function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * Segmented EN / UZ switch. Each option links to the same page in the other
 * language (works without JavaScript) and remembers the choice in a cookie.
 */
export function LanguageSwitcher({ current, labels, size = "sm", className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  return (
    <div
      role="group"
      aria-label={labels.language}
      className={cn("inline-flex items-center rounded-pill border border-line-strong p-1", className)}
    >
      {locales.map((locale) => {
        const meta = localeMeta[locale];
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={meta.htmlLang}
            lang={meta.htmlLang}
            aria-current={active ? "true" : undefined}
            aria-label={active ? meta.label : format(labels.switchTo, { language: meta.label })}
            onClick={() => rememberLocale(locale)}
            scroll={false}
            className={cn(
              "text-label inline-flex items-center justify-center rounded-pill transition-colors duration-200",
              size === "lg" ? "min-h-12 min-w-16 px-4" : "min-h-9 min-w-11 px-3",
              active ? "bg-ink text-canvas" : "text-ink-3 hover:text-ink",
            )}
          >
            {size === "lg" ? meta.label : meta.short}
          </Link>
        );
      })}
    </div>
  );
}
