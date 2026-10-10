import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

export interface TextEntranceProps {
  text: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  /**
   * "settle" (default): words glide into place without fading, so large text
   * is painted immediately (LCP-safe). "rise": words fade and rise — use for
   * small text only.
   */
  variant?: "settle" | "rise";
  /** Start delay in milliseconds. */
  delay?: number;
  /** Milliseconds between words. */
  step?: number;
  className?: string;
}

/**
 * Brief CSS-only text entrance, word by word. Works without JavaScript and is
 * skipped under `prefers-reduced-motion`. The text exists once in the DOM
 * (no visually hidden duplicate), so copy, search and screen readers all get
 * the plain sentence.
 */
export function TextEntrance({ text, as: Tag = "span", variant = "settle", delay = 0, step = 55, className }: TextEntranceProps) {
  const parts = text.split(/(\s+)/);
  let index = 0;

  return (
    <Tag className={className}>
      {parts.map((part, key) => {
        if (part === "" || /^\s+$/.test(part)) return part;
        const style = { "--entrance-delay": delay + index++ * step } as CSSProperties;
        return (
          <span key={key} className={cn("inline-block", variant === "settle" ? "entrance-settle" : "entrance")} style={style}>
            {part}
          </span>
        );
      })}
    </Tag>
  );
}
