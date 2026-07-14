/**
 * Portfolio-local animation constants (ai/specs/portfolio.md Performance
 * Rules: "no magic numbers ... all animation constants centralized").
 * Durations/easings borrow from `styles/tokens/motion.ts` where a scale
 * step applies; values specific to the rail mechanic (density, card
 * width) live here since they don't fit that global scale.
 */
import { motionDuration } from "@/styles/tokens/motion";

export const PORTFOLIO_SOURCE_ID = "portfolio";

/** Ambient "signal" particle density — spec: 0.08 desktop, 0.03 reduced-motion. */
export const PARTICLE_DENSITY = 0.08;
export const PARTICLE_DENSITY_REDUCED = 0.03;

/** Card hover lift — stronger than growth-engines' 6px so the state reads clearly on the rail. */
export const CARD_HOVER_LIFT_PX = 10;
export const CARD_HOVER_SCALE = 1.02;

/** Snappier custom ease than a default CSS transition — a quick decelerate, matches GSAP's power2.out feel in pure CSS. */
export const CARD_HOVER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Card scale when scrolled out of the rail's focal zone vs centered. */
export const CARD_SCALE_INACTIVE = 0.96;
export const CARD_SCALE_ACTIVE = 1;

export const HOVER_DURATION_MS = motionDuration("hover");
export const SCROLL_EASE = "power1.inOut";
export const ENTRY_EASE = "power2.out";

/** Breakpoints — matches Tailwind's sm/lg, mirrors growth-engines/GrowthEngines.tsx. */
export const TABLET_MEDIA_QUERY = "(min-width: 640px) and (max-width: 1023px)";
export const MOBILE_MEDIA_QUERY = "(max-width: 639px)";
