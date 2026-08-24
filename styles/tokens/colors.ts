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
  bg: "#050506",
  surface: "#08080B",
  card: "#0B0B0F",
  border: "#1a1a1c",
  purple: {
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    vivid: "#5800D0",
  },
  ink: {
    100: "#F2F0EB",
    200: "#d9d6cf",
    300: "#A8A5AD",
    400: "#8a8791",
    600: "#68666E",
  },
} as const;

/** Max share of on-screen visual weight (surfaces + particles combined) purple may occupy. */
export const PURPLE_WEIGHT_CAP = 0.05;

export type ColorToken = typeof colors;
