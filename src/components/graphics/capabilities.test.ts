import { describe, expect, it } from "vitest";

import { decideGraphics, isSoftwareRenderer, type GraphicsEnvironment } from "./capabilities";

const capable: GraphicsEnvironment = {
  override: null,
  reducedMotion: false,
  saveData: false,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
  viewportWidth: 1440,
  webgl: true,
};

describe("decideGraphics", () => {
  it("uses the full scene on capable desktops", () => {
    expect(decideGraphics(capable)).toEqual({ mode: "webgl", quality: "high" });
  });

  it("reduces complexity on touch or small screens", () => {
    expect(decideGraphics({ ...capable, coarsePointer: true })).toEqual({ mode: "webgl", quality: "lite" });
    expect(decideGraphics({ ...capable, viewportWidth: 390 })).toEqual({ mode: "webgl", quality: "lite" });
  });

  it("falls back for reduced motion, data saving, low memory or missing WebGL", () => {
    expect(decideGraphics({ ...capable, reducedMotion: true })).toEqual({ mode: "fallback", reason: "reduced-motion" });
    expect(decideGraphics({ ...capable, saveData: true })).toEqual({ mode: "fallback", reason: "save-data" });
    expect(decideGraphics({ ...capable, deviceMemory: 2 })).toEqual({ mode: "fallback", reason: "low-memory" });
    expect(decideGraphics({ ...capable, webgl: false })).toEqual({ mode: "fallback", reason: "no-webgl" });
  });

  it("honours the debug override, but reduced motion always wins", () => {
    expect(decideGraphics({ ...capable, override: "fallback" })).toEqual({ mode: "fallback", reason: "forced" });
    expect(decideGraphics({ ...capable, webgl: false, override: "webgl" }).mode).toBe("webgl");
    expect(decideGraphics({ ...capable, reducedMotion: true, override: "webgl" }).mode).toBe("fallback");
  });
});

describe("isSoftwareRenderer", () => {
  it("recognises CPU rasterizers", () => {
    expect(isSoftwareRenderer("ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)")).toBe(true);
    expect(isSoftwareRenderer("llvmpipe (LLVM 15.0.7, 256 bits)")).toBe(true);
    expect(isSoftwareRenderer("Microsoft Basic Render Driver")).toBe(true);
  });

  it("accepts real GPUs and unknown renderers", () => {
    expect(isSoftwareRenderer("ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)")).toBe(false);
    expect(isSoftwareRenderer("Adreno (TM) 730")).toBe(false);
    expect(isSoftwareRenderer(null)).toBe(false);
  });
});
