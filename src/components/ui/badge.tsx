import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "outline" | "success";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-strong text-ink-2 border-transparent",
  accent: "bg-accent-wash text-accent-glow border-[color-mix(in_oklab,var(--accent)_45%,transparent)]",
  outline: "bg-transparent text-ink-2 border-line-strong",
  success: "bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-success border-[color-mix(in_oklab,var(--success)_35%,transparent)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Shows a small leading status dot in the current text colour. */
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-label inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
