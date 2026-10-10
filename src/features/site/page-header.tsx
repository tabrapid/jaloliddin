import type { ReactNode } from "react";

import { Rosette } from "@/components/graphics/ornament";
import { TextEntrance } from "@/components/motion/text-entrance";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  /** Mono label above the title, e.g. "Work" or "Lab / 01". */
  label: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  /** Draw the faint girih rosette in the corner. */
  ornament?: boolean;
  /** Title scale: "lg" for short titles, "md" for sentence-length titles. */
  size?: "lg" | "md";
  className?: string;
}

/** Shared header for inner pages: one h1, editorial scale, optional lead. */
export function PageHeader({ label, title, lead, children, ornament = true, size = "lg", className }: PageHeaderProps) {
  return (
    <header className={cn("atmosphere relative isolate overflow-hidden border-b border-line", className)}>
      {ornament ? (
        <Rosette className="pointer-events-none absolute top-[-35%] right-[-18%] -z-10 w-[min(90vw,46rem)] text-silver-dim opacity-[0.1] md:right-[-6%]" />
      ) : null}
      <div className="mx-auto grid max-w-site grid-cols-4 gap-x-6 gap-y-8 px-gutter pt-16 pb-14 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:pt-24 lg:pb-20">
        <p className="text-label entrance-fade col-span-4 text-accent-ink md:col-span-8 lg:col-span-12">{label}</p>
        <h1
          className={cn(
            "col-span-4 font-semibold text-ink md:col-span-8",
            size === "lg" ? "text-display-lg lg:col-span-10" : "text-display-md max-w-[22ch] lg:col-span-9",
          )}
        >
          <TextEntrance text={title} step={60} />
        </h1>
        {lead ? (
          <p
            className="entrance-settle text-lead col-span-4 max-w-[40rem] text-ink-2 md:col-span-6 lg:col-span-6"
            style={{ ["--entrance-delay" as string]: 300 }}
          >
            {lead}
          </p>
        ) : null}
        {children ? <div className="col-span-4 md:col-span-8 lg:col-span-12">{children}</div> : null}
      </div>
    </header>
  );
}
