import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type StackGap = "2xs" | "xs" | "sm" | "md" | "lg" | "xl";

const gaps: Record<StackGap, string> = {
  "2xs": "gap-1",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-10",
  xl: "gap-16",
};

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "ul" | "ol" | "nav" | "header" | "footer";
  gap?: StackGap;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
}

const alignments = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" };

/** One-dimensional layout with consistent gaps. */
export function Stack({
  as: Component = "div",
  gap = "md",
  direction = "column",
  align = "stretch",
  wrap = false,
  className,
  ...props
}: StackProps) {
  return (
    <Component
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        gaps[gap],
        alignments[align],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}
