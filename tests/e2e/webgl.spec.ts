import { expect, test } from "@playwright/test";

// Software GL lets headless Chromium render the scene. The production probe
// rejects software renderers, so these tests force WebGL with ?graphics=webgl.
test.use({
  launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
});

test("mounts when forced, cross-fades in, and falls back on context loss", async ({ page, isMobile }) => {
  test.skip(isMobile, "One WebGL run is enough");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/en?graphics=webgl");
  const wrapper = page.locator("[data-graphics]");
  await expect(wrapper).toHaveAttribute("data-graphics", "scene", { timeout: 20_000 });
  await expect(page.locator("canvas")).toHaveCount(1);

  // Pausing keeps the canvas (renders on demand) and flips the motion state.
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(wrapper).toHaveAttribute("data-motion", "paused");
  await expect(page.locator("canvas")).toHaveCount(1);

  // Simulate a GPU context loss: the static SVG must take over.
  await page.evaluate(() => {
    const canvas = document.querySelector("canvas")!;
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(wrapper).toHaveAttribute("data-graphics", "fallback");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("scene-fallback").locator("svg")).toBeVisible();
  expect(errors).toEqual([]);
});

test("rejects a software renderer by default and keeps the SVG", async ({ page, isMobile }) => {
  test.skip(isMobile, "One WebGL run is enough");
  await page.goto("/en");
  const wrapper = page.locator("[data-graphics]");
  await expect(wrapper).toHaveAttribute("data-graphics", "fallback");
  await expect(page.locator("canvas")).toHaveCount(0);
});
