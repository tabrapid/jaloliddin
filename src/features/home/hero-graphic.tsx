"use client";

import { lazy, type ReactNode } from "react";

import { SceneWrapper } from "@/components/graphics/scene-wrapper";

// Module-level lazy component: the Three.js chunk downloads only when rendered.
const HeroScene = lazy(() => import("@/components/graphics/hero-scene"));

export interface HeroGraphicProps {
  fallback: ReactNode;
  label: string;
  controls: { pause: string; play: string };
  className?: string;
}

/** Binds the generic SceneWrapper to the signature J scene. */
export function HeroGraphic(props: HeroGraphicProps) {
  return <SceneWrapper scene={HeroScene} {...props} />;
}
