import { cn } from "@/lib/cn";

export interface TimelineItem {
  id: string;
  title: string;
  /** Optional date or step marker, rendered in the mono label style. */
  marker?: string;
  body?: string;
}

/**
 * Ordered sequence (steps or dated milestones) on a vertical rail.
 * Uses <ol> so order is conveyed to assistive technology.
 */
export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("relative flex flex-col", className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative grid grid-cols-[2.25rem_1fr] gap-x-4 pb-7 last:pb-0">
          <span aria-hidden="true" className="relative flex justify-center">
            <span className="z-10 mt-1 flex size-6 items-center justify-center rounded-full border border-line-strong bg-canvas font-mono text-[0.6875rem] text-ink-2">
              {index + 1}
            </span>
            {index < items.length - 1 ? <span className="absolute top-7 bottom-[-0.25rem] w-px bg-line-strong" /> : null}
          </span>
          <div className="flex flex-col gap-1 pt-0.5">
            {item.marker ? <span className="text-label text-ink-3">{item.marker}</span> : null}
            <p className="text-ink">{item.title}</p>
            {item.body ? <p className="text-small text-ink-3">{item.body}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
