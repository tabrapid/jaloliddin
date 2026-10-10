import { Marked } from "marked";

const UNSAFE_URL = /^\s*(javascript|vbscript|data):/i;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Markdown renderer for local, author-controlled articles.
 * Defence in depth: raw HTML in Markdown is escaped (shown as text) and
 * script-capable URLs are neutralised, so articles cannot inject markup.
 */
const markdown = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
  },
  walkTokens(token) {
    if ((token.type === "link" || token.type === "image") && UNSAFE_URL.test(token.href)) {
      token.href = "#";
    }
  },
});

export function renderMarkdown(source: string): string {
  return markdown.parse(source, { async: false });
}

/** Rough reading time at ~200 words per minute (minimum one minute). */
export function readingMinutes(source: string): number {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
