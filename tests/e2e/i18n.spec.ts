import { expect, test } from "@playwright/test";

test("switching language keeps the current page", async ({ page, isMobile }) => {
  await page.goto("/en/work/bloodchain");
  if (isMobile) {
    await page.getByTestId("menu-trigger").click();
    await page.getByRole("dialog").getByRole("link", { name: /Oʻzbekcha/ }).click();
  } else {
    await page.getByRole("banner").getByRole("link", { name: /Switch language to Oʻzbekcha/ }).click();
  }
  await expect(page).toHaveURL(/\/uz\/work\/bloodchain$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "uz-Latn");
  await expect(page.locator("h1")).toHaveText("Bloodchain");
  await expect(page.getByText("Rejalashtirilgan qamrov").first()).toBeVisible();
});

test("the language choice is remembered for locale-less URLs", async ({ page }) => {
  await page.goto("/en/about");
  await page.goto("/uz/about");
  await page.locator("footer").getByRole("link", { name: "Oʻzbekcha" }).click();
  await page.goto("/");
  await expect(page).toHaveURL(/\/uz$/);
  await page.goto("/work");
  await expect(page).toHaveURL(/\/uz\/work$/);
});

test("Uzbek modifier letters render with the site font", async ({ page }) => {
  await page.goto("/uz");
  await expect(page.getByText("Talaba dasturchi · Oʻzbekiston")).toBeVisible();
  const covered = await page.evaluate(async () => {
    await document.fonts.ready;
    const family = getComputedStyle(document.querySelector("h1")!).fontFamily.split(",")[0]!.trim();
    // True only if a loaded face of the site family covers U+02BB and U+02BC.
    return { family, ok: document.fonts.check(`16px ${family}`, "\u02BB\u02BC") };
  });
  expect(covered.family).not.toMatch(/system-ui|sans-serif/);
  expect(covered.ok).toBe(true);
});

test("ʻ (U+02BB) is as narrow as ‘ in the display font (no gap in oʻ / gʻ)", async ({ page }) => {
  await page.goto("/uz");
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const style = getComputedStyle(document.querySelector("h1")!);
    // Chromium returns "" for the computed `font` shorthand; build it explicitly
    // from the primary family only (next/font's local fallback face never loads).
    const family = style.fontFamily.split(",")[0]!.trim();
    const font = `${style.fontWeight} 200px ${family}`;
    const context = document.createElement("canvas").getContext("2d")!;
    context.font = font;
    const width = (text: string) => context.measureText(text).width;
    return {
      fontLoaded: document.fonts.check(font, "Gʻo"),
      family,
      okina: width("Gʻo"),
      quote: width("G\u2018o"),
      bare: width("Go"),
    };
  });
  expect(result.fontLoaded).toBe(true);
  expect(result.family).not.toMatch(/^(system-ui|sans-serif)/);
  expect(result.okina).toBeGreaterThan(result.bare); // the mark has width at all
  expect(Math.abs(result.okina - result.quote)).toBeLessThan(1);
});
