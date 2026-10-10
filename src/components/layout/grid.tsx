import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type GridGap = "sm" | "md" | "lg";

const gaps: Record<GridGap, string> = {
  sm: "gap-x-4 gap-y-6",
  md: "gap-x-6 gap-y-10 lg:gap-x-8",
  lg: "gap-x-8 gap-y-14 lg:gap-x-12",
};

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "ul" | "ol" | "dl";
  gap?: GridGap;
}

/**
 * The site grid: 4 columns on mobile, 8 on tablet, 12 on desktop.
 * Children place themselves with col-span / col-start utilities, which is how
 * the intentional asymmetry stays on one consistent grid.
 */
export function Grid({ as: Component = "div", gap = "md", className, ...props }: GridProps) {
  return <Component className={cn("grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12", gaps[gap], className)} {...props} />;
}
