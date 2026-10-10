import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  id: string;
  index: string;
  label: string;
  title: string;
  /** Optional element aligned to the end of the heading row (e.g. a link). */
  action?: ReactNode;
  className?: string;
}

/** Editorial section header: mono index + label above an oversized title. */
export function SectionHeading({ id, index, label, title, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-x-6 gap-y-6 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8", className)}>
      <p className="text-label col-span-4 flex items-center gap-3 text-ink-3 md:col-span-8 lg:col-span-3 lg:pt-3">
        <span className="text-accent-ink">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        {label}
      </p>
      <h2 id={id} className="text-display-lg col-span-4 font-semibold text-ink md:col-span-8 lg:col-span-8">
        {title}
      </h2>
      {action ? <div className="col-span-4 md:col-span-8 lg:col-span-12 lg:flex lg:justify-end">{action}</div> : null}
    </div>
  );
}
