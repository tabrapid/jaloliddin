import { ImageResponse } from "next/og";

import { khatamPath } from "@/components/graphics/ornament";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <path d="${khatamPath(74, 90, 90, 0.72)}" fill="none" stroke="#3d74ff" stroke-width="6" stroke-linejoin="round"/>
    <path d="M74 60h30v44a19 19 0 0 1-38 0" fill="none" stroke="#f5f0e6" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0c0d10" }}>
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
