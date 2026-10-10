import { expect, test } from "@playwright/test";

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("uses the static SVG and offers no animation toggle", async ({ page }) => {
    await page.goto("/en");
    const wrapper = page.locator("[data-graphics]");
    await expect(wrapper).toHaveAttribute("data-graphics", "fallback");
    await expect(page.getByTestId("scene-fallback").locator("svg")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByTestId("scene-toggle")).toHaveCount(0);
    // Content is fully visible without animation.
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Projects where the structure/ })).toBeVisible();
  });
});

test("falls back to SVG when WebGL cannot initialise", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.startsWith("webgl")) return null;
      return (original as (...a: unknown[]) => unknown).call(this, type, ...args);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/en?graphics=auto");
  await expect(page.locator("[data-graphics]")).toHaveAttribute("data-graphics", "fallback");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("scene-fallback").locator("svg")).toBeVisible();
});

test("the pause control toggles decorative motion", async ({ page }) => {
  await page.goto("/en?graphics=fallback");
  const wrapper = page.locator("[data-graphics]");
  await expect(wrapper).toHaveAttribute("data-graphics", "fallback");
  const toggle = page.getByRole("button", { name: "Pause animation" });
  await toggle.click();
  await expect(wrapper).toHaveAttribute("data-motion", "paused");
  await expect(page.getByRole("button", { name: "Play animation" })).toBeVisible();
});

test("the graphic is exposed as a single described image", async ({ page }) => {
  await page.goto("/en?graphics=fallback");
  const image = page.getByRole("img", { name: /sculptural letter J/ });
  await expect(image).toHaveCount(1);
});
