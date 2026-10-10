/**
 * Motion tokens for JavaScript-driven animation (Motion library).
 * Mirrors the CSS custom properties in src/styles/globals.css.
 */
export const easing = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutSoft: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.16,
  base: 0.28,
  slow: 0.56,
  entrance: 0.9,
};

export const spring = {
  /** Small UI responses: hover lifts, toggles. */
  gentle: { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 },
  /** Layout movement, e.g. pointers in the Lab. */
  snappy: { type: "spring" as const, stiffness: 420, damping: 36 },
};
