import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type SectionSpacing = "default" | "tight" | "none";
export type SectionTone = "plain" | "raised" | "blueprint" | "deep";

const spacing: Record<SectionSpacing, string> = {
  default: "py-section",
  tight: "py-section-tight",
  none: "",
};

const tones: Record<SectionTone, string> = {
  plain: "",
  raised: "bg-raised",
  blueprint: "bg-canvas-deep blueprint",
  deep: "bg-canvas-deep",
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article" | "aside" | "footer" | "header";
  spacing?: SectionSpacing;
  tone?: SectionTone;
  /** Draws a hairline on top, used to separate adjacent sections. */
  divided?: boolean;
}

/**
 * Vertical rhythm wrapper. Give it `aria-labelledby` pointing at its heading
 * so it is exposed as a named region.
 */
export function Section({
  as: Component = "section",
  spacing: space = "default",
  tone = "plain",
  divided = false,
  className,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn("relative", spacing[space], tones[tone], divided && "hairline-t", className)}
      {...props}
    />
  );
}
