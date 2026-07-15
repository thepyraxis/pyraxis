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

/**
 * Scroll distance the pin consumes, as a multiple of the raw horizontal
 * overflow (`track.scrollWidth - visibleTrackWidth`). Cards are equal
 * width, so the overflow itself is small (roughly one card's width worth
 * of travel for 3 cards) — a single wheel/trackpad tick can cover nearly
 * all of it, which drives `self.progress` from 0 to ~1 in one scroll
 * event. The active-index math is correct either way, but a middle card's
 * "active" window then has no scroll room to ever register a rendered
 * frame — it reads as skipped even though it briefly was active. This
 * stretches the pinned scroll range so every card gets real dwell room;
 * the tween's actual x-translate distance is untouched.
 */
export const SCROLL_DISTANCE_MULTIPLIER = 1.6;

/** Breakpoints — matches Tailwind's sm/lg, mirrors growth-engines/GrowthEngines.tsx. */
export const TABLET_MEDIA_QUERY = "(min-width: 640px) and (max-width: 1023px)";
export const MOBILE_MEDIA_QUERY = "(max-width: 639px)";
