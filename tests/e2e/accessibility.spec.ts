import { expect, test } from "@playwright/test";

test("skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard-first check runs on desktop");
  await page.goto("/en/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("main#main-content")).toBeFocused();
});

test("mobile menu traps focus, closes with Escape and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation only");
  await page.goto("/en");
  const trigger = page.getByTestId("menu-trigger");
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await dialog.getByRole("link", { name: /Lab/ }).click();
  await expect(page).toHaveURL(/\/en\/lab$/);
  await expect(dialog).toBeHidden();
});

test("desktop navigation marks the current section", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation only");
  await page.goto("/en/work/bloodchain");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
});

test("touch targets in the header are at least 44px", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile only");
  await page.goto("/en");
  for (const locator of [page.getByTestId("menu-trigger"), page.getByRole("banner").getByRole("link").first()]) {
    const box = await locator.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("pages have no horizontal overflow", async ({ page }) => {
  for (const path of ["/en", "/uz/work/bloodchain", "/uz/lab/binary-search", "/en/about", "/en/contact"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
