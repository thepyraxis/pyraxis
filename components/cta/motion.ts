/**
 * CTA local animation constants (ai/specs/cta.md Performance Rules:
 * "no magic numbers ... all constants centralized in
 * components/cta/motion.ts"). Mirrors components/future-proof-systems/
 * motion.ts's pattern.
 *
 * Rotation speeds are imported, not re-declared — spec Technical
 * Constraint / Animation → Particle behavior commits this section to
 * *continuing* Future-Proof Systems' Earth-illusion ring (same technique,
 * new sourceId, shifted anchor), not reinventing it. Re-exported here so
 * every other CTA constant still lives in one place.
 */
import { EARTH_ROTATION_SPEED, ORBIT_ROTATION_SPEED } from "@/components/future-proof-systems/motion";

export { EARTH_ROTATION_SPEED, ORBIT_ROTATION_SPEED };

export const EARTH_SOURCE_ID = "cta-earth";
export const ORBIT_SOURCE_ID = "cta-orbit";
export const CONSTRUCT_SOURCE_ID = "cta-construct";

/**
 * Medium intensity (Visual Rhythm Map §19) — a deliberate step down from
 * Future-Proof Systems' Very-High peak (NETWORK/EARTH/ORBIT_DENSITY there:
 * 0.13/0.07/0.05). Spec Open Question "exact density value" resolved here,
 * below that peak on every layer.
 */
export const EARTH_DENSITY = 0.09;
export const ORBIT_DENSITY = 0.03;
export const EARTH_DENSITY_REDUCED = 0.05;
export const ORBIT_DENSITY_REDUCED = 0;

/**
 * Earth point count — up from the original 8-point flat ring (manual-QA
 * fix: a single ellipse of 8 targets read as a thin outline, not a globe;
 * see reference art). `earthSpherePositions` (Fibonacci-sphere sampling,
 * `future-proof-systems/layout.ts`) turns this count into genuine surface
 * coverage rather than one ring, so it needs far more points to read as a
 * dotted continent texture instead of a wireframe.
 */
export const EARTH_RING_COUNT = 170;
export const EARTH_RING_COUNT_REDUCED = 90;
export const ORBIT_POINT_COUNT = 5;

/** Network-mesh line reach for the Earth field, normalized to viewport diagonal (ParticleEngine `connectRadius`). */
export const EARTH_CONNECT_RADIUS = 0.1;

/**
 * Bottom-anchored Earth-illusion geometry (spec Layout → Desktop: "~30% of
 * its height visible above the fold"). Center sits below the viewport
 * bottom edge (y > 1); `earthRingPositions`' own 0.55 ellipse-flatten
 * means the visible top arc sits at center.y - radius.y * 0.55 — solved
 * here for a ~0.28 visible band (1 - 0.28 = 0.72), i.e. "~30%".
 */
export const EARTH_CENTER = { x: 0.5, y: 1.02 };
export const EARTH_RADIUS = { x: 0.46, y: 0.51 };
export const ORBIT_RADIUS = { x: 0.62, y: 0.66 };

/**
 * One-time particle-convergence-into-button entry beat (spec Scene
 * Specification #5). Duration sits inside `styles/tokens/motion.ts`'s
 * `transformation` scale (1500-3000ms) — a real transformation, not a
 * micro/hover-scale timing.
 */
export const CONSTRUCT_DURATION_MS = 1800;
export const CONSTRUCT_EASE_POWER = 2; // ease-in, same hand-rolled-power-curve technique as FPS's CONVERGE_EASE_POWER
export const CONSTRUCT_POINT_COUNT = 14;

/** Delay after copy reveal completes before the construct beat fires (spec Animation → Entry #3). */
export const CONSTRUCT_DELAY_MS = 300;

/**
 * Manual-QA fix (post-Phase-14-sign-off): the section's IntersectionObserver
 * used threshold-only detection, so the Earth ring + entry reveal didn't
 * start until CTA was already 20% into the viewport — leaving a beat of
 * empty scroll between Future-Proof Systems' exit convergence finishing and
 * anything appearing here. Expanding the observer's root bottom margin lets
 * the ring/reveal begin while CTA is still scrolling into view, closing that
 * gap without adding new content. Not centralized before because the gap
 * wasn't noticed until real-browser scroll-through QA (rootMargin invisible
 * in code review / static screenshots).
 */
export const EARLY_ENTER_ROOT_MARGIN = "0px 0px 350px 0px";
export const EARLY_ENTER_THRESHOLD = 0;

/** Subtle hover lift for the primary button (manual-QA polish: rest vs. hover felt too similar). */
export const BUTTON_HOVER_LIFT_PX = 3;
