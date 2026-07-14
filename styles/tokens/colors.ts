/**
 * Color tokens — single source of truth (Design System §06).
 * Mirrors tailwind.config.ts theme.extend.colors exactly; do not hand-roll
 * hex values in components, import from here (ai/rules/coding.md #2).
 *
 * Purple rule (Design System §06): 95% of particles/surfaces are white/
 * silver/gray. Purple is capped at ~5% visual weight — reserved for
 * signals, CTA, active/hover states, and the Earth network. Never use
 * purple as a base surface or body-text color.
 */

export const colors = {
  bg: "#020205",
  surface: "#0d0d18",
  card: "#08080f",
  border: "#1a1a2e",
  purple: {
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    vivid: "#5800D0",
  },
  ink: {
    100: "#f8f8ff",
    200: "#e8e8f0",
    300: "#c8c8d8",
    400: "#a0a0b8",
    600: "#7a7a90",
  },
} as const;

/** Max share of on-screen visual weight (surfaces + particles combined) purple may occupy. */
export const PURPLE_WEIGHT_CAP = 0.05;

export type ColorToken = typeof colors;
