"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

import { buildJGeometry, type JGeometry, type Vec3 } from "./j-geometry";

/**
 * WebGL version of the signature J (React Three Fiber + custom shaders).
 *
 * - Luminous rails and star ribs draw themselves along the stroke, while a
 *   cloud of particles converges onto the structure: ideas forming a system.
 * - Light pulses travel along the rails; a key light follows the pointer.
 * - Rendering stops entirely when the figure is offscreen or the tab is
 *   hidden, and renders on demand only while paused.
 *
 * Loaded lazily by SceneWrapper; never imported on the server.
 */

export type SceneQuality = "high" | "lite";

export interface HeroSceneProps {
  playing: boolean;
  active: boolean;
  quality: SceneQuality;
  onReady: () => void;
  onContextLost: () => void;
}

interface Palette {
  deep: [number, number, number];
  accent: [number, number, number];
  glow: [number, number, number];
  ink: [number, number, number];
  silver: [number, number, number];
}

function readColor(name: string, fallback: string): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const color = new THREE.Color();
  // Uniforms carry raw sRGB values: the custom shaders output them unchanged.
  color.setStyle(value, THREE.SRGBColorSpace);
  const srgb = color.clone().convertLinearToSRGB();
  return [srgb.r, srgb.g, srgb.b];
}

function readPalette(): Palette {
  return {
    deep: readColor("--accent-deep", "#0f1d3d"),
    accent: readColor("--accent", "#3d74ff"),
    glow: readColor("--accent-glow", "#9dbbff"),
    ink: readColor("--ink", "#f5f0e6"),
    silver: readColor("--silver", "#d3d8de"),
  };
}

/* ── Shaders ─────────────────────────────────────────────────────────────── */

/**
 * Rails are drawn as screen-space ribbons (a minimal "mesh line"): each point
 * is duplicated left/right of the stroke and pushed apart in the vertex
 * shader, so lines get a real pixel width and soft, glowing edges.
 */
const ribbonVertex = /* glsl */ `
  attribute vec3 aPrev;
  attribute vec3 aNext;
  attribute float aSide;
  attribute float aT;
  attribute float aRail;
  attribute vec3 aNormal;
  uniform vec2 uResolution;
  uniform float uWidth;
  uniform vec3 uLightDir;
  varying float vT;
  varying float vRail;
  varying float vLight;
  varying float vDepth;
  varying float vSide;
  void main() {
    vT = aT;
    vRail = aRail;
    vSide = aSide;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * aNormal);
    vLight = max(dot(n, normalize(uLightDir)), 0.0);
    vDepth = -mvPosition.z;

    vec4 current = projectionMatrix * mvPosition;
    vec4 previous = projectionMatrix * modelViewMatrix * vec4(aPrev, 1.0);
    vec4 next = projectionMatrix * modelViewMatrix * vec4(aNext, 1.0);
    float aspect = uResolution.x / uResolution.y;
    vec2 c = current.xy / current.w;
    vec2 p = previous.xy / previous.w;
    vec2 q = next.xy / next.w;
    c.x *= aspect;
    p.x *= aspect;
    q.x *= aspect;
    vec2 direction = q - p;
    direction = length(direction) > 1e-6 ? normalize(direction) : vec2(1.0, 0.0);
    vec2 offset = vec2(-direction.y, direction.x);
    offset.x /= aspect;
    float width = uWidth * (0.6 + 0.8 * vLight);
    current.xy += offset * aSide * (width / uResolution.y) * current.w;
    gl_Position = current;
  }
`;

const ribbonFragment = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntensity;
  uniform float uPulse;
  uniform float uHalo;
  uniform vec3 uDeep;
  uniform vec3 uAccent;
  uniform vec3 uGlow;
  uniform vec3 uInk;
  varying float vT;
  varying float vRail;
  varying float vLight;
  varying float vDepth;
  varying float vSide;
  void main() {
    float edge = 1.0 - abs(vSide);
    float profile = mix(smoothstep(0.0, 0.7, edge), edge * edge * edge, uHalo);
    float reveal = smoothstep(vT, vT + 0.06, uProgress * 1.08);
    float fog = smoothstep(14.5, 8.5, vDepth);
    float light = 0.42 + 0.58 * vLight;
    float p = fract(vT * 1.6 - uTime * 0.06 + vRail * 0.618);
    float pulse = smoothstep(0.0, 0.012, p) * (1.0 - smoothstep(0.012, 0.09, p)) * uPulse;
    vec3 color = mix(uDeep, uAccent, smoothstep(0.0, 0.55, light));
    color = mix(color, uGlow, smoothstep(0.5, 1.0, light));
    color = mix(color, uInk, pow(vLight, 6.0) * 0.6 + pulse * 0.8);
    float alpha = (0.28 + 0.72 * light + pulse * 1.2) * profile * fog * reveal * uIntensity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const pointVertex = /* glsl */ `
  attribute vec3 aStart;
  attribute float aDelay;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  varying float vAlpha;
  varying float vCore;
  void main() {
    float k = clamp((uProgress * 1.35 - aDelay) / 0.65, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vec3 pos = mix(aStart, position, k);
    pos += (1.0 - k * 0.8) * 0.02 * vec3(
      sin(uTime * 0.7 + aSeed * 12.0),
      cos(uTime * 0.6 + aSeed * 7.0),
      sin(uTime * 0.5 + aSeed * 3.0)
    );
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * uPixelRatio * uSizeScale * (15.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    float fog = smoothstep(15.0, 7.5, -mv.z);
    float twinkle = 0.7 + 0.3 * sin(uTime * 1.4 + aSeed * 40.0);
    vAlpha = fog * twinkle * (0.25 + 0.75 * k);
    vCore = k;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uInk;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vCore;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float halo = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.16, 0.0, d);
    vec3 color = mix(uAccent, uInk, core * (0.4 + 0.6 * vCore));
    float alpha = (halo * 0.6 + core) * vAlpha * uIntensity * 1.15;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

/* ── Geometry builders ──────────────────────────────────────────────────── */

interface Strip {
  points: Vec3[];
  normals: Vec3[];
  /** Arc parameter per point (or one value for the whole strip). */
  t: number[] | number;
  rail: number;
  closed: boolean;
}

/** Packs polylines into one indexed ribbon geometry (two vertices per point). */
function ribbonGeometry(strips: Strip[]): THREE.BufferGeometry {
  const positions: number[] = [];
  const previous: number[] = [];
  const next: number[] = [];
  const sides: number[] = [];
  const params: number[] = [];
  const railIds: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (const strip of strips) {
    const pts = strip.closed ? [...strip.points, strip.points[0]!] : strip.points;
    const nrm = strip.closed ? [...strip.normals, strip.normals[0]!] : strip.normals;
    const count = pts.length;
    const base = positions.length / 3;
    for (let i = 0; i < count; i++) {
      const p = pts[i]!;
      const before = strip.closed && i === 0 ? pts[count - 2]! : pts[Math.max(0, i - 1)]!;
      const after = strip.closed && i === count - 1 ? pts[1]! : pts[Math.min(count - 1, i + 1)]!;
      const n = nrm[i]!;
      const t = typeof strip.t === "number" ? strip.t : strip.t[i]!;
      for (const side of [-1, 1]) {
        positions.push(p.x, p.y, p.z);
        previous.push(before.x, before.y, before.z);
        next.push(after.x, after.y, after.z);
        normals.push(n.x, n.y, n.z);
        sides.push(side);
        params.push(t);
        railIds.push(strip.rail);
      }
    }
    for (let i = 0; i < count - 1; i++) {
      const a = base + i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const buffer = new THREE.BufferGeometry();
  buffer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  buffer.setAttribute("aPrev", new THREE.Float32BufferAttribute(previous, 3));
  buffer.setAttribute("aNext", new THREE.Float32BufferAttribute(next, 3));
  buffer.setAttribute("aNormal", new THREE.Float32BufferAttribute(normals, 3));
  buffer.setAttribute("aSide", new THREE.Float32BufferAttribute(sides, 1));
  buffer.setAttribute("aT", new THREE.Float32BufferAttribute(params, 1));
  buffer.setAttribute("aRail", new THREE.Float32BufferAttribute(railIds, 1));
  buffer.setIndex(indices);
  return buffer;
}

function railStrips(geometry: JGeometry): Strip[] {
  const count = geometry.rails.length;
  return geometry.rails.map((points, r) => ({
    points,
    normals: geometry.railNormals[r]!,
    t: geometry.t,
    rail: r / Math.max(1, count - 1),
    closed: false,
  }));
}

function ribStrips(geometry: JGeometry): Strip[] {
  return geometry.ribs.map((rib, r) => ({
    points: rib.points,
    normals: rib.normals,
    t: rib.t,
    rail: (r * 0.37) % 1,
    closed: true,
  }));
}

/** Deterministic pseudo-random numbers so every visit forms the same sculpture. */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function particleGeometry(geometry: JGeometry, extra: number, dust: number): THREE.BufferGeometry {
  const rand = random(7);
  const targets: number[] = [];
  const starts: number[] = [];
  const delays: number[] = [];
  const sizes: number[] = [];
  const seeds: number[] = [];

  const push = (x: number, y: number, z: number, t: number, size: number, scatter: number) => {
    targets.push(x, y, z);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const radius = scatter * (0.6 + rand() * 0.6);
    starts.push(
      x * 0.3 + Math.sin(phi) * Math.cos(theta) * radius,
      y * 0.3 + Math.cos(phi) * radius * 0.8,
      z + Math.sin(phi) * Math.sin(theta) * radius * 0.6,
    );
    delays.push(Math.min(0.6, t * 0.5 + rand() * 0.12));
    sizes.push(size);
    seeds.push(rand());
  };

  // Nodes at every rib vertex: the visible joints of the system.
  for (const rib of geometry.ribs) {
    rib.points.forEach((p, k) => push(p.x, p.y, p.z, rib.t, k % 2 === 0 ? 2.6 : 1.7, 4.5));
  }
  // Particles scattered along the rails.
  for (let i = 0; i < extra; i++) {
    const rail = geometry.rails[Math.floor(rand() * geometry.rails.length)]!;
    const index = Math.floor(rand() * rail.length);
    const p = rail[index]!;
    push(p.x, p.y, p.z, geometry.t[index]!, 0.9 + rand() * 1.1, 5);
  }
  // Ambient dust that never converges (start = target, far from the letter).
  for (let i = 0; i < dust; i++) {
    const x = (rand() - 0.5) * 9;
    const y = (rand() - 0.5) * 7;
    const z = -1.5 - rand() * 4;
    targets.push(x, y, z);
    starts.push(x, y, z);
    delays.push(0);
    sizes.push(0.6 + rand() * 0.9);
    seeds.push(rand());
  }

  const buffer = new THREE.BufferGeometry();
  buffer.setAttribute("position", new THREE.Float32BufferAttribute(targets, 3));
  buffer.setAttribute("aStart", new THREE.Float32BufferAttribute(starts, 3));
  buffer.setAttribute("aDelay", new THREE.Float32BufferAttribute(delays, 1));
  buffer.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  buffer.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return buffer;
}

/* ── Scene ──────────────────────────────────────────────────────────────── */

const BASE_YAW = -0.46;
const BASE_PITCH = 0.12;
const ASSEMBLY_SECONDS = 2.6;
const WIDTHS = { core: 2.2, halo: 11, rib: 1.1 };

/**
 * Owns every GPU resource and all per-frame mutation, keeping imperative
 * Three.js state outside React's render model. React only mounts `group`.
 */
class SculptureResources {
  readonly group = new THREE.Group();
  private readonly shared;
  private readonly resolution = new THREE.Vector2(1, 1);
  private readonly materials: { rails: THREE.ShaderMaterial; halo: THREE.ShaderMaterial; ribs: THREE.ShaderMaterial; points: THREE.ShaderMaterial };
  private readonly geometries: THREE.BufferGeometry[];
  private time = 0;
  private progress: number;
  private readySent = false;
  private readonly pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  constructor(quality: SceneQuality, palette: Palette, startAssembled: boolean) {
    const lite = quality === "lite";
    const geometry = buildJGeometry({ samples: lite ? 140 : 210, ribs: lite ? 18 : 26, innerRails: !lite });
    this.progress = startAssembled ? 1 : 0;
    this.shared = {
      uTime: { value: 0 },
      uProgress: { value: this.progress },
      uLightDir: { value: new THREE.Vector3(-0.55, 0.65, 0.55) },
      uDeep: { value: new THREE.Vector3(...palette.deep) },
      uAccent: { value: new THREE.Vector3(...palette.accent) },
      uGlow: { value: new THREE.Vector3(...palette.glow) },
      uInk: { value: new THREE.Vector3(...palette.ink) },
    };
    const ribbon = (width: number, intensity: number, pulse: number, halo: number) =>
      new THREE.ShaderMaterial({
        vertexShader: ribbonVertex,
        fragmentShader: ribbonFragment,
        uniforms: {
          ...this.shared,
          uResolution: { value: this.resolution },
          uWidth: { value: width },
          uIntensity: { value: intensity },
          uPulse: { value: pulse },
          uHalo: { value: halo },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
    this.materials = {
      rails: ribbon(WIDTHS.core, 1, 1, 0),
      halo: ribbon(WIDTHS.halo, 0.34, 0.6, 1),
      ribs: ribbon(WIDTHS.rib, 0.7, 0, 0),
      points: new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms: { ...this.shared, uPixelRatio: { value: 1 }, uSizeScale: { value: 1 }, uIntensity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    };

    const rails = ribbonGeometry(railStrips(geometry));
    const ribs = ribbonGeometry(ribStrips(geometry));
    const points = particleGeometry(geometry, lite ? 260 : 620, lite ? 160 : 380);
    this.geometries = [rails, ribs, points];

    const meshes: THREE.Object3D[] = [
      new THREE.Mesh(ribs, this.materials.ribs),
      new THREE.Mesh(rails, this.materials.halo),
      new THREE.Mesh(rails, this.materials.rails),
      new THREE.Points(points, this.materials.points),
    ];
    for (const mesh of meshes) {
      mesh.frustumCulled = false;
      this.group.add(mesh);
    }
    this.group.rotation.set(BASE_PITCH, BASE_YAW, 0);
  }

  setPointerTarget(x: number, y: number) {
    this.pointer.tx = x;
    this.pointer.ty = y;
  }

  /** Fits the camera to the canvas and converts pixel widths for the DPR. */
  resize(camera: THREE.Camera, renderer: THREE.WebGLRenderer, width: number, height: number) {
    const aspect = width / Math.max(1, height);
    camera.position.z = aspect < 0.62 ? 10 * (0.62 / aspect) : 10;
    if (camera instanceof THREE.PerspectiveCamera) camera.updateProjectionMatrix();
    const dpr = renderer.getPixelRatio();
    renderer.getDrawingBufferSize(this.resolution);
    this.materials.rails.uniforms.uWidth!.value = WIDTHS.core * dpr;
    this.materials.halo.uniforms.uWidth!.value = WIDTHS.halo * dpr;
    this.materials.ribs.uniforms.uWidth!.value = WIDTHS.rib * dpr;
    this.materials.points.uniforms.uPixelRatio!.value = dpr;
    this.materials.points.uniforms.uSizeScale!.value = Math.min(1.4, height / 760);
  }

  /** Advances one frame. Returns true the first time a frame is produced. */
  frame(delta: number, playing: boolean): boolean {
    const dt = Math.min(delta, 1 / 12);
    if (playing) {
      this.time += dt;
      this.progress = Math.min(1, this.progress + dt / ASSEMBLY_SECONDS);
    }
    const eased = this.progress < 1 ? 1 - Math.pow(1 - this.progress, 2.2) : 1;
    const p = this.pointer;
    const follow = playing ? 1 - Math.exp(-dt * 3) : 1;
    p.x += (p.tx - p.x) * follow;
    p.y += (p.ty - p.y) * follow;

    this.shared.uTime.value = this.time;
    this.shared.uProgress.value = eased;
    this.shared.uLightDir.value.set(-0.55 + p.x * 0.7, 0.65 - p.y * 0.5, 0.55).normalize();
    const sway = Math.sin(this.time * 0.18) * 0.05;
    this.group.rotation.y = BASE_YAW + sway + p.x * 0.16;
    this.group.rotation.x = BASE_PITCH + p.y * 0.08;

    const first = !this.readySent;
    this.readySent = true;
    return first;
  }

  dispose() {
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of Object.values(this.materials)) material.dispose();
  }
}

function Sculpture({ playing, quality, onReady }: Pick<HeroSceneProps, "playing" | "quality" | "onReady">) {
  // Created once per mount; the parent remounts on quality change (key).
  const [resources] = useState(() => new SculptureResources(quality, readPalette(), !playing));
  const { size, camera, gl } = useThree();

  useEffect(() => () => resources.dispose(), [resources]);

  // Pointer response only for fine pointers (mouse, trackpad, pen).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const handleMove = (event: PointerEvent) => {
      resources.setPointerTarget((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [resources]);

  useEffect(() => {
    resources.resize(camera, gl, size.width, size.height);
  }, [resources, camera, gl, size.width, size.height]);

  useFrame((_, delta) => {
    if (resources.frame(delta, playing)) requestAnimationFrame(onReady);
  });

  return <primitive object={resources.group} />;
}

export default function HeroScene({ playing, active, quality, onReady, onContextLost }: HeroSceneProps) {
  const lost = useRef(onContextLost);
  // React tears down the canvas (and R3F forces a context loss) after this
  // parent's layout cleanup, so the flag tells teardown apart from a real loss.
  const mounted = useRef(false);
  useEffect(() => {
    lost.current = onContextLost;
  }, [onContextLost]);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      frameloop={!active ? "never" : playing ? "always" : "demand"}
      dpr={[1, quality === "lite" ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 40 }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          if (!mounted.current) return;
          event.preventDefault();
          lost.current();
        });
      }}
    >
      <Sculpture key={quality} playing={playing} quality={quality} onReady={onReady} />
    </Canvas>
  );
}
