/**
 * Procedural geometry for the signature "J" sculpture.
 *
 * The letter is a single continuous centreline (top serif → stem → hook →
 * tail) swept with an eight-pointed-star cross-section, the khatam motif of
 * Uzbek and wider Islamic geometric ornament. The star twists by exactly one
 * symmetry step (π/4) along the stroke, so its rails spiral gently and land
 * back on the same silhouette.
 *
 * Pure math, no rendering dependencies. It is shared by the server-rendered
 * SVG fallback and the WebGL scene, so both draw the same object.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface JGeometryOptions {
  /** Samples along the stroke. */
  samples?: number;
  /** Number of star-shaped ribs along the stroke. */
  ribs?: number;
  /** Include the 8 inner star vertices as rails (16 rails instead of 8). */
  innerRails?: boolean;
}

export interface JGeometry {
  /** Normalised arc-length parameter for each sample (0 → 1). */
  t: number[];
  centerline: Vec3[];
  /** rails[railIndex][sampleIndex] */
  rails: Vec3[][];
  /** Unit offset direction of each rail point from the centreline (for lighting). */
  railNormals: Vec3[][];
  /** Closed star polygons; each entry has 16 vertices. */
  ribs: { t: number; points: Vec3[]; normals: Vec3[] }[];
  bounds: { min: Vec3; max: Vec3 };
}

export const STAR_POINTS = 8;
const INNER_RATIO = 0.6;
const TWIST = Math.PI / 4;

const vec = (x: number, y: number, z = 0): Vec3 => ({ x, y, z });
const sub = (a: Vec3, b: Vec3): Vec3 => vec(a.x - b.x, a.y - b.y, a.z - b.z);
const length = (a: Vec3) => Math.hypot(a.x, a.y, a.z);
const normalize = (a: Vec3): Vec3 => {
  const l = length(a) || 1;
  return vec(a.x / l, a.y / l, a.z / l);
};
const cross = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return k * k * (3 - 2 * k);
};

/** Dense 2D outline of the J's centreline, in scene units. */
function buildPath(): Vec3[] {
  const points: Vec3[] = [];
  const line = (x0: number, y0: number, x1: number, y1: number, steps: number) => {
    for (let i = 0; i < steps; i++) {
      const k = i / steps;
      points.push(vec(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k));
    }
  };
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number, steps: number) => {
    for (let i = 0; i < steps; i++) {
      const a = a0 + (a1 - a0) * (i / steps);
      points.push(vec(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  };

  const barY = 2.1;
  const barLeft = -0.82;
  const stemX = 0.66;
  const corner = 0.36;
  const hookR = 0.92;
  const hookCx = stemX - hookR;
  const hookCy = -0.7;

  line(barLeft, barY, stemX - corner, barY, 40);
  arc(stemX - corner, barY - corner, corner, Math.PI / 2, 0, 30);
  line(stemX, barY - corner, stemX, hookCy, 120);
  arc(hookCx, hookCy, hookR, 0, -Math.PI, 140);
  // Tail: a short rising flick that curls slightly inward.
  arc(hookCx - hookR + 0.28, hookCy, 0.28, Math.PI, Math.PI * 0.72, 24);
  points.push(vec(hookCx - hookR + 0.28 + Math.cos(Math.PI * 0.72) * 0.28, hookCy + Math.sin(Math.PI * 0.72) * 0.28));
  return points;
}

/** Resamples a polyline to `count` points evenly spaced by arc length. */
function resample(points: Vec3[], count: number): { points: Vec3[]; t: number[] } {
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push(cumulative[i - 1]! + length(sub(points[i]!, points[i - 1]!)));
  }
  const total = cumulative[cumulative.length - 1]!;
  const out: Vec3[] = [];
  const ts: number[] = [];
  let segment = 1;
  for (let i = 0; i < count; i++) {
    const target = (i / (count - 1)) * total;
    while (segment < points.length - 1 && cumulative[segment]! < target) segment++;
    const a = points[segment - 1]!;
    const b = points[segment]!;
    const span = cumulative[segment]! - cumulative[segment - 1]! || 1;
    const k = Math.min(1, Math.max(0, (target - cumulative[segment - 1]!) / span));
    out.push(vec(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 0));
    ts.push(i / (count - 1));
  }
  return { points: out, t: ts };
}

/** Calligraphic stroke contrast: light serif, heavy stem, tapering tail. */
export function strokeRadius(t: number): number {
  const keys: [number, number][] = [
    [0, 0.13],
    [0.1, 0.19],
    [0.2, 0.25],
    [0.34, 0.35],
    [0.56, 0.36],
    [0.74, 0.3],
    [0.9, 0.19],
    [1, 0.1],
  ];
  for (let i = 1; i < keys.length; i++) {
    const [t1, r1] = keys[i]!;
    const [t0, r0] = keys[i - 1]!;
    if (t <= t1) return r0 + (r1 - r0) * smoothstep(t0, t1, t);
  }
  return keys[keys.length - 1]![1];
}

/** Gentle depth so the letter reads as a sculpture when rotated. */
function depthAt(t: number): number {
  return 0.55 * Math.sin(t * Math.PI * 1.25 - 0.85) - 0.1 * smoothstep(0.85, 1, t);
}

/** Vertex k (0–15) of the star cross-section: even = outer point, odd = inner. */
function starOffset(k: number, radius: number, twist: number): { u: number; v: number } {
  const angle = (k * Math.PI) / STAR_POINTS + twist;
  const r = k % 2 === 0 ? radius : radius * INNER_RATIO;
  return { u: Math.cos(angle) * r, v: Math.sin(angle) * r };
}

export function buildJGeometry({ samples = 180, ribs = 24, innerRails = true }: JGeometryOptions = {}): JGeometry {
  const { points: flat, t } = resample(buildPath(), samples);
  const centerline = flat.map((p, i) => vec(p.x, p.y, depthAt(t[i]!)));

  // Centre the letter on the origin.
  const min = vec(Infinity, Infinity, Infinity);
  const max = vec(-Infinity, -Infinity, -Infinity);
  for (const p of centerline) {
    min.x = Math.min(min.x, p.x);
    min.y = Math.min(min.y, p.y);
    max.x = Math.max(max.x, p.x);
    max.y = Math.max(max.y, p.y);
  }
  const offsetX = (min.x + max.x) / 2;
  const offsetY = (min.y + max.y) / 2;
  for (const p of centerline) {
    p.x -= offsetX;
    p.y -= offsetY;
  }

  // Frames: N lies in the letter's plane, B points (mostly) towards the viewer.
  const frames = centerline.map((p, i) => {
    const prev = centerline[Math.max(0, i - 1)]!;
    const next = centerline[Math.min(centerline.length - 1, i + 1)]!;
    const tangent = normalize(sub(next, prev));
    const normal = normalize(cross(tangent, vec(0, 0, 1)));
    const binormal = normalize(cross(normal, tangent));
    return { normal, binormal };
  });

  const ringAt = (i: number) => {
    const { normal, binormal } = frames[i]!;
    const c = centerline[i]!;
    const radius = strokeRadius(t[i]!);
    const twist = TWIST * t[i]!;
    const points: Vec3[] = [];
    const normals: Vec3[] = [];
    for (let k = 0; k < STAR_POINTS * 2; k++) {
      const { u, v } = starOffset(k, radius, twist);
      const offset = vec(normal.x * u + binormal.x * v, normal.y * u + binormal.y * v, normal.z * u + binormal.z * v);
      points.push(vec(c.x + offset.x, c.y + offset.y, c.z + offset.z));
      normals.push(normalize(offset));
    }
    return { points, normals };
  };

  const rings = centerline.map((_, i) => ringAt(i));
  const railIndices = Array.from({ length: STAR_POINTS * 2 }, (_, k) => k).filter((k) => innerRails || k % 2 === 0);
  const rails = railIndices.map((k) => rings.map((ring) => ring.points[k]!));
  const railNormals = railIndices.map((k) => rings.map((ring) => ring.normals[k]!));

  const ribList: JGeometry["ribs"] = [];
  for (let r = 0; r < ribs; r++) {
    const i = Math.round((r / (ribs - 1)) * (samples - 1));
    ribList.push({ t: t[i]!, ...rings[i]! });
  }

  const bounds = { min: vec(Infinity, Infinity, Infinity), max: vec(-Infinity, -Infinity, -Infinity) };
  for (const rail of rails) {
    for (const p of rail) {
      bounds.min.x = Math.min(bounds.min.x, p.x);
      bounds.min.y = Math.min(bounds.min.y, p.y);
      bounds.min.z = Math.min(bounds.min.z, p.z);
      bounds.max.x = Math.max(bounds.max.x, p.x);
      bounds.max.y = Math.max(bounds.max.y, p.y);
      bounds.max.z = Math.max(bounds.max.z, p.z);
    }
  }

  return { t, centerline, rails, railNormals, ribs: ribList, bounds };
}

export interface ProjectionView {
  yaw: number;
  pitch: number;
  /** Camera distance in scene units (perspective strength). */
  distance: number;
  scale: number;
  cx: number;
  cy: number;
}

/** Rotates (yaw, then pitch) and perspective-projects a point to 2D. */
export function projectPoint(p: Vec3, view: ProjectionView): { x: number; y: number; depth: number } {
  const cosY = Math.cos(view.yaw);
  const sinY = Math.sin(view.yaw);
  const x1 = p.x * cosY + p.z * sinY;
  const z1 = -p.x * sinY + p.z * cosY;
  const cosX = Math.cos(view.pitch);
  const sinX = Math.sin(view.pitch);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;
  const perspective = view.distance / (view.distance - z2);
  return { x: view.cx + x1 * view.scale * perspective, y: view.cy - y2 * view.scale * perspective, depth: z2 };
}
