/**
 * Fluid typography tokens (ai/specs/responsive-layout-system.md).
 * clamp(min, preferred-vw, max) — scales continuously between viewport
 * breakpoints instead of jumping at Tailwind breakpoints. No ad hoc font
 * sizes anywhere in the codebase — every size must come from this scale.
 */

export const typography = {
  display: "clamp(4rem, 9vw, 8rem)",
  h1: "clamp(3rem, 7vw, 6rem)",
  h2: "clamp(2rem, 5vw, 4rem)",
  h3: "clamp(1.5rem, 3vw, 2.5rem)",
  body: "clamp(0.95rem, 1vw, 1.1rem)",
  small: "clamp(0.8rem, 0.9vw, 0.95rem)",
  // Extracted verbatim from components/hero/HeroText.tsx (repeated 3x
  // inline) — real production headline size, distinct from the generic
  // `display` scale above. Same clamp math, now named (spec item 6).
  heroHeadline: "clamp(34px, 8vw, 78px)",
} as const;

export type TypographyScale = keyof typeof typography;
