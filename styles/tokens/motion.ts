/**
 * Motion timing tokens (Experience Blueprint §07, Design System §10,
 * ai/rules/animation.md #5). No ad hoc durations anywhere in the codebase —
 * every animation/transition duration must come from this scale.
 */
export const motion = {
  micro: { min: 120, max: 250 },
  hover: { min: 250, max: 400 },
  section: { min: 800, max: 1400 },
  transformation: { min: 1500, max: 3000 },
} as const;

export type MotionScale = keyof typeof motion;

/** Convenience: midpoint duration in ms for a scale step, for GSAP/CSS use. */
export function motionDuration(scale: MotionScale): number {
  const { min, max } = motion[scale];
  return Math.round((min + max) / 2);
}
