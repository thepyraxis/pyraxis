/**
 * Fluid spacing tokens (ai/specs/responsive-layout-system.md).
 * clamp-based — replaces fixed py-40/gap-24/mt-120-style arbitrary values.
 * No ad hoc spacing anywhere in the codebase — every gap/margin/padding
 * value must come from this scale.
 */

export const spacing = {
  sectionY: "clamp(5rem, 8vw, 10rem)",
  gapSm: "clamp(0.75rem, 1.2vw, 1.25rem)",
  gapMd: "clamp(1rem, 2vw, 3rem)",
  gapLg: "clamp(1.5rem, 3vw, 4rem)",
  inset: "clamp(1rem, 2.5vw, 2rem)",
  margin: "clamp(2rem, 5vw, 6rem)",
} as const;

export type SpacingScale = keyof typeof spacing;
