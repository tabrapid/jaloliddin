import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, localeCookie } from "@/i18n/config";

/**
 * Locale routing: every page lives under /en or /uz. Requests without a
 * locale prefix are redirected to the visitor's saved choice (cookie set by
 * the language switcher) or to English, the default.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (hasLocale(first)) return NextResponse.next();
  // The component explorer exists only in `next dev`; in production
  // /explorer falls through to the localized 404 like any unknown path.
  if (first === "explorer" && process.env.NODE_ENV === "development") return NextResponse.next();

  const saved = request.cookies.get(localeCookie)?.value;
  const locale = hasLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata/static files (anything with an extension)
  // and generated icons.
  matcher: ["/((?!_next|icon|apple-icon|.*\\..*).*)"],
};
