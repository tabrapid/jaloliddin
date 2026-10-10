import type { HTMLAttributes } from "react";

/** Hides content visually while keeping it available to assistive technology. */
export function VisuallyHidden(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className="sr-only" />;
}
