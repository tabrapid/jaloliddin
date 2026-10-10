import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ContainerSize = "default" | "narrow" | "reading" | "full";

const sizes: Record<ContainerSize, string> = {
  default: "max-w-site",
  narrow: "max-w-6xl",
  reading: "max-w-3xl",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
  size?: ContainerSize;
}

/** Centres content with the site's fluid side gutter. */
export function Container({ as: Component = "div", size = "default", className, ...props }: ContainerProps) {
  return <Component className={cn("mx-auto w-full px-gutter", sizes[size], className)} {...props} />;
}
