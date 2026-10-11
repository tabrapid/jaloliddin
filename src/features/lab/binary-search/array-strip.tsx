import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import type { SearchStep } from "./algorithm";

export interface ArrayStripLabels {
  low: string;
  mid: string;
  high: string;
  index: string;
}

export interface ArrayStripProps {
  array: readonly number[];
  step: SearchStep;
  labels: ArrayStripLabels;
  /** Compact rendering for previews (smaller cells, no index row). */
  compact?: boolean;
  className?: string;
}

type CellState = "active" | "eliminated" | "mid" | "found";

function cellState(step: SearchStep, index: number): CellState {
  if (step.kind === "compare") {
    if (index === step.mid) return step.comparison === "equal" ? "found" : "mid";
    return index >= step.low && index <= step.high ? "active" : "eliminated";
  }
  if (step.kind === "not-found") return "eliminated";
  return index >= step.low && index <= step.high ? "active" : "eliminated";
}

const cellStyles: Record<CellState, string> = {
  active: "border-line-strong bg-raised text-ink",
  eliminated: "border-line bg-transparent text-ink-3/50",
  mid: "border-accent bg-accent-wash text-ink shadow-glow",
  found: "border-success bg-[color-mix(in_oklab,var(--success)_16%,transparent)] text-ink",
};

/**
 * Presentational array with low / mid / high pointers for one search step.
 * Server-compatible (no hooks); pointer movement uses a CSS transition that
 * the global reduced-motion rule turns off.
 */
export function ArrayStrip({ array, step, labels, compact = false, className }: ArrayStripProps) {
  const n = array.length;
  const pointers: { key: "low" | "mid" | "high"; index: number; label: string }[] = [];
  if (step.kind !== "not-found" || (step.low < n && step.low >= 0)) {
    if (step.low >= 0 && step.low < n) pointers.push({ key: "low", index: step.low, label: labels.low });
  }
  if (step.kind === "compare") pointers.push({ key: "mid", index: step.mid, label: labels.mid });
  if (step.high >= 0 && step.high < n) pointers.push({ key: "high", index: step.high, label: labels.high });

  // Stack labels that share a cell.
  const offsets = new Map<number, number>();
  const placed = pointers.map((pointer) => {
    const row = offsets.get(pointer.index) ?? 0;
    offsets.set(pointer.index, row + 1);
    return { ...pointer, row };
  });
  // The interactive view always reserves three label rows (low, mid and high can
  // share one cell), so the layout below never shifts while stepping.
  const rows = compact ? Math.max(1, ...offsets.values()) : 3;

  return (
    <div className={cn("w-full", className)}>
      <ol
        className={cn("grid gap-[3px] sm:gap-1.5", compact ? "gap-1" : "")}
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {array.map((value, index) => {
          const state = cellState(step, index);
          return (
            <li key={index} className="flex min-w-0 flex-col items-center gap-1.5" data-state={state}>
              <span
                className={cn(
                  "flex w-full items-center justify-center rounded-sm border font-mono tabular-nums transition-[background-color,border-color,color,box-shadow] duration-300",
                  compact ? "h-9 text-[0.75rem] sm:h-10 sm:text-[0.8125rem]" : "h-11 text-[0.8125rem] sm:h-14 sm:text-[1.0625rem]",
                  cellStyles[state],
                )}
              >
                {value}
              </span>
              {compact ? null : (
                <span className="font-mono text-[0.625rem] text-ink-3 tabular-nums" aria-hidden="true">
                  {index}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="relative mt-2" style={{ height: `${rows * 1.25 + 0.5}rem` }} aria-hidden="true">
        {placed.map((pointer) => (
          <span
            key={pointer.key}
            className={cn(
              "absolute flex -translate-x-1/2 flex-col items-center font-mono text-[0.6875rem] leading-none transition-[left] duration-500 ease-out-expo",
              pointer.key === "mid" ? "text-accent-glow" : "text-silver",
            )}
            style={{ left: `${((pointer.index + 0.5) / n) * 100}%`, top: `${pointer.row * 1.25}rem` } as CSSProperties}
          >
            {pointer.row === 0 ? <span className="text-[0.5rem]">▲</span> : null}
            {pointer.label}
          </span>
        ))}
      </div>
    </div>
  );
}
