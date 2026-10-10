import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { parse as parseYaml } from "yaml";

import type { Locale } from "@/i18n/config";
import type { Article, ArticleFrontmatter, ArticleMeta } from "@/types/content";

import { readingMinutes, renderMarkdown } from "./markdown";

/**
 * Articles are Markdown files in src/content/articles/<locale>/<slug>.md with
 * YAML frontmatter. Files starting with "_" are ignored (templates, notes).
 * Drafts (`draft: true`) are only listed in development.
 */
export const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class ArticleError extends Error {}

/** Parses and validates one article file. Throws ArticleError on bad input. */
export function parseArticle(source: string, slug: string, locale: Locale): { meta: ArticleMeta; body: string } {
  if (!SLUG.test(slug)) throw new ArticleError(`Invalid article slug "${slug}"`);
  const match = FRONTMATTER.exec(source);
  if (!match) throw new ArticleError(`Article "${slug}" is missing YAML frontmatter`);
  const data = parseYaml(match[1] ?? "") as Partial<Record<keyof ArticleFrontmatter, unknown>> | null;
  const body = match[2] ?? "";

  if (!data || typeof data.title !== "string" || !data.title.trim()) throw new ArticleError(`Article "${slug}" needs a title`);
  if (typeof data.summary !== "string" || !data.summary.trim()) throw new ArticleError(`Article "${slug}" needs a summary`);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
  if (typeof date !== "string" || !DATE.test(date)) throw new ArticleError(`Article "${slug}" needs a date (YYYY-MM-DD)`);
  const tags = Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [];

  return {
    meta: {
      slug,
      locale,
      title: data.title.trim(),
      summary: data.summary.trim(),
      date,
      tags,
      draft: data.draft === true,
      readingMinutes: readingMinutes(body),
    },
    body,
  };
}

async function listFiles(locale: Locale, root: string): Promise<string[]> {
  try {
    const entries = await readdir(path.join(root, locale));
    return entries.filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  } catch {
    return [];
  }
}

const includeDrafts = () => process.env.NODE_ENV === "development";

export async function getArticles(locale: Locale, root = ARTICLES_DIR): Promise<ArticleMeta[]> {
  const files = await listFiles(locale, root);
  const articles = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(root, locale, file), "utf8");
      return parseArticle(source, file.replace(/\.md$/, ""), locale).meta;
    }),
  );
  return articles.filter((article) => includeDrafts() || !article.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(locale: Locale, slug: string, root = ARTICLES_DIR): Promise<Article | undefined> {
  if (!SLUG.test(slug)) return undefined;
  let source: string;
  try {
    source = await readFile(path.join(root, locale, `${slug}.md`), "utf8");
  } catch {
    return undefined;
  }
  const { meta, body } = parseArticle(source, slug, locale);
  if (meta.draft && !includeDrafts()) return undefined;
  return { ...meta, html: renderMarkdown(body) };
}
