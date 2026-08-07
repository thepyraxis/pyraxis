"use client";

import { useEffect, useRef } from "react";

import { ambientPointer, subscribeAmbientPointer } from "../common/ambientPointer";

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
 * Problem's own ambient dust field. Deliberately the same particle
 * palette/types/physics as HeroAmbientParticles — that shared identity is
 * what sells "one continuous atmosphere" across the Hero -> Problem seam —
 * but this is a fully separate field, owned by and confined to Problem's
 * own box. No particle here ever originated in Hero, crossed a boundary,
 * or was handed off; it's simply the same kind of dust, spawned fresh,
 * living entirely within Problem.
 *
 * The illusion of continuity comes from the outside: Problem.tsx fades
 * this field in with `useEdgeFadeOpacity` as Problem's own top edge
 * approaches the viewport top, in lockstep with Hero's field fading out
 * for the same reason on its side of the seam.
 *
 * Count is intentionally lighter than Hero's 100 — Problem is "the least
 * attractive-looking section" (see Problem.tsx's lighting-rules comment),
 * so its atmosphere should read as quieter, not competing with Hero's.
 */
export default function ProblemAmbientParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas = canvasEl;
    const ctx = ctxEl;

    let particles: DustParticle[] = [];
    const totalParticleCount = 60;
    let canvasActive = true;
    let parallaxX = 0;
    let parallaxY = 0;
    const PARALLAX_PX = 8;
    let raf = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;

    function pickDepth(): { depth: Depth; sizeMul: number; opacityMul: number; mouseMul: number } {
      const r = Math.random();
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

    function makeParticle(): DustParticle {
      const t = pickType();
      const d = pickDepth();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
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

    let rectLeft = 0;
    let rectTop = 0;

    function updateRect() {
      const r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    // Sized off the parent's own box (Problem's box) — this field never
    // extends past Problem's own edges, same discipline as Hero's field.
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
      particles = Array.from({ length: totalParticleCount }, () => makeParticle());
      updateRect();
    }

    const unsubscribeMouse = subscribeAmbientPointer();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateRect, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (canvasActive = entry.isIntersecting)),
      { threshold: 0 }
    );
    observer.observe(canvas);

    function applyMouseRepel(p: DustParticle, localMX: number, localMY: number) {
      const dx = p.x - localMX;
      const dy = p.y - localMY;
      const distance = Math.sqrt(dx * dx + dy * dy);
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

      let localMX = -9999;
      let localMY = -9999;
      if (ambientPointer.initialized) {
        localMX = ambientPointer.x - rectLeft;
        localMY = ambientPointer.y - rectTop;
      }

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
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
