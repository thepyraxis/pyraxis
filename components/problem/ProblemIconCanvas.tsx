"use client";

import { useEffect, useRef } from "react";
import { drawGhostedLeads, drawManualChaos, drawSlowResponse, drawLostRevenue } from "./icons";
import type { IconDraw } from "./icons";

export type IconId = "ghostedLeads" | "manualChaos" | "slowResponse" | "lostRevenue";

const ICONS: Record<IconId, IconDraw> = {
  ghostedLeads: drawGhostedLeads,
  manualChaos: drawManualChaos,
  slowResponse: drawSlowResponse,
  lostRevenue: drawLostRevenue,
};

type ProblemIconCanvasProps = {
  icon: IconId;
  className?: string;
};

const SIZE = 300;
const CONVERGE_MS = 650;
const STAGGER_MS = 220;
// Same brand purple as the rest of the site (purple-500/vivid), not a
// separate blue-shifted tint — reference renders these icons in the same
// violet/purple family as everything else, just glowing.
const TINT = { r: 168, g: 122, b: 255 };

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Point = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  delay: number;
  size: number;
  // last drawn position, so reversing direction never jumps
  x: number;
  y: number;
};

type Phase = "scattered" | "assembling" | "settled" | "disassembling";

/**
 * Icons here are never faded in — they physically construct themselves from
 * scattered points and, per Experience Blueprint §10, disassemble again on
 * the way out. Reduced motion just holds the finished icon, no assembly.
 */
export default function ProblemIconCanvas({ icon, className }: ProblemIconCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const draw = ICONS[icon];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxOrNull = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    canvas.width = SIZE;
    canvas.height = SIZE;

    const offscreen = document.createElement("canvas");
    offscreen.width = SIZE;
    offscreen.height = SIZE;
    const octx = offscreen.getContext("2d");
    if (!octx) return;
    draw(octx, SIZE);
    const data = octx.getImageData(0, 0, SIZE, SIZE).data;

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    const points: Point[] = [];
    const step = 2;
    for (let py = 0; py < SIZE; py += step) {
      for (let px = 0; px < SIZE; px += step) {
        const idx = (py * SIZE + px) * 4;
        const alpha = data[idx + 3];
        if (alpha !== undefined && alpha > 100) {
          const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
          const sx = Math.random() * SIZE;
          const sy = Math.random() * SIZE;
          points.push({
            tx: px,
            ty: py,
            sx,
            sy,
            delay: (dist / maxDist) * STAGGER_MS,
            size: 0.9 + Math.random() * 1.4,
            x: sx,
            y: sy,
          });
        }
      }
    }

    let phase: Phase = prefersReducedMotion ? "settled" : "scattered";
    let transitionStart = 0;
    let raf = 0;
    let destroyed = false;
    let visible = false;
    let flickerTimer = 0;
    let flickerSet = new Set<number>();

    function startAssembling(now: number) {
      if (phase === "settled" || phase === "assembling") return;
      phase = "assembling";
      transitionStart = now;
    }
    function startDisassembling(now: number) {
      if (phase === "scattered" || phase === "disassembling") return;
      phase = "disassembling";
      transitionStart = now;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          const now = performance.now();
          if (visible) startAssembling(now);
          else startDisassembling(now);
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(canvas);

    function render(now: number) {
      if (destroyed) return;
      if (!visible && phase === "scattered") {
        raf = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, SIZE, SIZE);

      if (phase === "settled") {
        for (const p of points) {
          p.x = p.tx;
          p.y = p.ty;
        }
      } else if (phase === "scattered") {
        for (const p of points) {
          p.x = p.sx;
          p.y = p.sy;
        }
      } else {
        const elapsed = now - transitionStart;
        const assembling = phase === "assembling";
        let allDone = true;
        for (const p of points) {
          const t = (elapsed - p.delay) / CONVERGE_MS;
          const clamped = Math.max(0, Math.min(1, t));
          if (clamped < 1) allDone = false;
          const eased = easeOutCubic(clamped);
          if (assembling) {
            p.x = p.sx + (p.tx - p.sx) * eased;
            p.y = p.sy + (p.ty - p.sy) * eased;
          } else {
            p.x = p.tx + (p.sx - p.tx) * eased;
            p.y = p.ty + (p.sy - p.ty) * eased;
          }
        }
        if (allDone) phase = assembling ? "settled" : "scattered";
      }

      // Signal state for this scene is "lost / interrupted" (Design System
      // §Signal) — a sparse, brief flicker across a few points, not a glow.
      if (phase === "settled" && !prefersReducedMotion) {
        flickerTimer += 1;
        if (flickerTimer > 90) {
          flickerTimer = 0;
          flickerSet = new Set();
          const count = Math.floor(points.length * 0.05);
          for (let i = 0; i < count; i++) {
            flickerSet.add(Math.floor(Math.random() * points.length));
          }
        }
      } else {
        flickerSet = new Set();
      }

      ctx.globalCompositeOperation = "lighter";
      points.forEach((p, i) => {
        const dim = flickerSet.has(i) && flickerTimer < 6;
        const alpha = dim ? 0.08 : 0.85;
        ctx.fillStyle = `rgba(${TINT.r}, ${TINT.g}, ${TINT.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [icon]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
