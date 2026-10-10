import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MetaItem {
  label: string;
  value: ReactNode;
}

/** Definition list for project metadata (status, role, audience…). */
export function ProjectMeta({ items, className, columns = 2 }: { items: MetaItem[]; className?: string; columns?: 2 | 3 | 4 }) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <dl className={cn("grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line", grid, className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-2 bg-canvas px-5 py-4">
          <dt className="text-label text-ink-3">{item.label}</dt>
          <dd className="text-[0.975rem] leading-snug text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
