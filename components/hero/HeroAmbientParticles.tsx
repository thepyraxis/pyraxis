"use client";

import { useEffect, useRef } from "react";

import { ambientPointer, subscribeAmbientPointer } from "../common/ambientPointer";

type HeroAmbientParticlesProps = {
  className?: string;
  /**
   * "back" (default): the full field — sparse, drifts up past the logo's
   * footprint and out toward the edges of Hero.
   * "front": a thinner, even sparser accent confined near the logo's
   * footprint — reads as fragments still close enough to the mark to be
   * legible as crystal, before they've dissolved into the far field.
   */
  variant?: "back" | "front";
};

// Four gently-varied crystal silhouettes (unit-scale point sets, scaled by
// `size` at draw time). Not randomized per-frame — picked once at spawn —
// so a given fragment keeps one consistent silhouette for its whole life.
const SHAPES: Record<string, number[][]> = {
  diamond: [
    [0, -1],
    [0.62, 0],
    [0, 1],
    [-0.62, 0],
  ],
  rhombus: [
    [0, -0.68],
    [1, 0],
    [0, 0.68],
    [-1, 0],
  ],
  triangle: [
    [0, -1],
    [0.88, 0.78],
    [-0.88, 0.78],
  ],
  elongated: [
    [0, -1.7],
    [0.32, 0],
    [0, 1.7],
    [-0.32, 0],
  ],
};
const SHAPE_KEYS = Object.keys(SHAPES);

type Fragment = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Slow-changing wander target — inertia steers vx toward this instead of
  // ever snapping, so drift never reads as jitter.
  windPhase: number;
  windSpeed: number;
  windAmp: number;
  size: number;
  baseOpacity: number; // 0.15–0.30, per spec
  shape: number[][];
  rotZ: number;
  rotZSpeed: number;
  rotY: number; // drives the pseudo-3D tumble (vertical squish)
  rotYSpeed: number;
  spawnX: number;
  spawnY: number;
  traveled: number; // accumulated upward distance since spawn, drives dissolve
  lit: number; // 0..1, smoothed proximity-to-cursor / sparkle brightness
  sparkleUntil: number; // ms timestamp; while now < this, a brief catch-the-light flash
  nextSparkleAt: number;
  trail: { x: number; y: number }[];
};

/**
 * Hero's ambient field: microscopic glass-crystal fragments shed slowly by
 * the logo's violet mass, drifting upward through still air. Optical, not
 * mechanical — no repulsion, no bursts, no per-frame randomness. Every
 * motion value here is either fixed at spawn or eased toward a slow-moving
 * target, which is what keeps it calm rather than reading as a particle
 * system.
 *
 * The cursor is treated as a light source: fragments near it brighten at
 * the edges and gain a faint violet rim, then fade back out — never moved.
 */
export default function HeroAmbientParticles({
  className,
  variant = "back",
}: HeroAmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas = canvasEl;
    const ctx = ctxEl;

    let fragments: Fragment[] = [];
    // Sparse by design — large empty areas are intentional, not a gap to
    // fill. "front" is a thinner accent still, not a second full field.
    const totalCount = variant === "front" ? 9 : 26;
    let canvasActive = true;
    let raf = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;
    let rectLeft = 0;
    let rectTop = 0;

    // Approximate on-screen position of the logo's violet mass (Hero.tsx:
    // right-aligned, pr-[~12%], vertically centered). Fragments originate
    // from within this footprint, as though the mark is releasing them.
    function logoX() {
      return width * 0.82;
    }
    function logoY() {
      return height * 0.5;
    }
    function logoSemiW() {
      return width * 0.16;
    }
    function logoSemiH() {
      return logoSemiW() * (3384 / 5986);
    }

    function spawnPoint(): { x: number; y: number } {
      if (variant === "front") {
        const angle = Math.random() * Math.PI * 2;
        const rScale = 0.3 + Math.random() * 0.7;
        return {
          x: logoX() + Math.cos(angle) * logoSemiW() * rScale,
          y: logoY() + Math.sin(angle) * logoSemiH() * rScale,
        };
      }
      // Back field: mostly born near/within the logo footprint, a
      // minority already loose in the wider field so the canvas doesn't
      // read empty on first paint.
      if (Math.random() < 0.7) {
        const angle = Math.random() * Math.PI * 2;
        const rScale = Math.random() * 1.15;
        return {
          x: logoX() + Math.cos(angle) * logoSemiW() * rScale,
          y: logoY() + Math.sin(angle) * logoSemiH() * rScale,
        };
      }
      return { x: Math.random() * width, y: Math.random() * height };
    }

    function makeFragment(fresh = true): Fragment {
      const p = spawnPoint();
      const shapeKey = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
      const now = performance.now();
      return {
        x: p.x,
        y: p.y,
        vx: 0,
        vy: -(0.035 + Math.random() * 0.05), // barely-there upward drift
        windPhase: Math.random() * Math.PI * 2,
        windSpeed: 0.0025 + Math.random() * 0.0025,
        windAmp: 0.05 + Math.random() * 0.06,
        size: 2 + Math.random() * 4, // 2–6px
        baseOpacity: 0.15 + Math.random() * 0.15, // 15–30%
        shape: SHAPES[shapeKey],
        rotZ: Math.random() * Math.PI * 2,
        rotZSpeed: (Math.random() - 0.5) * 0.0022,
        rotY: Math.random() * Math.PI * 2,
        rotYSpeed: 0.0009 + Math.random() * 0.0014,
        spawnX: p.x,
        spawnY: p.y,
        traveled: fresh ? 0 : Math.random() * height * 0.3,
        lit: 0,
        sparkleUntil: 0,
        nextSparkleAt: now + 4000 + Math.random() * 9000,
        trail: [],
      };
    }

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas.clientWidth;
      height = rect?.height ?? canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fragments = Array.from({ length: totalCount }, () => makeFragment(false));
      updateRect();
    }

    function updateRect() {
      const r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    const unsubscribeMouse = subscribeAmbientPointer();
    window.addEventListener("resize", resize);
    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        updateRect();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          canvasActive = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Distance beyond which a fragment has fully dissolved into the
    // ambient field and is recycled back to the logo. Kept generous (most
    // of Hero's height) so the transition is a slow fade, not a cutoff.
    const dissolveRange = () => Math.max(height * 0.75, 420);
    // How far out (as a fraction of dissolveRange) crystal detail begins
    // yielding to a soft ambient dot.
    const dissolveStart = 0.45;

    const LIGHT_RADIUS = 130;

    function updateFragment(p: Fragment, localMX: number, localMY: number, now: number) {
      // Inertia: ease velocity toward a slow, low-frequency wander target
      // rather than ever assigning it directly — this is what keeps the
      // motion "held in still air" instead of noisy.
      p.windPhase += p.windSpeed;
      const targetVx = Math.sin(p.windPhase) * p.windAmp * 0.05;
      p.vx += (targetVx - p.vx) * 0.02;
      p.y += p.vy;
      p.x += p.vx;
      p.traveled += -p.vy;

      p.rotZ += p.rotZSpeed;
      p.rotY += p.rotYSpeed;

      // Gentle horizontal wrap only — never a repel, never a bounce.
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      // Recycle once fully dissolved or drifted off the top.
      if (p.traveled > dissolveRange() || p.y < -40) {
        Object.assign(p, makeFragment(true));
        return;
      }

      // Cursor as light source: proximity sets a target brightness, eased
      // in fast and released slowly, so the fade-out reads as optical
      // afterglow rather than a snap.
      const dx = p.x - localMX;
      const dy = p.y - localMY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = dist < LIGHT_RADIUS ? 1 - dist / LIGHT_RADIUS : 0;
      const targetLit = Math.max(proximity, now < p.sparkleUntil ? 1 : 0);
      p.lit += (targetLit - p.lit) * (targetLit > p.lit ? 0.22 : 0.05);

      // Rare, brief catch-the-light sparkle — independent of the cursor,
      // always under 200ms.
      if (now >= p.nextSparkleAt) {
        p.sparkleUntil = now + 120 + Math.random() * 70;
        p.nextSparkleAt = now + 5000 + Math.random() * 11000;
      }

      // Trail: a handful of fading past positions, sampled sparsely so it
      // reads as a faint smear rather than a comet tail.
      if (Math.random() < 0.5) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();
      }
    }

    function drawFragment(p: Fragment) {
      const range = dissolveRange();
      const maturity = Math.min(
        1,
        Math.max(0, (p.traveled / range - dissolveStart) / (1 - dissolveStart))
      );
      const crystalStrength = 1 - maturity;
      const ambientStrength = maturity;

      // Trail — extremely subtle, fades toward the tail, drawn before the
      // fragment so the fragment sits on top.
      for (let i = 0; i < p.trail.length; i++) {
        const t = p.trail[i];
        const trailAlpha = p.baseOpacity * crystalStrength * 0.08 * ((i + 1) / p.trail.length);
        if (trailAlpha <= 0.002) continue;
        ctx.beginPath();
        ctx.arc(t.x, t.y, Math.max(0.4, p.size * 0.25), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${trailAlpha})`;
        ctx.fill();
      }

      // Once mostly dissolved, fragments read as a soft ambient point —
      // this is the "lose crystalline appearance, join the star field"
      // behavior, not a disappearance.
      if (ambientStrength > 0.001) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 255, ${p.baseOpacity * ambientStrength * 0.6})`;
        ctx.fill();
      }

      if (crystalStrength <= 0.001) return;

      const squish = 0.32 + 0.68 * Math.abs(Math.cos(p.rotY));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotZ);
      ctx.scale(1, squish);

      ctx.beginPath();
      const pts = p.shape;
      ctx.moveTo(pts[0][0] * p.size, pts[0][1] * p.size);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0] * p.size, pts[i][1] * p.size);
      }
      ctx.closePath();

      const baseAlpha = p.baseOpacity * crystalStrength;
      const litBoost = p.lit;

      // Transparent center -> soft violet edge refraction.
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, `rgba(196, 181, 253, 0)`);
      grad.addColorStop(0.55, `rgba(196, 181, 253, ${baseAlpha * (0.35 + litBoost * 0.35)})`);
      grad.addColorStop(1, `rgba(167, 139, 250, ${baseAlpha * (0.6 + litBoost * 0.4)})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Thin white specular highlight — brightens under the light, faint
      // and constant otherwise. A plain thin stroke, no blur.
      ctx.lineWidth = Math.max(0.4, p.size * 0.12);
      ctx.strokeStyle = `rgba(255, 255, 255, ${baseAlpha * (0.5 + litBoost * 0.9)})`;
      ctx.stroke();

      // Subtle purple rim, visible only while lit — a second, larger,
      // fainter outline rather than shadowBlur, so it stays crisp.
      if (litBoost > 0.02) {
        ctx.save();
        ctx.scale(1.22, 1.22);
        ctx.beginPath();
        ctx.moveTo(pts[0][0] * p.size, pts[0][1] * p.size);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i][0] * p.size, pts[i][1] * p.size);
        }
        ctx.closePath();
        ctx.lineWidth = Math.max(0.4, p.size * 0.1);
        ctx.strokeStyle = `rgba(167, 139, 250, ${litBoost * 0.35})`;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    function animate() {
      if (destroyed) return;
      if (!canvasActive) {
        raf = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      let localMX = -9999;
      let localMY = -9999;
      if (ambientPointer.initialized) {
        localMX = ambientPointer.x - rectLeft;
        localMY = ambientPointer.y - rectTop;
      }

      fragments.forEach((p) => {
        updateFragment(p, localMX, localMY, now);
        drawFragment(p);
      });

      raf = requestAnimationFrame(animate);
    }

    resize();
    animate();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      unsubscribeMouse();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
