/**
 * Particle DNA data model (Experience Blueprint §03) and supporting enums.
 * Struct-of-arrays layout (see particlePool.ts) — not one object per
 * particle — so the engine never allocates inside its render loop
 * (ai/rules/coding.md #11).
 *
 * DNA fields per ai/context/09-particle-engine.md: Position, Velocity,
 * Acceleration, Mass, Rotation, Angular Velocity, Life, Glow, Depth,
 * Temperature, Noise, Target, State, Energy.
 *
 * Simplification note (logged in ai/memory/decisions.md D-012): the full
 * eight-state behavior machine (Idle → Searching → Travelling → Connecting
 * → Building → Living → Breaking → Returning) is implemented as three
 * observable phases — entering / living / exiting — which sections drive
 * directly. The finer states are a choreography detail inside "entering"
 * and "exiting" (stagger, easing, target assignment), not separate stored
 * states, since Canvas2D/instanced-mesh particles don't need per-particle
 * state-machine bookkeeping to read correctly on screen. Revisit if a
 * scene needs to observably pause mid-travel.
 */
export type ParticlePhase = "entering" | "living" | "exiting";

export const PARTICLE_TYPE = {
  ambient: 0,
  signal: 1,
  construction: 2,
  network: 3,
  cursor: 4,
  hero: 5,
  energy: 6,
  earth: 7,
  glow: 8,
} as const;

export type ParticleType = keyof typeof PARTICLE_TYPE;

export const PHASE_CODE: Record<ParticlePhase, number> = {
  entering: 0,
  living: 1,
  exiting: 2,
};

export type ParticleShape = "scatter" | "circle" | "nodes" | "none";

export interface ParticleInstruction {
  /** Section id sending the instruction, e.g. "growth-system". */
  sourceId: string;
  shape: ParticleShape;
  /** Normalized (0–1) viewport-relative anchor points, e.g. circular node positions. */
  targets?: { x: number; y: number }[];
  /** This section's share of the device density budget, 0–1. */
  density: number;
  phase: ParticlePhase;
  /** Index into `targets` currently under mouse focus, redirects nearby particles toward it. */
  focusIndex?: number | null;
  particleType?: ParticleType;
  /**
   * Draw faint connective lines between nearby `targets` (the CTA/FPS Earth
   * network-mesh look) — an overlay pass on the raw target points, separate
   * from the jittered dust particles themselves. Opt-in per instruction so
   * every other scene's "circle"/"nodes" usage (Growth System, Process,
   * etc.) is unaffected.
   */
  connect?: boolean;
  /** Normalized (0-1, viewport-diagonal-relative) max line distance; defaults inside the engine. */
  connectRadius?: number;
}
