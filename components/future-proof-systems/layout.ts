/**
 * Geometry for Future-Proof Systems' three particle layers. Every function
 * returns normalized (0-1) viewport-relative points, same contract as
 * components/growth-system/circleLayout.ts, so the shared particle engine
 * (components/three/ParticleEngine.tsx) can place targets consistently
 * with every other scene.
 *
 * No DOM elements share these positions (spec: "massive open environment,
 * no cards") — unlike Growth System/Growth Engines, there's nothing on
 * screen to keep visually aligned with these points beyond the particles
 * themselves.
 */

export interface NormalizedPoint {
  x: number;
  y: number;
}

/**
 * Deterministic scattered network points across the open viewport, using
 * a golden-angle spiral rather than Math.random() — gives an organic,
 * even, non-repeating spread while staying deterministic (no SSR/client
 * hydration mismatch, no re-scatter on every render). Ties thematically to
 * the brand's "manufactured, engineered" quality (ai/rules/design.md /
 * Brand Bible) rather than looking like uncontrolled noise.
 */
export function networkPositions(count: number, marginX = 0.06, marginY = 0.1): NormalizedPoint[] {
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const t = count <= 1 ? 0 : i / (count - 1);
    const angle = i * GOLDEN_ANGLE;
    // Spiral radius grows with i, then is renormalized into the margin-safe box.
    const r = Math.sqrt(t);
    const x = 0.5 + Math.cos(angle) * r * (0.5 - marginX);
    const y = 0.5 + Math.sin(angle) * r * (0.5 - marginY);
    return { x, y };
  });
}

/**
 * Earth-illusion ring: points evenly spaced on an ellipse, with an angular
 * offset driving the "slowly rotating globe" illusion (spec: target-ring
 * angular cycling — motion.ts EARTH_ROTATION_SPEED). This never becomes a
 * mesh/sphere; it's the same target-jitter technique every other scene's
 * "circle"/"nodes" shape already uses, just called out by name here.
 */
export function earthRingPositions(
  count: number,
  angleOffset: number,
  center: NormalizedPoint,
  radius: NormalizedPoint,
): NormalizedPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + angleOffset;
    return {
      x: center.x + Math.cos(angle) * radius.x,
      y: center.y + Math.sin(angle) * radius.y * 0.55, // flattened ellipse reads as a horizon-tilted globe, not a flat circle
    };
  });
}

/**
 * Full-sphere Earth point cloud (extends `earthRingPositions`'s single-ring
 * illusion into genuine spherical coverage, still Canvas2D/no mesh — spec
 * Technical Constraint unchanged, only the point distribution improves).
 * Fibonacci-sphere sampling gives even, non-clustered coverage of the whole
 * sphere surface; each point is rotated around the vertical axis by
 * `angleOffset` (the existing spin technique) then tilted toward the
 * viewer so the visible band reads as a real curved horizon rather than a
 * flat ellipse. Points on the sphere's far side are culled (z < 0 after
 * tilt) — a 2D depth-test approximation, not a real z-buffer.
 */
export function earthSpherePositions(
  count: number,
  angleOffset: number,
  center: NormalizedPoint,
  radius: NormalizedPoint,
): NormalizedPoint[] {
  const TILT = 0.55; // radians — camera-relative tilt matching the reference horizon angle
  const cosTilt = Math.cos(TILT);
  const sinTilt = Math.sin(TILT);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const points: NormalizedPoint[] = [];

  for (let i = 0; i < count; i++) {
    const y = count <= 1 ? 0 : 1 - (i / (count - 1)) * 2; // -1..1, pole to pole
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * goldenAngle + angleOffset;
    const x = Math.cos(theta) * ringRadius;
    const z = Math.sin(theta) * ringRadius;

    const yTilt = y * cosTilt - z * sinTilt;
    const zTilt = y * sinTilt + z * cosTilt;
    if (zTilt < -0.05) continue; // far side of the sphere: culled

    points.push({ x: center.x + x * radius.x, y: center.y + yTilt * radius.y });
  }

  return points;
}

/**
 * Orbital-motion illusion: a small number of points tracing a wide ellipse
 * around the earth cluster, each phase-offset around the ring so they read
 * as several bodies in orbit rather than one point circling alone.
 */
export function orbitPositions(
  count: number,
  angleOffset: number,
  center: NormalizedPoint,
  radius: NormalizedPoint,
): NormalizedPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + angleOffset;
    return {
      x: center.x + Math.cos(angle) * radius.x,
      y: center.y + Math.sin(angle) * radius.y,
    };
  });
}

/** Nearest-point index to a normalized cursor position, for hover-redirect focus. */
export function nearestIndex(points: NormalizedPoint[], cursor: NormalizedPoint): { index: number; distance: number } {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    const d = Math.hypot(p.x - cursor.x, p.y - cursor.y);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return { index: best, distance: bestDist };
}
