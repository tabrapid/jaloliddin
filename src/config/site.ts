/**
 * Site-wide configuration. Values come from environment variables at build
 * time so that previews, staging and production can differ without code edits.
 */

function parseOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

const origin = parseOrigin(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000";

export const siteConfig = {
  /** Public name used in metadata and structured data. */
  name: "Jaloliddin",
  /** Canonical origin, e.g. https://jaloliddin.dev (set NEXT_PUBLIC_SITE_URL). */
  url: origin,
  /**
   * Search indexing is opt-in. It is only enabled when SITE_INDEXING="true"
   * and the build is not a Vercel preview, so unfinished previews stay hidden.
   */
  indexable: process.env.SITE_INDEXING === "true" && process.env.VERCEL_ENV !== "preview",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
