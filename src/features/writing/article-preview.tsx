import Link from "next/link";

import { HoverSurface } from "@/components/motion/hover-surface";
import { Badge } from "@/components/ui/badge";

export interface ArticlePreviewProps {
  href: string;
  title: string;
  summary: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Pre-formatted, localised date for display. */
  dateLabel: string;
  readingTime: string;
  tags?: string[];
}

/** Article teaser row with a stretched title link. */
export function ArticlePreview({ href, title, summary, date, dateLabel, readingTime, tags = [] }: ArticlePreviewProps) {
  return (
    <HoverSurface lift={false} className="rounded-lg">
      <article className="relative grid gap-4 rounded-lg border border-line p-6 transition-colors group-hover/hover:border-line-strong md:grid-cols-[10rem_1fr] md:gap-8 lg:p-8">
        <p className="text-label flex flex-col gap-1 text-ink-3">
          <time dateTime={date}>{dateLabel}</time>
          <span>{readingTime}</span>
        </p>
        <div className="flex flex-col gap-3">
          <h2 className="text-heading font-semibold text-ink">
            <Link href={href} className="rounded-xs after:absolute after:inset-0 after:rounded-lg after:content-['']">
              {title}
            </Link>
          </h2>
          <p className="text-ink-2">{summary}</p>
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <li key={tag}>
                  <Badge tone="neutral">{tag}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </HoverSurface>
  );
}
