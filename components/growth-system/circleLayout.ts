/**
 * Shared circular layout math — DOM node positions (GrowthNode) and the
 * particle engine's travel targets (GrowthSystem) must agree on the same
 * points, or the "signals travel between nodes" effect visibly misses
 * the cards it's supposed to be connecting.
 */
export interface NormalizedPoint {
  x: number;
  y: number;
}

/** Returns normalized (0–1) viewport-relative positions for `count` points evenly spaced on a circle. */
export function circlePositions(count: number, radiusX = 0.32, radiusY = 0.34, centerX = 0.5, centerY = 0.52): NormalizedPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
    };
  });
}
