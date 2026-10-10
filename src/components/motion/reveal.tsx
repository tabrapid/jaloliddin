"use client";

import { m } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "./use-reduced-motion";
import { duration, easing } from "./tokens";

type RevealElement = "div" | "section" | "article" | "li" | "figure" | "header" | "p";
type Phase = "static" | "hidden" | "visible";

export interface RevealProps {
  children: ReactNode;
  as?: RevealElement;
  /** Delay in seconds once the element enters the viewport. */
  delay?: number;
  /** Initial vertical offset in pixels. */
  offset?: number;
  className?: string;
}

/**
 * Gentle in-view reveal that never hides content by default.
 *
 * Server HTML is fully visible. After hydration, only elements that start
 * below the fold are hidden (before paint) and animate in when scrolled to.
 * If JavaScript fails, or the visitor prefers reduced motion, nothing is
 * ever hidden.
 */
export function Reveal({ children, as = "div", delay = 0, offset = 28, className }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("static");

  useLayoutEffect(() => {
    const element = ref.current;
    if (reduce || !element || typeof IntersectionObserver === "undefined") return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPhase("visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduce]);

  const Component = m[as];
  const hidden = phase === "hidden";

  return (
    <Component
      ref={ref as never}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y: offset } : { opacity: 1, y: 0 }}
      transition={hidden ? { duration: 0 } : { duration: duration.entrance, ease: easing.outExpo, delay }}
    >
      {children}
    </Component>
  );
}
