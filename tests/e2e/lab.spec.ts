import { expect, test } from "@playwright/test";

test("binary search plays to a found result", async ({ page }) => {
  await page.goto("/en/lab/binary-search");
  await page.getByTestId("play-toggle").click();
  await expect(page.getByTestId("search-outcome")).toHaveText("Found", { timeout: 15_000 });
  await expect(page.getByTestId("search-summary")).toContainText("Found");
  await expect(page.getByTestId("play-toggle")).toHaveText(/Play/);
});

test("binary search reports a missing value via keyboard-only controls", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard flow on desktop");
  await page.goto("/en/lab/binary-search");
  await page.getByTestId("pick-missing").focus();
  await page.keyboard.press("Enter");
  const next = page.getByTestId("next-step");
  await next.focus();
  for (let i = 0; i < 8; i++) await page.keyboard.press("Enter");
  await expect(page.getByTestId("search-outcome")).toHaveText("Not found");
  await expect(next).toBeFocused();
  await page.getByTestId("reset").focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("step-counter")).toContainText("Step 1 of");
});

test("typing an invalid target shows an accessible error", async ({ page }) => {
  await page.goto("/en/lab/binary-search");
  const input = page.getByRole("textbox", { name: "Target value" });
  await input.fill("500");
  await expect(page.getByTestId("binary-search").getByRole("alert")).toHaveText("Enter a whole number from 1 to 99.");
  await expect(input).toHaveAttribute("aria-invalid", "true");
});
