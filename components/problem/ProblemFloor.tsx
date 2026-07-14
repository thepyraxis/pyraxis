"use client";

import { useEffect, useRef } from "react";

/**
 * The particle "floor" beneath the symptom cards — a wide wavy mesh of
 * connected dots (reads as a flowing 3D wireframe graph, not scattered
 * dust) plus concentric ripple rings and a vertical beam feeding down
 * from the fountain above into the center, like the fountain draining
 * into a pool. Same cheap-glow approach as ProblemFountain: additive
 * blend only, no per-particle shadowBlur.
 *
 * Speed is driven by real elapsed seconds (not frame count) — the
 * previous version multiplied a per-frame counter directly into the sine
 * phase, so at 60fps it cycled several times a second. Cinematic here
 * means slow: a full wave cycle takes several seconds, rings take ~9s
 * to expand out.
 */

const TINT = { r: 168, g: 122, b: 255 };
const STRANDS = 6;
const DOTS_PER_STRAND = 48;
const RING_COUNT = 4;
const RING_CYCLE_SECONDS = 9;
const WAVE_CYCLE_SECONDS = 14;

export default function ProblemFloor({ className = "" }: { className?: string }) {
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
    const start = performance.now();

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width;
      canvas!.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0 }
    );
    observer.observe(canvas);

    function render(now: number) {
      if (destroyed) return;
      if (!visible) {
        raf = requestAnimationFrame(render);
        return;
      }

      const seconds = prefersReducedMotion ? 0 : Math.max(0, (now - start) / 1000);

      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";

      const centerX = width * 0.5;
      const centerY = height * 0.18;

      // Vertical beam feeding down from the top edge (where the fountain
      // above hands off) into the center point.
      const beamGradient = ctx!.createLinearGradient(centerX, 0, centerX, centerY);
      beamGradient.addColorStop(0, `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, 0)`);
      beamGradient.addColorStop(1, `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, 0.5)`);
      ctx!.fillStyle = beamGradient;
      ctx!.fillRect(centerX - 1, 0, 2, centerY);

      // Wavy strands — each a horizontal band of connected points
      // undulating vertically, amplitude tapering toward the edges so it
      // reads as a floor rather than a flat strip. Points are joined with
      // a thin stroked path so it reads as a flowing 3D wireframe graph.
      for (let s = 0; s < STRANDS; s++) {
        const bandY = height * (0.15 + (s / (STRANDS - 1)) * 0.75);
        const freq = 0.008 + s * 0.0015;
        const amp = 10 + s * 3;
        const phase = s * 1.4 + (seconds / WAVE_CYCLE_SECONDS) * Math.PI * 2;

        const points: { x: number; y: number; alpha: number; size: number }[] = [];
        for (let i = 0; i < DOTS_PER_STRAND; i++) {
          const x = (width / DOTS_PER_STRAND) * i;
          const edgeFade = Math.sin((i / DOTS_PER_STRAND) * Math.PI);
          const y = bandY + Math.sin(x * freq + phase) * amp * edgeFade;
          const dist = Math.hypot(x - centerX, y - centerY);
          const distFade = Math.max(0, 1 - dist / (width * 0.55));
          const alpha = (0.08 + distFade * 0.35) * (0.4 + edgeFade * 0.6);
          const size = 0.6 + distFade * 1.4;
          points.push({ x, y, alpha, size });
        }

        // connecting line — very faint, just enough to read as a mesh
        ctx!.beginPath();
        points.forEach((p, i) => (i === 0 ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y)));
        ctx!.strokeStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, 0.1)`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        for (const p of points) {
          ctx!.fillStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, ${p.alpha})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Concentric ripple rings expanding slowly from the center point
      for (let r = 0; r < RING_COUNT; r++) {
        const raw = prefersReducedMotion
          ? r / RING_COUNT
          : seconds / RING_CYCLE_SECONDS + r / RING_COUNT;
        // safe modulo — JS `%` can return negative for a negative dividend
        // (e.g. a transient rAF timestamp that lands a hair before `start`
        // on the very first frame), which then fed a negative radius into
        // ctx.ellipse and threw IndexSizeError.
        const cycle = ((raw % 1) + 1) % 1;
        const radius = Math.max(0, cycle * width * 0.5);
        const alpha = (1 - cycle) * 0.22;
        if (alpha <= 0.01 || radius <= 0) continue;
        ctx!.strokeStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.ellipse(centerX, centerY, radius, radius * 0.28, 0, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // bright center point
      for (let i = 0; i < 3; i++) {
        ctx!.fillStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, ${0.18 - i * 0.05})`;
        ctx!.beginPath();
        ctx!.arc(centerX, centerY, 6 + i * 8, 0, Math.PI * 2);
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
