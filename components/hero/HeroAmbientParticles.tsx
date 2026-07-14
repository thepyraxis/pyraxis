"use client";

import { useEffect, useRef } from "react";

import { ambientPointer, subscribeAmbientPointer } from "../common/ambientPointer";

type HeroAmbientParticlesProps = {
  className?: string;
  /**
   * "back" (default): full ambient field, sits behind the logo (matches the
   * old CSS stacking — .layer-particles has no z-index, i.e. auto/0, while
   * .layer-hero-image is z-index 3, so old dust actually renders BEHIND the
   * logo, not in front of it).
   * "front": a thin, sparse layer of near-depth particles confined around
   * the logo's footprint, meant to sit ABOVE the logo so a few motes drift
   * over it — sells the "emerging from the field" read.
   */
  variant?: "back" | "front";
};

type ParticleType = "fastPurple" | "purple" | "white" | "normal";
type Depth = "far" | "mid" | "near";

type DustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: ParticleType;
  depth: Depth;
  mouseMul: number;
  twinkleSpeed: number;
  twinklePhase: number;
};

/**
 * Ambient dust field, ported 1:1 from the original site's `particlesCanvas`
 * (script.js `Particle` class: same three types/colors/sizes/speeds, same
 * mouse-repel radius/force, same edge wraparound) — this IS that canvas,
 * not a reinterpretation. One addition on top of the original: a fourth
 * "purple" type, more saturated than the others, for a denser violet
 * presence in the field, and a bumped total count.
 *
 * (A batch of fast "assemble" particles that rushed toward the logo on
 * mount used to live here — not part of the original site, and it made
 * particles visibly dart at the hero image on load. Removed.)
 *
 * Ownership: strictly Hero's. The canvas fills its parent 1:1 (sized off
 * the parent's own rect, not the viewport) and every particle wraps at
 * that box's own edges — nothing here ever reaches Problem or any later
 * section. The Hero -> Problem handoff is a section-level opacity
 * crossfade applied from the outside (Hero.tsx's `useEdgeFadeOpacity`),
 * not anything this component does with individual particles.
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

    let particles: DustParticle[] = [];
    // Old site: 80. +25% (not doubled) = 100 for the main back layer.
    // Front layer is a sparse accent, not a second full field.
    const totalParticleCount = variant === "front" ? 14 : 100;
    let canvasActive = true;
    let parallaxX = 0;
    let parallaxY = 0;
    // Near-tier (mouseMul 1.6) maxes out around 8*1.6 ≈ 13px drift;
    // far-tier (0.45) barely moves. Kept subtle — a premium reference site
    // wants a faint depth cue, not the field visibly sliding around.
    const PARALLAX_PX = 8;
    let raf = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;

    // Approximate on-screen center of the logo mark (Hero.tsx: right-aligned,
    // pr-[9%], vertically centered). Only used to confine the "front" spawn
    // ring around the logo's footprint.
    function logoTargetX() {
      return width * 0.82;
    }
    function logoTargetY() {
      return height * 0.5;
    }
    // Logo's on-screen footprint is roughly a 5986:3384 rectangle sized to
    // ~34% of the hero width (Hero.tsx clamp) — approximate that as an
    // ellipse for the "front" spawn ring.
    function logoSemiWidth() {
      return width * 0.17;
    }
    function logoSemiHeight() {
      return logoSemiWidth() * (3384 / 5986);
    }

    // Depth tiers give the field actual layering: far/mid/near control size,
    // opacity ceiling, and how strongly a particle reacts to the mouse —
    // near particles read as foreground and bend more; far ones barely move.
    function pickDepth(): { depth: Depth; sizeMul: number; opacityMul: number; mouseMul: number } {
      const r = Math.random();
      if (variant === "front") {
        // Front accent layer is all near-depth by definition.
        return { depth: "near", sizeMul: 1.7, opacityMul: 1.1, mouseMul: 1.5 };
      }
      if (r < 0.55) return { depth: "far", sizeMul: 0.75, opacityMul: 0.75, mouseMul: 0.45 };
      if (r < 0.88) return { depth: "mid", sizeMul: 1, opacityMul: 1, mouseMul: 1 };
      return { depth: "near", sizeMul: 1.9, opacityMul: 1.15, mouseMul: 1.6 };
    }

    function pickType(): { type: ParticleType; color: string; size: number; opacity: number; vx: number; vy: number; twinkleSpeed: number } {
      const typeRoll = Math.random();
      if (typeRoll < 0.08) {
        return {
          type: "fastPurple",
          color: "139, 92, 246",
          size: Math.random() * 0.6 + 0.4,
          opacity: Math.random() * 0.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          twinkleSpeed: Math.random() * 0.08 + 0.03,
        };
      }
      if (typeRoll < 0.23) {
        return {
          type: "white",
          color: "255, 255, 255",
          size: Math.random() * 0.4 + 0.2,
          opacity: Math.random() * 0.3 + 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
        };
      }
      if (typeRoll < 0.42) {
        // Extra dedicated purple particles — richer, more saturated violet
        // than the "normal" mix below, so purple reads as its own color.
        return {
          type: "purple",
          color: "168, 85, 247",
          size: Math.random() * 0.6 + 0.35,
          opacity: Math.random() * 0.3 + 0.55,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          twinkleSpeed: Math.random() * 0.04 + 0.015,
        };
      }
      const colorShift = Math.random() > 0.8 ? "109, 40, 217" : "139, 92, 246";
      return {
        type: "normal",
        color: colorShift,
        size: Math.random() * 0.8 + 0.4,
        opacity: Math.random() * 0.3 + 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
      };
    }

    function makeParticle(x?: number, y?: number): DustParticle {
      const t = pickType();
      const d = pickDepth();
      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        vx: t.vx * (d.depth === "far" ? 0.7 : d.depth === "near" ? 1.15 : 1),
        vy: t.vy * (d.depth === "far" ? 0.7 : d.depth === "near" ? 1.15 : 1),
        size: t.size * d.sizeMul,
        opacity: Math.min(1, t.opacity * d.opacityMul),
        color: t.color,
        type: t.type,
        depth: d.depth,
        mouseMul: d.mouseMul,
        twinkleSpeed: t.twinkleSpeed,
        twinklePhase: Math.random() * Math.PI * 2,
      };
    }

    // Front variant: confine spawn to a ring around the logo's footprint
    // instead of the whole hero, so it reads as "a few motes near the mark"
    // rather than a second full ambient field.
    function makeFrontParticle(): DustParticle {
      const p = makeParticle();
      const angle = Math.random() * Math.PI * 2;
      const rScale = 0.4 + Math.random() * 0.9; // inside to just past the outline
      p.x = logoTargetX() + Math.cos(angle) * logoSemiWidth() * rScale;
      p.y = logoTargetY() + Math.sin(angle) * logoSemiHeight() * rScale;
      return p;
    }

    let rectLeft = 0;
    let rectTop = 0;

    function updateRect() {
      const r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    // Sized off the parent's own box (Hero's box), not the viewport — this
    // canvas is exactly as tall as Hero, nothing more. No bleed, no
    // extension past Hero's bottom edge.
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
      particles = Array.from({ length: totalParticleCount }, () =>
        variant === "front" ? makeFrontParticle() : makeParticle()
      );
      updateRect();
    }

    const unsubscribeMouse = subscribeAmbientPointer();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateRect, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          canvasActive = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    function applyMouseRepel(p: DustParticle, localMX: number, localMY: number) {
      const dx = p.x - localMX;
      const dy = p.y - localMY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Wide radius so the mouse disturbs the whole atmosphere, not just a
      // tight bubble around the cursor. Base force is gentle; each particle's
      // depth-driven mouseMul (0.45 far / 1 mid / 1.6 near) does the rest —
      // near particles bend a lot, far ones barely notice, which also reads
      // as parallax.
      const forceRadius = 220;
      if (distance < forceRadius && distance > 0) {
        const force = (forceRadius - distance) / forceRadius;
        const strength = force * 0.55 * (p.mouseMul ?? 1);
        p.x += (dx / distance) * strength;
        p.y += (dy / distance) * strength;
      }
    }

    function updateParticle(p: DustParticle, localMX: number, localMY: number) {
      p.x += p.vx;
      p.y += p.vy;
      applyMouseRepel(p, localMX, localMY);
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      p.twinklePhase += p.twinkleSpeed;
    }

    function drawParticle(p: DustParticle, pulse: number, offsetX = 0, offsetY = 0) {
      const twinkle = Math.sin(p.twinklePhase) * 0.5 + 0.5;
      let alpha = p.opacity * (0.6 + pulse * 0.2 + twinkle * 0.2);
      if (p.type === "fastPurple" || p.type === "purple") {
        alpha = p.opacity * (0.8 + pulse * 0.1 + twinkle * 0.1);
      }
      const px = p.x + offsetX;
      const py = p.y + offsetY;
      // Reference draw() is a plain filled arc, no shadowBlur, no glow ring —
      // that's what makes its dust read crisp. A soft outer ring used to
      // live here as a cheap shadowBlur stand-in; dropped since it only
      // softened/faded the dot rather than matching the reference's sharp
      // edge.
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      ctx.fill();
      if (p.type === "normal" && alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fill();
      }
    }

    function animate() {
      if (destroyed) return;
      if (!canvasActive) {
        raf = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const pulse = Math.sin(Date.now() / 3000) * 0.5 + 0.5;

      // Canvas fills its own positioned container 1:1, so mapping viewport
      // -> local is a direct subtraction of this canvas's own rect.
      let localMX = -9999;
      let localMY = -9999;
      if (ambientPointer.initialized) {
        localMX = ambientPointer.x - rectLeft;
        localMY = ambientPointer.y - rectTop;
      }

      // Parallax: on top of the per-particle repel, the whole field also
      // drifts a little with the cursor — depth-scaled (mouseMul, same
      // 0.45 far / 1 mid / 1.6 near tiers the repel already uses) so near
      // particles shift more than far ones, selling a 3D-depth illusion as
      // the environment "moves" with the mouse. Pure draw-time offset, not
      // mutated into p.x/p.y, so it never fights the repel/wraparound math.
      // Smoothed (lerp) so it drifts, not snaps, on fast mouse moves.
      if (ambientPointer.initialized) {
        const targetX = Math.max(-1, Math.min(1, (localMX - width / 2) / (width / 2)));
        const targetY = Math.max(-1, Math.min(1, (localMY - height / 2) / (height / 2)));
        parallaxX += (targetX - parallaxX) * 0.05;
        parallaxY += (targetY - parallaxY) * 0.05;
      }

      particles.forEach((p) => {
        updateParticle(p, localMX, localMY);
        drawParticle(
          p,
          pulse,
          parallaxX * PARALLAX_PX * (p.mouseMul ?? 1),
          parallaxY * PARALLAX_PX * (p.mouseMul ?? 1)
        );
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
      window.removeEventListener("scroll", updateRect);
      observer.disconnect();
    };
    // `variant` picks particle count/spawn-mode (front vs back) at setup
    // time (line ~65). Effect fully tears itself down above (cancels RAF,
    // removes listeners, disconnects observer) before re-running, so
    // including it here just re-initializes the field correctly if a
    // parent ever swaps variants at runtime — no partial/stale state risk.
  }, [variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
