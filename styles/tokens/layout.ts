/**
 * Layout tokens (ai/specs/responsive-layout-system.md).
 * Container width, responsive horizontal padding, breakpoint constants.
 * Single source of truth for both Tailwind config and JS/GSAP consumers.
 */

export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const layout = {
  containerMaxWidth: "1240px", // confirmed: identical fixed value across all 8 sections
  // Extracted verbatim from components/navigation/Header.tsx — same clamp
  // math, now named so it's not an orphan inline value (spec item 6).
  headerPaddingX: "clamp(1.5rem, 5vw, 3.75rem)",
  navMobileLinkSize: "clamp(28px, 8vw, 40px)",
  paddingX: {
    base: "1rem", // px-4
    sm: "1.5rem", // sm:px-6
    md: "2rem", // md:px-8
    lg: "3rem", // lg:px-12
    xl: "4rem", // xl:px-16
    "2xl": "5rem", // 2xl:px-20
  },
  radius: "1rem",
} as const;
