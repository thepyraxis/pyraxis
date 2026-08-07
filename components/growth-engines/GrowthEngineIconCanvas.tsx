"use client";

import { useEffect, useRef } from "react";
import { ICONS } from "./icons";
import type { IconId } from "./icons";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import { colors } from "@/styles/tokens";

/**
 * One engine's icon, built from scattered particle points rather than
 * drawn or faded in (ai/rules/animation.md #6: Edges → Outline → Material
 * → Glow → Final object). Adapted from `components/problem/
 * ProblemIconCanvas.tsx` — same per-icon Canvas2D approach, generalized
 * to take any `IconId`/tint. This stays a local micro-canvas rather than
 * an instruction to the global particle engine: icon construction is a
 * fixed animation the whole scene shares (see `icons.tsx`/animation rule
 * #6), not ambient traffic the global engine's shape vocabulary
 * ("scatter" | "circle" | "nodes" | "none") is built to express.
 */

type GrowthEngineIconCanvasProps = {
  icon: IconId;
  className?: string;
  active: boolean;
};

const SIZE = 240;
const CONVERGE_MS = 600;
const STAGGER_MS = 200;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Point = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  delay: number;
  x: number;
  y: number;
};

type Phase = "scattered" | "assembling" | "settled" | "disassembling";

export default function GrowthEngineIconCanvas({ icon, className, active }: GrowthEngineIconCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const draw = ICONS[icon];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxOrNull = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

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
          points.push({ tx: px, ty: py, sx, sy, delay: (dist / maxDist) * STAGGER_MS, x: sx, y: sy });
        }
      }
    }

    let phase: Phase = reducedMotion ? "settled" : "scattered";
    let transitionStart = 0;
    let raf = 0;
    let destroyed = false;
    let visible = activeRef.current;

    let loopRunning = false;

    function startAssembling(now: number) {
      if (phase === "settled" || phase === "assembling") return;
      phase = "assembling";
      transitionStart = now;
      if (!loopRunning) {
        loopRunning = true;
        raf = requestAnimationFrame(render);
      }
    }
    function startDisassembling(now: number) {
      if (phase === "scattered" || phase === "disassembling") return;
      phase = "disassembling";
      transitionStart = now;
      if (!loopRunning) {
        loopRunning = true;
        raf = requestAnimationFrame(render);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const now = performance.now();
          if (entry.isIntersecting && activeRef.current) startAssembling(now);
          else if (!entry.isIntersecting) startDisassembling(now);
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(canvas);

    function render(now: number) {
      if (destroyed) return;
      visible = activeRef.current;
      if (visible) startAssembling(now);
      else if (phase === "settled") startDisassembling(now);

      // Idle: nothing left to animate this frame — bail without drawing or
      // re-scheduling. A fresh raf gets kicked off by startAssembling/
      // startDisassembling (called from the IntersectionObserver callback
      // and from the branch above) whenever phase actually needs to move
      // again. Without this, all 6 cards redraw every point every frame
      // forever, even once fully settled/scattered and visually static —
      // that constant work is what causes the lag entering this section.
      if ((!visible && phase === "scattered") || phase === "settled" || phase === "scattered") {
        loopRunning = false;
        return;
      }

      ctx.clearRect(0, 0, SIZE, SIZE);

      {
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

      const tint = colors.purple[500];
      const [r, g, b] = hexToRgb(tint);
      points.forEach((p) => {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      });

      raf = requestAnimationFrame(render);
    }

    loopRunning = true;
    raf = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [icon, reducedMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
