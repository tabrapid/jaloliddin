import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { khatamPath } from "@/components/graphics/ornament";

export const OG_SIZE = { width: 1200, height: 630 };

// Literal values: satori renders without access to CSS variables.
const COLORS = { canvas: "#0c0d10", ink: "#f5f0e6", ink3: "#a8a296", accent: "#3d74ff", glow: "#9dbbff", line: "#2a2f38" };

async function loadFonts() {
  const dir = path.join(process.cwd(), "src", "assets", "og");
  const [bold, regular, mono] = await Promise.all([
    readFile(path.join(dir, "SchibstedGrotesk-ExtraBold.ttf")),
    readFile(path.join(dir, "SchibstedGrotesk-Regular.ttf")),
    readFile(path.join(dir, "RedHatMono-Medium.ttf")),
  ]);
  return [
    { name: "Schibsted", data: bold, weight: 800 as const, style: "normal" as const },
    { name: "Schibsted", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "RedHatMono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

export interface OgCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

/** Shared social card: mono eyebrow, oversized title, khatam + J mark. */
export async function renderOgCard({ eyebrow, title, subtitle, footer }: OgCardProps) {
  const rings = [260, 200, 140].map((r, i) => khatamPath(r, 300, 300, 0.72, (i * Math.PI) / 16));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    ${rings.map((d, i) => `<path d="${d}" fill="none" stroke="${i === 0 ? COLORS.glow : COLORS.accent}" stroke-opacity="${0.18 + i * 0.12}" stroke-width="1.5"/>`).join("")}
    <path d="M250 175h90v180a70 70 0 0 1-140 0" fill="none" stroke="${COLORS.ink}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M250 175h90v180a70 70 0 0 1-140 0" fill="none" stroke="${COLORS.glow}" stroke-opacity="0.45" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 0)"/>
  </svg>`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `radial-gradient(80% 90% at 85% 20%, #14244a 0%, ${COLORS.canvas} 60%)`,
          color: COLORS.ink,
          fontFamily: "Schibsted",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img */}
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
          width={560}
          height={560}
          alt=""
          style={{ position: "absolute", right: 10, top: 35 }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontFamily: "RedHatMono", fontSize: 22, letterSpacing: 3, color: COLORS.glow, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ fontSize: title.length > 18 ? 86 : 124, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>{title}</div>
            <div style={{ marginTop: 28, fontSize: 32, fontWeight: 400, lineHeight: 1.3, color: COLORS.ink3 }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", fontFamily: "RedHatMono", fontSize: 20, letterSpacing: 2, color: COLORS.ink3, borderTop: `1px solid ${COLORS.line}`, paddingTop: 22 }}>
            {footer}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
