/**
 * Fluid spacing tokens (ai/specs/responsive-layout-system.md).
 * clamp-based — replaces fixed py-40/gap-24/mt-120-style arbitrary values.
 * No ad hoc spacing anywhere in the codebase — every gap/margin/padding
 * value must come from this scale.
 *
 * One flat semantic ladder (xs -> xl) usable with any spacing utility
 * (gap-*, p-*, m-*, space-y-*, ...) — not per-utility aliases like the
 * old `gap-sm` / `margin-fluid` names, which implied a token was only
 * valid for one CSS property. `sectionY` is the one deliberate exception:
 * it's not a rung on the xs-xl ladder, it's the fixed vertical rhythm
 * every top-level <Section> shares.
 */

export const spacing = {
  xs: "clamp(0.5rem, 1vw, 0.75rem)",
  sm: "clamp(0.75rem, 1.2vw, 1.25rem)",
  md: "clamp(1rem, 2vw, 3rem)",
  lg: "clamp(1.5rem, 3vw, 4rem)",
  xl: "clamp(2rem, 5vw, 6rem)",
  sectionY: "clamp(5rem, 8vw, 10rem)",
} as const;

export type SpacingScale = keyof typeof spacing;
