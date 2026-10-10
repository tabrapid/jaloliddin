"use client";

import { useSyncExternalStore } from "react";

const colorTokens = [
  ["--canvas", "Page background"],
  ["--canvas-deep", "Deep panels, code, footer"],
  ["--raised", "Raised sections"],
  ["--surface", "Hover fills"],
  ["--surface-strong", "Badges, tooltips"],
  ["--ink", "Primary text (warm ivory)"],
  ["--ink-2", "Secondary text"],
  ["--ink-3", "Muted labels"],
  ["--silver", "Highlights"],
  ["--silver-dim", "Ornament, hairlines"],
  ["--accent", "Electric blue: actions"],
  ["--action", "Filled buttons (AA with ivory)"],
  ["--accent-ink", "Blue text on graphite"],
  ["--accent-glow", "Glow, focus, graphics"],
  ["--success", "Found / live"],
  ["--danger", "Errors"],
] as const;

const subscribe = () => () => {};

function useTokenValues(names: readonly string[]): string[] | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      const style = getComputedStyle(document.documentElement);
      return names.map((name) => style.getPropertyValue(name).trim()).join("|");
    },
    () => null,
  )?.split("|") ?? null;
}

/** Live colour tokens: swatches use the CSS variables, values are read at runtime. */
export function ColorTokens() {
  const values = useTokenValues(colorTokens.map(([name]) => name));
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {colorTokens.map(([name, role], index) => (
        <li key={name} className="overflow-hidden rounded-md border border-line">
          <div className="h-16" style={{ background: `var(${name})` }} />
          <div className="flex flex-col gap-0.5 p-3">
            <code className="font-mono text-[0.75rem] text-ink">{name}</code>
            <span className="text-[0.75rem] text-ink-3">{role}</span>
            <span className="font-mono text-[0.6875rem] text-ink-3">{values?.[index] ?? "…"}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
