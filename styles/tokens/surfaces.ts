/**
 * Surface tokens (Design System §07). Every surface in the product belongs
 * to exactly one of these four types. No other surface types exist —
 * do not invent a fifth.
 */
import { colors } from "./colors";

export type SurfaceType = "flat" | "glass" | "metal" | "signal";

export interface SurfaceStyle {
  background: string;
  backdropBlur?: string;
  border?: string;
  boxShadow?: string;
}

export const surfaces: Record<SurfaceType, SurfaceStyle> = {
  /** Minimal, no depth. Used for background sections. */
  flat: {
    background: colors.bg,
  },
  /** Semi-transparent, blur 8–12px. Used for interactive cards. */
  glass: {
    background: "rgba(13, 13, 24, 0.55)",
    backdropBlur: "10px",
    border: `1px solid ${colors.border}`,
  },
  /** Reflective, premium. Used for hero objects. */
  metal: {
    background: `linear-gradient(155deg, ${colors.ink[300]} 0%, ${colors.card} 60%, ${colors.border} 100%)`,
    boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
  },
  /** Glowing, purple-tinted. Reserved for active signals / CTA (purple weight cap applies). */
  signal: {
    background: colors.card,
    border: `1px solid ${colors.purple[500]}`,
    boxShadow: `0 0 24px rgba(139, 92, 246, 0.35)`,
  },
};
