import { cn } from "@/lib/cn";

export type DividerVariant = "line" | "ornament" | "label";

export interface DividerProps {
  variant?: DividerVariant;
  /** Text for the label variant (rendered in the mono label style). */
  label?: string;
  className?: string;
}

/** An eight-pointed star (two overlapping squares), drawn as a single path. */
function StarGlyph() {
  return (
    <svg width="14" height="14" viewBox="-10 -10 20 20" aria-hidden="true" className="shrink-0 text-silver-dim">
      <path
        d="M0-9 2.6-6.3 6.4-6.4 6.3-2.6 9 0 6.3 2.6 6.4 6.4 2.6 6.3 0 9-2.6 6.3-6.4 6.4-6.3 2.6-9 0-6.3-2.6-6.4-6.4-2.6-6.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Horizontal separator. Decorative variants are hidden from assistive tech. */
export function Divider({ variant = "line", label, className }: DividerProps) {
  if (variant === "line") {
    return <hr className={cn("border-0 border-t border-line", className)} />;
  }
  return (
    <div role="separator" className={cn("flex items-center gap-4 text-ink-3", className)}>
      <span className="h-px flex-1 bg-line" />
      {variant === "ornament" ? <StarGlyph /> : <span className="text-label">{label}</span>}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
