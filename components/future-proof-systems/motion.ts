/**
 * Future-Proof Systems local animation constants
 * (ai/specs/future-proof-systems.md Performance Rules: "no magic numbers ...
 * all animation constants centralized"). Mirrors components/process/motion.ts
 * and components/portfolio/motion.ts's pattern for this section.
 */

export const NETWORK_SOURCE_ID = "future-proof-network";
export const EARTH_SOURCE_ID = "future-proof-earth";
export const ORBIT_SOURCE_ID = "future-proof-orbit";

/**
 * Density split across three concurrent instructions (spec Open Questions:
 * "pick real numbers at build time"). This is the highest total ambient
 * density on the page (Very High intensity, Visual Rhythm Map §19) — still
 * expressed as a share of `densityBudget` per device tier
 * (styles/tokens/particles.ts), never a new budget tier.
 *
 * Split: network (ambient scattered nodes) carries the most particles since
 * it's meant to read as "massive open environment"; earth + orbit are fewer
 * but brighter (particleType "signal", the only type the shared engine
 * renders with glow — see Notes in the spec re: reusing "signal" for
 * brightness, same reasoning as Why PYRAXIS's glow -> signal fix).
 */
export const NETWORK_DENSITY = 0.13;
export const EARTH_DENSITY = 0.07;
export const ORBIT_DENSITY = 0.05;

export const NETWORK_DENSITY_REDUCED = 0.05;
export const EARTH_DENSITY_REDUCED = 0.04;
export const ORBIT_DENSITY_REDUCED = 0;

/** Node/point counts for each layer. Fixed, not data-driven. */
export const NETWORK_NODE_COUNT = 18;
export const EARTH_RING_COUNT = 10;
export const ORBIT_POINT_COUNT = 6;

/**
 * Rotation-illusion angular speed (radians/second) for the earth cluster
 * and orbit paths. Slow, per ai/rules/animation.md #4 ("only slow zoom,
 * gentle orbit ... subtle enough to go unnoticed consciously") — resolves
 * spec Open Question "target-ring angular cycling vs per-particle orbit
 * offset" in favor of angular cycling of the whole ring, the simpler of
 * the two and the one that keeps every particle's *relative* position on
 * the ring stable (reads as one rotating object, not scattered drift).
 */
export const EARTH_ROTATION_SPEED = 0.05;
export const ORBIT_ROTATION_SPEED = 0.09;

/** Normalized-coordinate geometry for the earth-illusion ring and orbit ellipse. */
export const EARTH_CENTER = { x: 0.5, y: 0.58 };
export const EARTH_RADIUS = { x: 0.15, y: 0.16 };
export const ORBIT_RADIUS = { x: 0.32, y: 0.14 };

/**
 * Normalized-distance threshold within which the nearest network node is
 * considered "hovered" for the focus-redirect effect (spec: "hovering a
 * node can bias signal routing toward it"). 0.09 of viewport diagonal-ish
 * scale keeps the reaction radius generous without redirecting from the
 * opposite side of the screen.
 */
export const HOVER_REDIRECT_THRESHOLD = 0.09;

/**
 * Exit/leaving convergence beat — per Blueprint §16 "Network converges.
 * Particles begin forming Earth shape." Distinct from Process's
 * accelerating-signal handoff (a point speeding up); this is the network
 * ring visibly collapsing toward the earth cluster's center over a real
 * duration, the second non-generic scene transition in the roadmap.
 */
export const CONVERGE_DURATION_MS = 1400;
export const CONVERGE_EASE_POWER = 2.2; // ease-in exponent, hand-rolled (no CSS/gsap tween needed for a scalar 0-1 progress)

export const ENTRY_EASE = "power3.out";
