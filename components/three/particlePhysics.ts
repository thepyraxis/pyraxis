import type { ParticlePool } from "./particlePool";

const DRAG = 0.92;
const MAX_SPEED = 6;

/**
 * Advances one particle by one frame: seek its target with mass/drag-based
 * acceleration (believable momentum, never teleporting — ai/rules/
 * animation.md #2), plus a small per-particle noise wobble so a swarm reads
 * as organic rather than a grid. Pure function over pooled typed arrays —
 * no allocation (ai/rules/coding.md #11).
 *
 * Fields are read into locals once (non-null asserted — `i` is always a
 * caller-guaranteed valid slot index, `noUncheckedIndexedAccess` just can't
 * express that for typed arrays) and written back once at the end, rather
 * than re-indexing the pool a dozen times per particle per frame.
 */
export function stepParticle(
  pool: ParticlePool,
  i: number,
  dtSeconds: number,
  mouseX: number,
  mouseY: number,
  mouseActive: boolean,
  reducedMotion: boolean,
): void {
  let x = pool.x[i]!;
  let y = pool.y[i]!;
  let vx = pool.vx[i]!;
  let vy = pool.vy[i]!;
  const mass = pool.mass[i]!;
  const noiseSeed = pool.noiseSeed[i]!;
  let life = pool.life[i]!;
  const phase = pool.phase[i]!;

  const dx = pool.targetX[i]! - x;
  const dy = pool.targetY[i]! - y;
  const dist = Math.max(1, Math.hypot(dx, dy));

  const pull = 1 / mass;
  let ax = (dx / dist) * pull * 40;
  let ay = (dy / dist) * pull * 40;

  // Mouse repulsion — cursor particles/interaction, kept subtle (never a spinner/shake effect).
  if (mouseActive && !reducedMotion) {
    const mdx = x - mouseX;
    const mdy = y - mouseY;
    const mdist = Math.hypot(mdx, mdy);
    if (mdist < 120 && mdist > 0.01) {
      const force = ((120 - mdist) / 120) * 18;
      ax += (mdx / mdist) * force;
      ay += (mdy / mdist) * force;
    }
  }

  // Low-rate noise wobble, seeded per-particle so it doesn't look synchronized.
  // Reduced (not removed) under prefers-reduced-motion (ai/rules/animation.md #10).
  const t = performance.now() * 0.001 + noiseSeed;
  const wobble = reducedMotion ? 0.3 : 1.2;
  ax += Math.sin(t) * wobble;
  ay += Math.cos(t * 0.8) * wobble;

  vx = (vx + ax * dtSeconds) * DRAG;
  vy = (vy + ay * dtSeconds) * DRAG;

  const speed = Math.hypot(vx, vy);
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed;
    vx *= scale;
    vy *= scale;
  }

  x += vx;
  y += vy;
  pool.rotation[i] = pool.rotation[i]! + pool.angularVelocity[i]!;

  // phase 2 = exiting: fade and let the engine release once life hits 0.
  if (phase === 2) {
    life = Math.max(0, life - dtSeconds * 0.6);
  } else if (life < 1) {
    life = Math.min(1, life + dtSeconds * 1.2);
  }

  pool.x[i] = x;
  pool.y[i] = y;
  pool.vx[i] = vx;
  pool.vy[i] = vy;
  pool.ax[i] = ax;
  pool.ay[i] = ay;
  pool.life[i] = life;
  pool.energy[i] = Math.min(1, speed / MAX_SPEED);
}
