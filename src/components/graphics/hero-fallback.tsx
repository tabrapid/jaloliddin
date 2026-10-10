import { cn } from "@/lib/cn";

import { buildJGeometry, projectPoint, type ProjectionView, type Vec3 } from "./j-geometry";

/**
 * Static SVG rendition of the signature J, generated on the server from the
 * same geometry as the WebGL scene. It is the first paint, the reduced-motion
 * version and the fallback when WebGL is unavailable or its context is lost.
 *
 * Only subtle CSS light pulses move (class `hero-pulse`), and only when the
 * visitor allows motion.
 */

const WIDTH = 600;
const HEIGHT = 720;
const VIEW: ProjectionView = { yaw: -0.46, pitch: 0.12, distance: 9, scale: 136, cx: WIDTH / 2, cy: HEIGHT / 2 + 6 };
/** Key light from the upper left, towards the viewer. */
const LIGHT = normalise({ x: -0.55, y: 0.65, z: 0.55 });
const CHUNKS = 6;

function normalise(v: Vec3): Vec3 {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function pathFrom(points: { x: number; y: number }[], close = false): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${r1(p.x)} ${r1(p.y)}`).join("") + (close ? "Z" : "");
}

/** Rotates a normal with the same yaw/pitch as the projection (for lighting). */
function rotateNormal(n: Vec3): Vec3 {
  const cosY = Math.cos(VIEW.yaw);
  const sinY = Math.sin(VIEW.yaw);
  const x1 = n.x * cosY + n.z * sinY;
  const z1 = -n.x * sinY + n.z * cosY;
  const cosX = Math.cos(VIEW.pitch);
  const sinX = Math.sin(VIEW.pitch);
  return { x: x1, y: n.y * cosX - z1 * sinX, z: n.y * sinX + z1 * cosX };
}

const lambert = (n: Vec3) => {
  const r = rotateNormal(n);
  return Math.max(0, r.x * LIGHT.x + r.y * LIGHT.y + r.z * LIGHT.z);
};

interface Stroke {
  d: string;
  depth: number;
  light: number;
}

function buildScene() {
  const geometry = buildJGeometry({ samples: 96, ribs: 22, innerRails: true });
  const depthRange = { min: Infinity, max: -Infinity };

  const strokes: Stroke[] = [];
  const pulses: string[] = [];

  geometry.rails.forEach((rail, railIndex) => {
    const projected = rail.map((p) => projectPoint(p, VIEW));
    const normals = geometry.railNormals[railIndex]!;
    const chunk = Math.ceil(projected.length / CHUNKS);
    for (let c = 0; c < CHUNKS; c++) {
      const slice = projected.slice(c * chunk, Math.min(projected.length, (c + 1) * chunk + 1));
      if (slice.length < 2) continue;
      const sliceNormals = normals.slice(c * chunk, (c + 1) * chunk + 1);
      const depth = slice.reduce((sum, p) => sum + p.depth, 0) / slice.length;
      const light = sliceNormals.reduce((sum, n) => sum + lambert(n), 0) / sliceNormals.length;
      depthRange.min = Math.min(depthRange.min, depth);
      depthRange.max = Math.max(depthRange.max, depth);
      strokes.push({ d: pathFrom(slice), depth, light });
    }
    // Outer rails facing the light carry the travelling pulses.
    if (railIndex % 2 === 0 && railIndex % 4 === 0) pulses.push(pathFrom(projected));
  });

  strokes.sort((a, b) => a.depth - b.depth);

  const ribs = geometry.ribs.map((rib) => {
    const projected = rib.points.map((p) => projectPoint(p, VIEW));
    const depth = projected.reduce((sum, p) => sum + p.depth, 0) / projected.length;
    return { d: pathFrom(projected, true), depth, nodes: projected.filter((_, k) => k % 2 === 0) };
  });

  const span = depthRange.max - depthRange.min || 1;
  const near = (depth: number) => Math.min(1, Math.max(0, (depth - depthRange.min) / span));

  return { strokes, ribs, pulses, near };
}

const scene = buildScene();

export interface HeroFallbackProps {
  className?: string;
}

export function HeroFallback({ className }: HeroFallbackProps) {
  const { strokes, ribs, pulses, near } = scene;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn("h-full w-full overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="hero-j-stroke" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="var(--silver)" />
          <stop offset="0.45" stopColor="var(--accent-glow)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
        <radialGradient id="hero-j-halo" cx="0.5" cy="0.46" r="0.5">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="var(--accent)" stopOpacity="0.06" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="hero-j-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <ellipse cx={WIDTH / 2} cy={HEIGHT / 2} rx={WIDTH * 0.48} ry={HEIGHT * 0.44} fill="url(#hero-j-halo)" />

      {/* Soft glow underlay: the brightest strokes, blurred once. */}
      <g filter="url(#hero-j-glow)" opacity="0.55" stroke="var(--accent)" strokeWidth="3" fill="none">
        {strokes
          .filter((s) => s.light > 0.55)
          .map((s, i) => (
            <path key={i} d={s.d} />
          ))}
      </g>

      {/* Star ribs: the structural "system" around the stroke. */}
      <g fill="none" stroke="var(--silver-dim)" strokeWidth="0.75" strokeLinejoin="round">
        {ribs.map((rib, i) => (
          <path key={i} d={rib.d} strokeOpacity={0.1 + near(rib.depth) * 0.28} />
        ))}
      </g>

      {/* Rails, back to front, lit by a key light from the upper left. */}
      <g fill="none" stroke="url(#hero-j-stroke)" strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((s, i) => (
          <path
            key={i}
            d={s.d}
            strokeWidth={0.7 + s.light * 0.9 + near(s.depth) * 0.5}
            strokeOpacity={0.16 + s.light * 0.6 + near(s.depth) * 0.22}
          />
        ))}
      </g>

      {/* Nodes where ribs meet rails. */}
      <g fill="var(--ink)">
        {ribs.flatMap((rib, i) =>
          rib.nodes.map((node, k) => (
            <circle
              key={`${i}-${k}`}
              cx={r1(node.x)}
              cy={r1(node.y)}
              r={r1(0.9 + near(node.depth) * 1.3)}
              fillOpacity={0.25 + near(node.depth) * 0.6}
            />
          )),
        )}
      </g>

      {/* Travelling light pulses (CSS, motion-safe only). */}
      <g fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round">
        {pulses.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1000}
            className="hero-pulse motion-decor"
            style={{ animationDelay: `${-i * 2.3}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
