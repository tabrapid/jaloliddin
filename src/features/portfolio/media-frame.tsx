import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MediaFrameProps {
  children: ReactNode;
  /** Short label pinned to the frame, e.g. "Conceptual illustration". */
  label?: string;
  /** Secondary note next to the label, e.g. "Not a product screenshot." */
  note?: string;
  caption?: ReactNode;
  /** Reserved aspect ratio (prevents layout shift). */
  ratio?: "16/10" | "4/3" | "1/1" | "3/2";
  className?: string;
}

const ratios = { "16/10": "aspect-[16/10]", "4/3": "aspect-[4/3]", "1/1": "aspect-square", "3/2": "aspect-[3/2]" };

/** Framed figure for screenshots and illustrations, with an honest label. */
export function MediaFrame({ children, label, note, caption, ratio = "16/10", className }: MediaFrameProps) {
  return (
    <figure className={cn("relative flex flex-col gap-3", className)}>
      {/* The label sits above the frame on small screens and overlays it from sm up. */}
      <div className={cn("relative order-2 overflow-hidden rounded-lg border border-line bg-canvas-deep", ratios[ratio])}>
        {children}
      </div>
      {label ? (
        <div className="order-1 flex flex-wrap items-center gap-2 sm:absolute sm:top-4 sm:left-4 sm:z-10">
            <span className="text-label rounded-pill border border-line-strong bg-canvas/80 px-2.5 py-1 text-ink backdrop-blur">
              {label}
            </span>
          {note ? <span className="text-label text-ink-3">{note}</span> : null}
        </div>
      ) : null}
      {caption ? <figcaption className="order-3 text-small text-ink-3">{caption}</figcaption> : null}
    </figure>
  );
}
