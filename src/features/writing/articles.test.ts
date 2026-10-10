import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { ArticleError, ARTICLES_DIR, getArticle, getArticles, parseArticle } from "./articles";

const FIXTURES = path.join(process.cwd(), "tests", "fixtures", "articles");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("article loader", () => {
  it("lists published articles newest first and ignores drafts and templates in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const articles = await getArticles("en", FIXTURES);
    expect(articles.map((a) => a.slug)).toEqual(["first-note"]);
    expect(articles[0]).toMatchObject({ title: "A test note", date: "2026-01-15", tags: ["testing", "markdown"], locale: "en" });
  });

  it("includes drafts in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const articles = await getArticles("en", FIXTURES);
    expect(articles.map((a) => a.slug)).toEqual(["draft-note", "first-note"]);
  });

  it("loads per locale", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await getArticles("uz", FIXTURES)).map((a) => a.title)).toEqual(["Sinov yozuvi"]);
  });

  it("renders Markdown, escapes raw HTML and neutralises unsafe links", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const article = await getArticle("en", "first-note", FIXTURES);
    expect(article?.html).toContain("<h2>Heading</h2>");
    expect(article?.html).toContain("<strong>bold</strong>");
    expect(article?.html).toContain('href="https://example.org"');
    expect(article?.html).not.toContain("javascript:");
    expect(article?.html).not.toContain("<script>");
    expect(article?.html).toContain("&lt;script&gt;");
  });

  it("hides drafts and unknown slugs in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(await getArticle("en", "draft-note", FIXTURES)).toBeUndefined();
    expect(await getArticle("en", "missing", FIXTURES)).toBeUndefined();
    expect(await getArticle("en", "../etc/passwd", FIXTURES)).toBeUndefined();
  });

  it("validates frontmatter", () => {
    expect(() => parseArticle("no frontmatter", "x", "en")).toThrow(ArticleError);
    expect(() => parseArticle("---\ntitle: T\n---\nbody", "x", "en")).toThrow(/summary/);
    expect(() => parseArticle("---\ntitle: T\nsummary: S\ndate: soon\n---\n", "x", "en")).toThrow(/date/);
    expect(() => parseArticle("---\ntitle: T\nsummary: S\ndate: 2026-01-01\n---\n", "Bad Slug", "en")).toThrow(/slug/);
  });

  it("has no unpublished placeholder articles in the real content folder", async () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const locale of ["en", "uz"] as const) {
      for (const article of await getArticles(locale, ARTICLES_DIR)) {
        expect(article.title).not.toMatch(/lorem|todo|placeholder/i);
      }
    }
  });
});
