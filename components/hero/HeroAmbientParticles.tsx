"use client";

import { useEffect, useRef } from "react";

import { ambientPointer, subscribeAmbientPointer } from "../common/ambientPointer";
import { usePerformanceTier } from "@/providers/PerformanceProvider";

type HeroAmbientParticlesProps = {
  className?: string;
  /**
   * "back" (default): the full field, roaming the whole hero box.
   * "front": a sparser, tighter accent confined closer to the logo's
   * footprint, meant to sit above the logo mark itself.
   */
  variant?: "back" | "front";
};

type ShapeId = "diamond" | "rhombus" | "triangle" | "elongated";

// Unit-space vertices (multiplied by each fragment's own `size` at draw
// time). Deliberately small vertex counts (3-4 points) — these read as
// faceted optical glass at 2-6px, not as ornate cut gems.
const SHAPES: Record<ShapeId, [number, number][]> = {
  diamond: [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ],
  rhombus: [
    [0, -1.3],
    [0.7, 0],
    [0, 1.3],
    [-0.7, 0],
  ],
  triangle: [
    [0, -1.15],
    [1, 0.85],
    [-1, 0.85],
  ],
  elongated: [
    [0, -1.6],
    [0.35, -0.1],
    [0, 1.0],
    [-0.35, -0.1],
  ],
};
const SHAPE_IDS = Object.keys(SHAPES) as ShapeId[];

type Fragment = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  shape: ShapeId;
  rotation: number;
  rotationSpeed: number;
  tiltPhase: number;
  tiltSpeed: number;
  baseOpacity: number; // 0.15-0.30, per spec
  // Cursor-as-light-source: eased toward a 0-1 target each frame so the
  // brightening/fading reads as smooth optical response, never a snap.
  glow: number;
  // Rare, brief (<200ms) full-brightness catch-the-light moment.
  sparkling: boolean;
  sparkleStart: number;
  sparkleDuration: number;
  nextSparkleAt: number;
  // 1-step ghost trail — previous frame's screen position, for an
  // "extremely subtle fading light trail", not a comet tail.
  prevX: number;
  prevY: number;
};

/**
 * Hero's ambient field: microscopic glass-crystal fragments the logo is
 * slowly shedding, not dust/sparks/snow/confetti. Spec (verbatim intent):
 *
 * - Tiny transparent-centre beveled shards (diamond / rhombus / triangle /
 *   elongated), 2-6px, 15-30% base opacity, thin white specular + soft
 *   violet edge refraction. No fill — "transparent centre" is taken
 *   literally: only the rim (violet stroke) and a short highlight streak
 *   (white stroke) are drawn, nothing fills the middle.
 * - Motion: slow upward drift + gentle outward drift from the logo, with
 *   a slow 3D-read tumble (in-plane rotation + a cosine "tilt" that
 *   squashes the shape's vertical scale to fake foreshortening). Velocity
 *   is fixed at spawn plus a tiny fixed-frequency sway — no per-frame
 *   randomization, so it never jitters or looks like a game-engine system.
 * - Density stays sparse on purpose; large empty areas are intentional.
 * - The cursor does NOT push fragments. It's treated as a moving light:
 *   fragments within its radius ease their `glow` up (brighter rim +
 *   highlight, faint purple rim light); outside, glow eases back to 0.
 * - Occasionally a single fragment "catches the light" — a <200ms
 *   brightness pulse on a per-fragment randomized schedule, not a
 *   framerate-driven dice roll.
 * - As a fragment drifts far enough from its logo-adjacent spawn point,
 *   its facets fade out and it briefly reads as a soft, faint star-point
 *   before fading to nothing and reseeding near the logo — "dissolving
 *   into the ambient star field" without an visible teleport, since
 *   opacity is already at 0 by the time it respawns.
 *
 * Explicitly avoided throughout: shadowBlur/glow rings (cheap-but-costly
 * and reads as "bloom", plus we specifically removed shadowBlur misuse
 * elsewhere in this codebase for performance), fills-as-fill(gives a
 * "dot", not "glass"), fast movement, random per-frame jitter, and any
 * particle-count high enough to read as weather/confetti/gaming FX.
 */
export default function HeroAmbientParticles({
  className,
  variant = "back",
}: HeroAmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // PERF: every other animated canvas in this codebase (ParticleEngine,
  // GlobeCanvas) is wired into the adaptive tier/degrade system — this
  // one wasn't, despite being the component people actually see lag.
  // `tier` scales the base count for the device class up front; live
  // `degradeFactor` (see the ref + animate() below) then trims how many
  // of THOSE already-spawned fragments actually update/draw each frame
  // if real measured fps drops, no reinit/pop, self-heals as fps recovers.
  const { tier, degradeFactor } = usePerformanceTier();
  const degradeRef = useRef(degradeFactor);
  useEffect(() => {
    degradeRef.current = degradeFactor;
  }, [degradeFactor]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas = canvasEl;
    const ctx = ctxEl;

    let fragments: Fragment[] = [];
    // Sparse by spec — "large empty areas should exist". Front accent
    // layer (sits over the logo) is even thinner. Tier-scaled: same
    // language, fewer draw calls on tablet/mobile.
    const tierMul = tier === "mobile" ? 0.5 : tier === "tablet" ? 0.75 : 1;
    const baseCount = variant === "front" ? 9 : 26;
    const totalCount = Math.max(4, Math.round(baseCount * tierMul));
    let canvasActive = true;
    let raf = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;

    // Approximate on-screen centre of the logo mark (Hero.tsx: right
    // aligned, pr-[9%], vertically centred) — fragments are born here, as
    // if shed from the logo's purple portions.
    function logoOriginX() {
      return width * 0.82;
    }
    function logoOriginY() {
      return height * 0.5;
    }
    function logoSemiWidth() {
      return width * 0.17;
    }
    function logoSemiHeight() {
      return logoSemiWidth() * (3384 / 5986);
    }

    // How far (px) a fragment travels from its spawn point before it has
    // fully dissolved into the star field and reseeds. Front-layer
    // fragments stay close to the mark; back-layer ones roam further.
    function maxTravel() {
      return variant === "front" ? Math.max(80, logoSemiWidth() * 2.4) : Math.min(width, height) * 0.55;
    }

    function spawnPoint(): { x: number; y: number } {
      // Born from "the purple portions of the logo" — a ring around its
      // footprint, biased toward the outline rather than dead centre.
      const angle = Math.random() * Math.PI * 2;
      const rScale = 0.35 + Math.random() * 0.85;
      return {
        x: logoOriginX() + Math.cos(angle) * logoSemiWidth() * rScale,
        y: logoOriginY() + Math.sin(angle) * logoSemiHeight() * rScale,
      };
    }

    function makeFragment(now: number): Fragment {
      const { x, y } = spawnPoint();
      // Outward from the logo, biased upward — "slowly drifts upward",
      // released "into space" rather than falling or scattering flat.
      const dx = x - logoOriginX();
      const dy = y - logoOriginY();
      const outwardLen = Math.hypot(dx, dy) || 1;
      const outward = variant === "front" ? 0.045 : 0.07;
      const upward = variant === "front" ? 0.03 : 0.05;
      const jitter = 0.4; // fixed-at-spawn variation, not per-frame noise
      return {
        x,
        y,
        originX: x,
        originY: y,
        vx: (dx / outwardLen) * outward * (1 + Math.random() * jitter),
        vy: (dy / outwardLen) * outward * (1 + Math.random() * jitter) * 0.4 - upward,
        size: 2 + Math.random() * 4, // 2-6px, per spec
        shape: SHAPE_IDS[Math.floor(Math.random() * SHAPE_IDS.length)]!,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.006,
        tiltPhase: Math.random() * Math.PI * 2,
        tiltSpeed: 0.006 + Math.random() * 0.01,
        baseOpacity: 0.15 + Math.random() * 0.15, // 15-30%, per spec
        glow: 0,
        sparkling: false,
        sparkleStart: 0,
        sparkleDuration: 0,
        nextSparkleAt: now + 6000 + Math.random() * 14000,
        prevX: x,
        prevY: y,
      };
    }

    let rectLeft = 0;
    let rectTop = 0;

    function updateRect() {
      const r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    // Sized off the parent's own box (Hero's), not the viewport.
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
      const now = performance.now();
      fragments = Array.from({ length: totalCount }, () => makeFragment(now));
      updateRect();
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

    const LIGHT_RADIUS = 170;

    function updateFragment(f: Fragment, now: number, localMX: number, localMY: number) {
      f.prevX = f.x;
      f.prevY = f.y;
      f.x += f.vx;
      f.y += f.vy;
      f.rotation += f.rotationSpeed;
      f.tiltPhase += f.tiltSpeed;

      // Cursor as a moving light source, not a force: proximity only ever
      // changes how bright the fragment reads, never where it is.
      const dx = f.x - localMX;
      const dy = f.y - localMY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetGlow = dist < LIGHT_RADIUS ? 1 - dist / LIGHT_RADIUS : 0;
      f.glow += (targetGlow - f.glow) * 0.08;

      // Rare, brief catch-the-light sparkle on an independent schedule
      // (not tied to frame rate / random-per-frame rolls).
      if (!f.sparkling && now >= f.nextSparkleAt) {
        f.sparkling = true;
        f.sparkleStart = now;
        f.sparkleDuration = 120 + Math.random() * 70; // < 200ms
      }
      if (f.sparkling && now - f.sparkleStart > f.sparkleDuration) {
        f.sparkling = false;
        f.nextSparkleAt = now + 9000 + Math.random() * 18000;
      }

      // Respawn once fully dissolved into the star field so the field
      // keeps a steady, calm population without ever "exploding" outward.
      const travelled = Math.hypot(f.x - f.originX, f.y - f.originY);
      if (travelled > maxTravel()) {
        Object.assign(f, makeFragment(now));
      }
    }

    function drawFragment(f: Fragment, now: number) {
      const travelled = Math.hypot(f.x - f.originX, f.y - f.originY);
      const t = Math.min(1, travelled / maxTravel());

      // Crossfade: solid crystal early in life, fading through a soft
      // star-point mid-life, invisible by the time it respawns — so the
      // reseed near the logo is never a visible pop.
      const crystalWeight = Math.max(0, 1 - t / 0.6);
      const starWeight =
        Math.max(0, Math.min(1, (t - 0.35) / 0.3)) * (1 - Math.max(0, Math.min(1, (t - 0.8) / 0.2)));

      const sparkleT = f.sparkling ? Math.max(0, Math.min(1, (now - f.sparkleStart) / f.sparkleDuration)) : 0;
      const sparkleBoost = f.sparkling ? Math.sin(Math.PI * sparkleT) : 0;

      // Ghost trail: a single, extremely faint segment from last frame's
      // position — a hint of motion, not a comet tail.
      if (crystalWeight > 0.02) {
        const trailAlpha = f.baseOpacity * crystalWeight * 0.12;
        if (trailAlpha > 0.005) {
          ctx.beginPath();
          ctx.moveTo(f.prevX, f.prevY);
          ctx.lineTo(f.x, f.y);
          ctx.strokeStyle = `rgba(200, 190, 255, ${trailAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      if (crystalWeight > 0.01) {
        const verts = SHAPES[f.shape];
        const tilt = Math.max(0.18, Math.cos(f.tiltPhase));

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.scale(1, tilt);

        ctx.beginPath();
        verts.forEach(([vx, vy], i) => {
          const px = vx * f.size;
          const py = vy * f.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();

        // Soft violet edge refraction — the rim, not a fill. Brightens
        // gently with cursor glow and the rare sparkle.
        const rimAlpha = f.baseOpacity * crystalWeight * (0.55 + f.glow * 0.9 + sparkleBoost * 0.6);
        ctx.strokeStyle = `rgba(168, 130, 255, ${Math.min(0.9, rimAlpha)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Thin white specular highlight along one edge only — reads as a
        // polished bevel catching light, not an outline.
        const [hx1, hy1] = verts[0]!;
        const [hx2, hy2] = verts[1]!;
        const t1 = 0.15,
          t2 = 0.55;
        ctx.beginPath();
        ctx.moveTo((hx1 + (hx2 - hx1) * t1) * f.size, (hy1 + (hy2 - hy1) * t1) * f.size);
        ctx.lineTo((hx1 + (hx2 - hx1) * t2) * f.size, (hy1 + (hy2 - hy1) * t2) * f.size);
        const highlightAlpha =
          f.baseOpacity * crystalWeight * (0.7 + f.glow * 1.1 + sparkleBoost * 1.4);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, highlightAlpha)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // A subtle purple rim light appears only once the cursor's near —
        // a second, wider, dimmer outer stroke.
        if (f.glow > 0.03) {
          ctx.beginPath();
          verts.forEach(([vx, vy], i) => {
            const px = vx * (f.size + 0.8);
            const py = vy * (f.size + 0.8);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${f.glow * 0.22})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        ctx.restore();
      }

      // Dissolved state: a faint, soft star-point, visually tying the
      // fragment back into the ambient sky rather than just vanishing.
      if (starWeight > 0.01) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(0.6, f.size * 0.28), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 225, 255, ${f.baseOpacity * starWeight * 0.6})`;
        ctx.fill();
      }
    }

    function animate() {
      if (destroyed) return;
      if (!canvasActive) {
        raf = requestAnimationFrame(animate);
        return;
      }
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      let localMX = -9999;
      let localMY = -9999;
      if (ambientPointer.initialized) {
        localMX = ambientPointer.x - rectLeft;
        localMY = ambientPointer.y - rectTop;
      }

      // Live degrade: only update/draw the leading N of the already-spawned
      // fragments, where N shrinks under sustained low measured fps and
      // grows back as it recovers (see degradeRef above). Index-bounded
      // loop, not .slice() — no per-frame array allocation.
      const activeCount = Math.max(4, Math.round(fragments.length * degradeRef.current));
      for (let i = 0; i < activeCount; i++) {
        const f = fragments[i]!;
        updateFragment(f, now, localMX, localMY);
        drawFragment(f, now);
      }

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
  }, [variant, tier]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
