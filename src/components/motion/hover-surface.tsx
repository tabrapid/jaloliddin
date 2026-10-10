"use client";

import { m } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { spring } from "./tokens";

export interface HoverSurfaceProps {
  children: ReactNode;
  className?: string;
  /** Lift the surface slightly on hover (mouse/pen only). */
  lift?: boolean;
}

/**
 * Refined hover response: a soft accent light that follows a fine pointer and
 * an optional spring lift. Purely decorative — all content and links inside
 * work identically on touch and keyboard.
 */
export function HoverSurface({ children, className, lift = true }: HoverSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={handlePointerMove}
      whileHover={lift ? { y: -4 } : undefined}
      transition={spring.gentle}
      className={cn("group/hover relative isolate", className)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), color-mix(in oklab, var(--accent) 13%, transparent), transparent 62%)",
        }}
      />
      {children}
    </m.div>
  );
}
