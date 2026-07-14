"use client";

import { useEffect, useRef } from "react";

/**
 * The inverted-V particle fountain across the top of the Problem section —
 * two curved streams sweeping in from the upper corners and converging to
 * a bright point above the headline. Particles continuously flow along
 * the curve (looping), denser and brighter near the convergence point.
 *
 * Cheap on purpose: no shadowBlur (see ProblemIconCanvas's post-mortem —
 * per-particle shadowBlur at any real density stalls the main thread and
 * eats input). Glow here comes only from `globalCompositeOperation =
 * "lighter"` additive blending of plain filled circles.
 */

const TINT = { r: 168, g: 122, b: 255 };
const PARTICLES_PER_ARM = 140;

type Particle = {
  arm: -1 | 1; // left or right
  t: number; // position along curve, 0 = outer start, 1 = focal point
  speed: number;
  spread: number; // perpendicular jitter, scaled down near the focal point
  size: number;
};

export default function ProblemFountain({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let destroyed = false;
    let visible = true;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width;
      canvas!.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    for (const arm of [-1, 1] as const) {
      for (let i = 0; i < PARTICLES_PER_ARM; i++) {
        particles.push({
          arm,
          t: Math.random(),
          speed: 0.06 + Math.random() * 0.05,
          spread: Math.random(),
          size: 0.6 + Math.random() * 1.3,
        });
      }
    }

    // Curve: outer point near the top corner, sweeping down and inward to
    // the focal point roughly 78% down the strip's height, center-x.
    function curvePoint(arm: -1 | 1, t: number) {
      const focalX = width * 0.5;
      const focalY = height * 0.94;
      const startX = width * 0.5 + arm * width * 0.48;
      const startY = height * 0.02;
      // ease so the curve bows outward before sweeping in (matches the
      // reference's gentle S-curve rather than a straight line)
      const bow = Math.sin(t * Math.PI) * width * 0.05 * arm;
      const x = startX + (focalX - startX) * t + bow * (1 - t);
      const y = startY + (focalY - startY) * Math.pow(t, 1.6);
      return { x, y };
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0 }
    );
    observer.observe(canvas);

    function render() {
      if (destroyed) return;
      if (!visible) {
        raf = requestAnimationFrame(render);
        return;
      }

      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.t += p.speed * 0.01;
          if (p.t > 1) p.t = 0;
        }
        const { x: cx, y: cy } = curvePoint(p.arm, p.t);
        // spread narrows to ~0 as particles approach the focal point, so
        // the stream visually converges instead of staying a fat band
        const widthAtT = (1 - p.t) * 22 + 2;
        const perp = (p.spread - 0.5) * widthAtT;
        const x = cx + perp;
        const y = cy;

        const nearFocal = p.t > 0.75;
        const alpha = 0.15 + p.t * 0.65;
        const size = p.size * (nearFocal ? 1.6 : 1);

        ctx!.fillStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, size, 0, Math.PI * 2);
        ctx!.fill();
      }

      // focal glow — a few overlapping soft circles, still no shadowBlur
      const focalX = width * 0.5;
      const focalY = height * 0.94;
      for (let i = 0; i < 3; i++) {
        ctx!.fillStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, ${0.12 - i * 0.03})`;
        ctx!.beginPath();
        ctx!.arc(focalX, focalY, 14 + i * 10, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalCompositeOperation = "source-over";

      if (!prefersReducedMotion) raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" role="presentation" className={className} />;
}
