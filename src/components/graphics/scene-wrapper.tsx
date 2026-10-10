"use client";

import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

import { decideGraphics, readGraphicsEnvironment, type GraphicsDecision } from "./capabilities";
import { SceneErrorBoundary } from "./scene-error-boundary";

export interface SceneComponentProps {
  playing: boolean;
  active: boolean;
  quality: "high" | "lite";
  onReady: () => void;
  onContextLost: () => void;
}

export interface SceneWrapperProps {
  /**
   * The 3D scene, created at module level with React.lazy so its code is
   * only downloaded when the wrapper decides to render it.
   */
  scene: ComponentType<SceneComponentProps>;
  /** Static, server-rendered artwork shown first and whenever 3D is unsuitable. */
  fallback: ReactNode;
  /** Accessible description of the artwork. */
  label: string;
  controls: { pause: string; play: string };
  className?: string;
}

type Phase = "waiting" | "loading" | "ready" | "failed";
export type SceneMode = "static" | "loading" | "scene" | "fallback";

// The capability decision is made once per page load, on the client only.
let cachedDecision: GraphicsDecision | null = null;
const subscribeNoop = () => () => {};
function getDecision(): GraphicsDecision {
  cachedDecision ??= decideGraphics(readGraphicsEnvironment());
  return cachedDecision;
}

export function resolveSceneMode(decision: GraphicsDecision | null, reduced: boolean, phase: Phase): SceneMode {
  if (!decision) return "static";
  if (reduced || decision.mode === "fallback" || phase === "failed") return "fallback";
  if (phase === "waiting") return "static";
  return phase === "loading" ? "loading" : "scene";
}

/**
 * Progressive 3D: renders `fallback` immediately (server HTML), decides on
 * the client whether a WebGL scene is appropriate, loads it when the browser
 * is idle and cross-fades once the first frame is drawn. Falls back on
 * reduced motion, missing WebGL, load errors or context loss. Rendering
 * pauses while offscreen or in a hidden tab, and a visible control lets the
 * visitor pause all motion (WCAG 2.2.2).
 */
export function SceneWrapper({ scene: Scene, fallback, label, controls, className }: SceneWrapperProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const decision = useSyncExternalStore(subscribeNoop, getDecision, () => null);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const wantsScene = decision?.mode === "webgl" && !reduced;

  // Load the scene during idle time so it never competes with first paint.
  useEffect(() => {
    if (!wantsScene) return;
    const start = () => setPhase((current) => (current === "waiting" ? "loading" : current));
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 400);
    return () => clearTimeout(id);
  }, [wantsScene]);

  useEffect(() => {
    const element = root.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin: "120px 0px",
    });
    observer.observe(element);
    const handleVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handleReady = useCallback(() => setPhase((current) => (current === "loading" ? "ready" : current)), []);
  const handleFailure = useCallback(() => setPhase("failed"), []);

  const mode = resolveSceneMode(decision, reduced, phase);
  const showScene = mode === "loading" || mode === "scene";
  const animated = !reduced;
  const quality = decision?.mode === "webgl" ? decision.quality : "lite";

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      data-graphics={mode}
      data-motion={animated && playing ? "running" : "paused"}
    >
      <div role="img" aria-label={label} className="absolute inset-0">
        <div
          aria-hidden="true"
          className={cn("absolute inset-0 transition-opacity duration-1000 ease-out-expo", mode === "scene" && "opacity-0")}
          data-testid="scene-fallback"
        >
          {fallback}
        </div>
        {showScene ? (
          <SceneErrorBoundary onError={handleFailure}>
            <Suspense fallback={null}>
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-out-expo",
                  mode === "scene" ? "opacity-100" : "opacity-0",
                )}
                data-testid="scene-canvas"
              >
                <Scene
                  playing={playing}
                  active={inView && pageVisible}
                  quality={quality}
                  onReady={handleReady}
                  onContextLost={handleFailure}
                />
              </div>
            </Suspense>
          </SceneErrorBoundary>
        ) : null}
      </div>

      {animated ? (
        <Tooltip content={playing ? controls.pause : controls.play} side="left">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="absolute top-2 right-2 z-10 inline-flex size-11 items-center justify-center rounded-pill border border-line-strong bg-canvas/60 text-ink-2 backdrop-blur transition-colors hover:border-silver hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            data-testid="scene-toggle"
          >
            {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            <span className="sr-only">{playing ? controls.pause : controls.play}</span>
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
}
