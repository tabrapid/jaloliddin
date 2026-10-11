import localFont from "next/font/local";

/**
 * Two families only:
 * - Schibsted Grotesk: display + reading text (variable 400–900).
 * - Red Hat Mono: technical labels, metadata, code (variable 300–700).
 *
 * Both are self-hosted (SIL OFL 1.1, see ./fonts/OFL-*.txt) and include the
 * Uzbek Latin modifier letters ʻ (U+02BB) and ʼ (U+02BC). The Schibsted files
 * are patched so ʻ uses the narrow quoteleft glyph (see ./fonts/README.md).
 */
export const schibsted = localFont({
  src: [
    { path: "./fonts/SchibstedGrotesk-latin-wght.woff2", weight: "400 900", style: "normal" },
  ],
  variable: "--font-schibsted",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const schibstedItalic = localFont({
  src: [
    { path: "./fonts/SchibstedGrotesk-latin-wght-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-schibsted-italic",
  display: "swap",
  preload: false,
});

export const redHatMono = localFont({
  src: [{ path: "./fonts/RedHatMono-latin-wght.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-redhat-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const fontVariables = [schibsted.variable, schibstedItalic.variable, redHatMono.variable].join(" ");
