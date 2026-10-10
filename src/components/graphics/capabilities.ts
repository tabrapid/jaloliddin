export type GraphicsDecision =
  | { mode: "webgl"; quality: "high" | "lite" }
  | { mode: "fallback"; reason: "forced" | "reduced-motion" | "save-data" | "low-memory" | "no-webgl" };

export interface GraphicsEnvironment {
  /** Value of the `?graphics=` debug override, if any. */
  override: string | null;
  reducedMotion: boolean;
  saveData: boolean;
  /** navigator.deviceMemory in GB (undefined where unsupported). */
  deviceMemory: number | undefined;
  hardwareConcurrency: number | undefined;
  coarsePointer: boolean;
  viewportWidth: number;
  /** Whether a hardware-accelerated WebGL context can be created. */
  webgl: boolean;
}

/**
 * Pure decision logic for the hero graphic (unit-tested).
 * `?graphics=fallback` or `?graphics=webgl` overrides detection for testing;
 * reduced motion always wins over a forced WebGL request.
 */
export function decideGraphics(env: GraphicsEnvironment): GraphicsDecision {
  if (env.reducedMotion) return { mode: "fallback", reason: "reduced-motion" };
  if (env.override === "fallback") return { mode: "fallback", reason: "forced" };

  const forced = env.override === "webgl";
  if (!forced) {
    if (env.saveData) return { mode: "fallback", reason: "save-data" };
    if (env.deviceMemory !== undefined && env.deviceMemory < 4) return { mode: "fallback", reason: "low-memory" };
    if (!env.webgl) return { mode: "fallback", reason: "no-webgl" };
  }

  const lite =
    env.coarsePointer || env.viewportWidth < 768 || (env.hardwareConcurrency !== undefined && env.hardwareConcurrency <= 4);
  return { mode: "webgl", quality: lite ? "lite" : "high" };
}

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;

/** True when the renderer string names a CPU rasterizer rather than a GPU. */
export function isSoftwareRenderer(renderer: string | null | undefined): boolean {
  return Boolean(renderer && SOFTWARE_RENDERER.test(renderer));
}

/**
 * Probes for a hardware-accelerated WebGL context without keeping it alive.
 * Software rasterizers (SwiftShader, llvmpipe…) count as unsupported: the
 * scene would run on the CPU and block the main thread.
 */
export function probeWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
    const context = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
    if (!context) return false;
    const debug = context.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? context.getParameter(debug.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER);
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return !isSoftwareRenderer(typeof renderer === "string" ? renderer : null);
  } catch {
    return false;
  }
}

export function readGraphicsEnvironment(): GraphicsEnvironment {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  const override = new URLSearchParams(window.location.search).get("graphics");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    override,
    reducedMotion,
    saveData: Boolean(nav.connection?.saveData),
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    viewportWidth: window.innerWidth,
    // Only probe when it can matter (avoids creating a context needlessly).
    webgl: reducedMotion || override === "fallback" ? false : probeWebGL(),
  };
}
