/**
 * Process-local animation constants (ai/specs/process.md Performance
 * Rules: "no magic numbers ... all animation constants centralized").
 * Mirrors components/portfolio/motion.ts's pattern for this section.
 */

export const PROCESS_SOURCE_ID = "process";

/**
 * Ambient "signal" particle density — below Portfolio's 0.08 since this
 * section is calmer (Medium intensity rest-adjacent beat, ai/specs/process.md
 * §Animation → Particle behavior flagged this as an open "pick a real number"
 * decision; 0.06 sits between Why PYRAXIS's 0.05 and Portfolio's 0.08).
 */
export const PARTICLE_DENSITY = 0.06;
export const PARTICLE_DENSITY_REDUCED = 0.02;

/** Fixed, non-data-driven stage order per Blueprint §15 — see content.ts. */
export const STAGE_COUNT = 5;

export const SCROLL_EASE = "power1.inOut";
export const ENTRY_EASE = "power3.out";

/**
 * Exit/leaving acceleration beat — per Blueprint §15 "Signal accelerates.
 * Carries energy into Scene 08." Faster+sharper than the calm scroll-scrub
 * ease above, deliberately distinct so the handoff reads as a real event.
 */
export const EXIT_ACCELERATION_EASE = "power4.in";
export const EXIT_ACCELERATION_DURATION_S = 0.6;

export const TABLET_MEDIA_QUERY = "(min-width: 640px) and (max-width: 1023px)";
export const MOBILE_MEDIA_QUERY = "(max-width: 639px)";

/**
 * Desktop stacking-card choreography (Apple/Linear-style: each step is a
 * sticky card that the next one slides over). Each stage's sticky wrapper
 * is a full `100vh` box pinned at `top: 0` with the card flex-centered
 * inside it — so the card always rests dead-center in the viewport, not
 * offset toward the top. `STEP_VH` is the scroll distance reserved per
 * stage; it must exceed 100vh (the sticky box's own height) so the
 * sticky element has room to release smoothly before the next stage
 * takes over — 130vh gives a 30vh buffer, enough for the handoff to
 * read as deliberate pacing rather than an abrupt cut.
 */
export const STEP_VH = 130;
