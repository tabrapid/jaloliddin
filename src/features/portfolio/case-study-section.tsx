import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface CaseStudySectionProps {
  id: string;
  index: string;
  title: string;
  /** Short framing sentence under the title (e.g. an honesty note). */
  note?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Numbered case-study chapter: a narrow index/title rail on the left and the
 * content on the right — the editorial asymmetry used across project pages.
 */
export function CaseStudySection({ id, index, title, note, children, className }: CaseStudySectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("grid scroll-mt-28 grid-cols-4 gap-x-6 gap-y-6 border-t border-line pt-10 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8", className)}
    >
      <div className="col-span-4 flex flex-col gap-3 md:col-span-3 lg:col-span-4">
        <span className="text-label text-accent-ink">{index}</span>
        <h2 id={headingId} className="text-heading font-semibold text-ink">
          {title}
        </h2>
        {note ? <p className="max-w-xs text-small text-ink-3">{note}</p> : null}
      </div>
      <div className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-6">{children}</div>
    </section>
  );
}
