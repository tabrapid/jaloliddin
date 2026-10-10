import { cn } from "@/lib/cn";

/**
 * Restrained geometric ornament inspired by Uzbek girih and khatam patterns.
 * Everything is generated from simple polygon math — no traced artwork.
 */

const round = (value: number) => Math.round(value * 10) / 10;

/** Points of a regular star polygon {n/step} as an SVG path. */
function starPolygon(n: number, step: number, radius: number, rotation = 0, cx = 0, cy = 0): string {
  const visited = new Set<number>();
  let d = "";
  for (let start = 0; start < n; start++) {
    if (visited.has(start)) continue;
    let index = start;
    let first = true;
    do {
      visited.add(index);
      const angle = rotation + (index / n) * Math.PI * 2 - Math.PI / 2;
      const x = round(cx + Math.cos(angle) * radius);
      const y = round(cy + Math.sin(angle) * radius);
      d += `${first ? "M" : "L"}${x} ${y}`;
      first = false;
      index = (index + step) % n;
    } while (index !== start);
    d += "Z";
  }
  return d;
}

/** Eight-pointed star outline (khatam) with alternating outer/inner radii. */
export function khatamPath(radius: number, cx = 0, cy = 0, inner = 0.72, rotation = 0): string {
  let d = "";
  for (let k = 0; k < 16; k++) {
    const angle = rotation + (k * Math.PI) / 8 - Math.PI / 2;
    const r = k % 2 === 0 ? radius : radius * inner;
    d += `${k === 0 ? "M" : "L"}${round(cx + Math.cos(angle) * r)} ${round(cy + Math.sin(angle) * r)}`;
  }
  return `${d}Z`;
}

export interface RosetteProps {
  className?: string;
  /** Spin slowly when motion is allowed (paused by the hero toggle). */
  animated?: boolean;
}

/** A concentric girih rosette used as a quiet backdrop behind the hero J. */
export function Rosette({ className, animated = false }: RosetteProps) {
  const R = 300;
  const spokes = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `M${round(Math.cos(a) * R * 0.62)} ${round(Math.sin(a) * R * 0.62)}L${round(Math.cos(a) * R * 1.02)} ${round(Math.sin(a) * R * 1.02)}`;
  }).join("");

  return (
    <svg viewBox="-330 -330 660 660" aria-hidden="true" focusable="false" className={cn("overflow-visible", className)}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        className={cn(animated && "rosette-spin motion-decor")}
        style={{ transformOrigin: "0 0" }}
      >
        <circle r={R * 1.08} strokeOpacity="0.35" strokeDasharray="2 10" />
        <path d={starPolygon(16, 6, R)} strokeOpacity="0.5" />
        <path d={starPolygon(8, 3, R * 0.8)} strokeOpacity="0.8" />
        <path d={spokes} strokeOpacity="0.35" />
        <path d={starPolygon(8, 2, R * 0.56, Math.PI / 8)} strokeOpacity="0.9" />
        <path d={khatamPath(R * 0.3, 0, 0, 0.7)} strokeOpacity="0.6" />
        <circle r={R * 0.62} strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

/** Small khatam glyph for marks, list bullets and dividers. */
export function StarMark({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" aria-hidden="true" focusable="false" className={className}>
      <path d={khatamPath(9.2, 0, 0, 0.7)} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

/** Tileable 8-point-star-and-cross field (khatam tessellation). */
export function GirihField({ className, id = "girih-field" }: { className?: string; id?: string }) {
  const size = 72;
  const c = size / 2;
  return (
    <svg aria-hidden="true" focusable="false" className={cn("h-full w-full", className)}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path d={khatamPath(c * 0.86, c, c, 0.74, Math.PI / 8)} fill="none" stroke="currentColor" strokeWidth="1" />
          <path
            d={`M0 ${c}L${c * 0.25} ${c}M${size} ${c}L${size - c * 0.25} ${c}M${c} 0L${c} ${c * 0.25}M${c} ${size}L${c} ${size - c * 0.25}`}
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
