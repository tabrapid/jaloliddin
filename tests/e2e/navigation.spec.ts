import { expect, test, type Page } from "@playwright/test";

const pages = [
  { path: "/en", title: /Jaloliddin/ },
  { path: "/en/work", title: /^Work — Jaloliddin$/ },
  { path: "/en/work/bloodchain", title: /^Bloodchain — Jaloliddin$/ },
  { path: "/en/work/school-platform", title: /^School platform — Jaloliddin$/ },
  { path: "/en/about", title: /^About — Jaloliddin$/ },
  { path: "/en/lab", title: /^Lab — Jaloliddin$/ },
  { path: "/en/lab/binary-search", title: /^Binary search, step by step — Jaloliddin$/ },
  { path: "/en/writing", title: /^Writing — Jaloliddin$/ },
  { path: "/en/contact", title: /^Contact — Jaloliddin$/ },
  { path: "/uz", title: /Jaloliddin/ },
  { path: "/uz/work/bloodchain", title: /^Bloodchain — Jaloliddin$/ },
  { path: "/uz/about", title: /^Men haqimda — Jaloliddin$/ },
];

function trackConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  return problems;
}

test("the root redirects to English", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

for (const { path, title } of pages) {
  test(`renders ${path} with one h1, correct lang and no console errors`, async ({ page }) => {
    const problems = trackConsole(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", path.startsWith("/uz") ? "uz-Latn" : "en");
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="uz"]')).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });
}

test("every internal link resolves (crawl from both home pages)", async ({ page, request }) => {
  test.skip(test.info().project.name !== "desktop", "Crawl once");
  const seen = new Set<string>();
  const queue = ["/en", "/uz"];
  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    await page.goto(path);
    const hrefs = await page.$$eval("a[href]", (anchors) => anchors.map((a) => a.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const clean = href.split("#")[0]!;
      if (clean && !seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    }
  }
  expect(seen.size).toBeGreaterThan(15);
  for (const path of seen) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

test("unknown pages render the localized 404 with working navigation", async ({ page }) => {
  const response = await page.goto("/uz/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Sahifa topilmadi");
  await expect(page.locator("html")).toHaveAttribute("lang", "uz-Latn");
  await page.getByRole("link", { name: "Bosh sahifaga qaytish" }).click();
  await expect(page).toHaveURL(/\/uz$/);

  expect((await page.goto("/en/work/not-a-project"))?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
});

test("the component explorer is not available in production", async ({ page }) => {
  const response = await page.goto("/explorer");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Digital Workshop UI")).toHaveCount(0);
});

test("SEO files are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/uz/work/bloodchain");
  const og = await request.get("/en/opengraph-image");
  expect(og.headers()["content-type"]).toBe("image/png");
});
