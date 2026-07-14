import type { NormalizedPoint } from "@/components/future-proof-systems/layout";

/**
 * Normalized (0-1) points ringing the primary button's real on-screen
 * rect, for the one-time particle-convergence-into-button entry beat
 * (ai/specs/cta.md Scene Specification #5). Reads the button's actual
 * measured position rather than a guessed layout coordinate, so the
 * beat still lands correctly regardless of breakpoint/copy length —
 * same "measure the real DOM, don't hardcode" approach Portfolio's
 * scroll-scrub math uses for its own wrapper padding.
 */
export function buttonConvergeTargets(
  rect: { left: number; top: number; width: number; height: number },
  viewportWidth: number,
  viewportHeight: number,
  count: number,
): NormalizedPoint[] {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const halo = 8; // small margin beyond the button edge so particles read as constructing it, not clipped to it
  const rx = rect.width / 2 + halo;
  const ry = rect.height / 2 + halo;

  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x: (cx + Math.cos(angle) * rx) / viewportWidth,
      y: (cy + Math.sin(angle) * ry) / viewportHeight,
    };
  });
}
