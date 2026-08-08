"use client";

import { useEffect, useRef } from "react";

import { ambientPointer, subscribeAmbientPointer } from "../common/ambientPointer";
import { usePerformanceTier } from "@/providers/PerformanceProvider";

type ParallaxTarget = {
  ref: React.RefObject<HTMLElement | null>;
  /** Matches the reference's data-speed attribute (0.01 noise / 0.04
   *  particles), multiplied by the same 0.3 the reference applies. */
  speed: number;
};

type HeroAmbientParticlesProps = {
  className?: string;
  /**
   * Layers to parallax in lockstep with this canvas's own animation loop —
   * ported straight from the reference's single `animateBackground()`,
   * which drives BOTH the particle simulation and the noise/particle-layer
   * `transform` off the same frame, with a direct proportional offset (no
   * lerp/easing). Previously each layer had its own `useParallaxMouse`
   * hook with an independent rAF + lerp loop — extra concurrent loops and
   * an artificial "catch-up" lag the reference doesn't have. Folding them
   * into this loop matches the reference's snappier feel and cuts rAF
   * loop count for the hero from 5 down to 3 (this + logo + cursor, same
   * as the reference's animateBackground + animateLogo + animateCursor).
   */
  parallaxTargets?: ParallaxTarget[];
};

type ParticleType = "fastPurple" | "white" | "normal";

type DustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: ParticleType;
  twinkleSpeed: number;
  twinklePhase: number;
};

/**
 * Ambient dust field — 1:1 port of the reference's `particlesCanvas`
 * (script.js `Particle` class + `animateBackground()`): same 3 particle
 * types/colors/sizes/speeds, same 80-particle count, same mouse-repel
 * radius (120px) and force (0.4), same edge wraparound, same combined
 * parallax+particle single rAF loop. No depth tiers, no extra "purple"
 * type, no per-device particle-count scaling in the reference — those
 * were prior embellishments on top of the original and are what made this
 * feel heavier than the reference. Kept ONE deliberate deviation: particle
 * count still scales down on mobile/tablet (usePerformanceTier) since the
 * reference never had to run on a phone; desktop gets the exact reference
 * count.
 */
export default function HeroAmbientParticles({
  className,
  parallaxTargets,
}: HeroAmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tier } = usePerformanceTier();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas = canvasEl;
    const ctx = ctxEl;

    let particles: DustParticle[] = [];
    // Reference: 80, fixed, desktop-only target audience.
    const tierMul = tier === "mobile" ? 0.35 : tier === "tablet" ? 0.65 : 1;
    const totalParticleCount = Math.max(6, Math.round(80 * tierMul));
    let canvasActive = true;
    let raf = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;

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
      if (typeRoll < 0.25) {
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

    function makeParticle(): DustParticle {
      const t = pickType();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: t.vx,
        vy: t.vy,
        size: t.size,
        opacity: t.opacity,
        color: t.color,
        type: t.type,
        twinkleSpeed: t.twinkleSpeed,
        twinklePhase: Math.random() * Math.PI * 2,
      };
    }

    let rectLeft = 0;
    let rectTop = 0;

    function updateRect() {
      const r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    // Sized off the parent's own box (Hero's box) — reference sizes off
    // the whole window, but confining to Hero's own box (no bleed into
    // Problem) is a deliberate Next-specific choice kept from before.
    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas.clientWidth;
      height = rect?.height ?? canvas.clientHeight;
      // Reference never applies devicePixelRatio at all (canvas.width =
      // window.innerWidth, 1:1 CSS px). Matching that here too — DPR-aware
      // sizing was doubling+ the pixel count on retina, real added cost
      // for a canvas that's mostly soft, low-contrast dust.
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      particles = Array.from({ length: totalParticleCount }, () => makeParticle());
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

    function applyMouseRepel(p: DustParticle, localMX: number, localMY: number) {
      const dx = p.x - localMX;
      const dy = p.y - localMY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Reference: forceRadius 120, force*0.4 — was 220/0.55 here, a much
      // wider and stronger repel than the reference actually has. Matched
      // back to the reference's tighter, subtler bubble.
      const forceRadius = 120;
      if (distance < forceRadius && distance > 0) {
        const force = (forceRadius - distance) / forceRadius;
        p.x += (dx / distance) * force * 0.4;
        p.y += (dy / distance) * force * 0.4;
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

    const rgbCache = new Map<string, string>();
    function rgbString(color: string) {
      let s = rgbCache.get(color);
      if (!s) {
        s = `rgb(${color})`;
        rgbCache.set(color, s);
      }
      return s;
    }
    const WHITE_RGB = "rgb(255, 255, 255)";

    function drawParticle(p: DustParticle, pulse: number) {
      const twinkle = Math.sin(p.twinklePhase) * 0.5 + 0.5;
      let alpha = p.opacity * (0.6 + pulse * 0.2 + twinkle * 0.2);
      if (p.type === "fastPurple") {
        alpha = p.opacity * (0.8 + pulse * 0.1 + twinkle * 0.1);
      }
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = rgbString(p.color);
      ctx.fill();
      if (p.type === "normal" && alpha > 0.5) {
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = WHITE_RGB;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function animate() {
      if (destroyed) return;
      if (!canvasActive) {
        raf = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const pulse = Math.sin(Date.now() / 3000) * 0.5 + 0.5;

      let localMX = -9999;
      let localMY = -9999;
      if (ambientPointer.initialized) {
        localMX = ambientPointer.x - rectLeft;
        localMY = ambientPointer.y - rectTop;
      }

      // Parallax — same loop, direct proportional offset, no lerp, exactly
      // like the reference's animateBackground. mouseRel is viewport-
      // center-relative (matches `mx - window.innerWidth/2` in the ref).
      if (parallaxTargets && parallaxTargets.length && ambientPointer.initialized) {
        const mouseRelX = ambientPointer.x - window.innerWidth / 2;
        const mouseRelY = ambientPointer.y - window.innerHeight / 2;
        for (const t of parallaxTargets) {
          const el = t.ref.current;
          if (!el) continue;
          const s = t.speed * 0.3;
          el.style.transform = `translate(${(mouseRelX * s).toFixed(2)}px, ${(mouseRelY * s).toFixed(2)}px)`;
        }
      }

      particles.forEach((p) => {
        updateParticle(p, localMX, localMY);
        drawParticle(p, pulse);
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
  }, [tier, parallaxTargets]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
