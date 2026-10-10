import { defaultLocale, hasLocale, locales, type Locale } from "./config";

/** Normalises an app path ("/work", "work", "/") to a leading-slash form. */
function normalise(path: string): string {
  if (!path || path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}

/** Builds a locale-prefixed href: localizePath("uz", "/work") → "/uz/work". */
export function localizePath(locale: Locale, path = "/"): string {
  const [pathname = "/", hash] = normalise(path).split("#");
  const base = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return hash ? `${base}#${hash}` : base;
}

/** Splits "/uz/work/bloodchain" into { locale: "uz", path: "/work/bloodchain" }. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const clean = normalise(pathname);
  const [, first, ...rest] = clean.split("/");
  if (hasLocale(first)) {
    return { locale: first, path: rest.length ? `/${rest.join("/")}` : "/" };
  }
  return { locale: null, path: clean };
}

/** Returns the same page in another language, preserving the rest of the path. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(target, splitLocale(pathname).path);
}

/** Absolute alternates for metadata: { en: "/en/work", uz: "/uz/work" }. */
export function localeAlternates(path: string): Record<string, string> {
  const entries = locales.map((locale) => [locale, localizePath(locale, path)] as const);
  return { ...Object.fromEntries(entries), "x-default": localizePath(defaultLocale, path) };
}
