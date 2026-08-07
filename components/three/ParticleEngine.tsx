"use client";

import { useEffect, useRef } from "react";
import { ParticlePool } from "./particlePool";
import { stepParticle } from "./particlePhysics";
import type { ParticleInstruction } from "./particleTypes";
import { useMouseStore } from "@/providers/MouseProvider";
import { usePerformanceTier } from "@/providers/PerformanceProvider";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import { densityBudget, colors } from "@/styles/tokens";

const MAX_CAPACITY = densityBudget.desktop.max;

interface Props {
  instructionStore: { getSnapshot: () => Map<string, ParticleInstruction>; subscribe: (cb: () => void) => () => void };
}

/**
 * One canvas. One simulation. One renderer (ai/context/09-particle-engine.md).
 * Sections never mount their own canvas — they send instructions via
 * `useParticles()` and this is the only place that touches the pool or
 * draws a frame. Migrating Hero/Problem's per-component canvases into this
 * engine is tracked separately (ai/memory/known-issues.md, ai/memory/
 * decisions.md D-012) so this addition doesn't also silently rewrite two
 * already-shipped, already-passing scenes in the same pass.
 */
export default function ParticleEngine({ instructionStore }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poolRef = useRef<ParticlePool | null>(null);
  const ownerIdsRef = useRef<Map<string, number>>(new Map());
  const nextOwnerId = useRef(0);
  const mouseStore = useMouseStore();
  const { tier, degradeFactor } = usePerformanceTier();
  const reducedMotion = usePrefersReducedMotion();

  if (!poolRef.current) poolRef.current = new ParticlePool(MAX_CAPACITY);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pool = poolRef.current;
    if (!canvas || !pool) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    let rafId: number;

    const tierBudget = densityBudget[tier].max;

    const resolveTarget = (instruction: ParticleInstruction, particleIndexInGroup: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (instruction.shape === "circle" || instruction.shape === "nodes") {
        const targets = instruction.targets;
        if (targets && targets.length > 0) {
          const focus = instruction.focusIndex;
          const nodeIndex = focus !== null && focus !== undefined && particleIndexInGroup % 3 === 0 ? focus % targets.length : particleIndexInGroup % targets.length;
          const node = targets[nodeIndex]!;
          const jitter = 14;
          return { x: node.x * w + (Math.random() - 0.5) * jitter, y: node.y * h + (Math.random() - 0.5) * jitter };
        }
      }
      // scatter / fallback: even spread across viewport.
      return { x: Math.random() * w, y: Math.random() * h };
    };

    const getOwnerId = (sourceId: string): number => {
      let id = ownerIdsRef.current.get(sourceId);
      if (id === undefined) {
        id = nextOwnerId.current++;
        ownerIdsRef.current.set(sourceId, id);
      }
      return id;
    };

    const reconcile = (instructions: Map<string, ParticleInstruction>) => {
      const densityScale = reducedMotion ? 0.5 : 1;
      const activeSources = new Set(instructions.keys());

      // Drop owners no longer sending instructions.
      for (const [sourceId, ownerId] of ownerIdsRef.current) {
        if (!activeSources.has(sourceId)) pool.releaseOwner(ownerId);
      }

      instructions.forEach((instruction) => {
        const ownerId = getOwnerId(instruction.sourceId);
        const desired = Math.round(tierBudget * instruction.density * degradeFactor * densityScale);
        let currentCount = 0;
        for (let i = 0; i < pool.capacity; i++) {
          if (pool.active[i] === 1 && pool.ownerSlot[i] === ownerId) currentCount++;
        }
        const deficit = desired - currentCount;
        if (deficit > 0 && instruction.phase !== "exiting") {
          for (let n = 0; n < deficit; n++) {
            const i = pool.acquire(ownerId, instruction.particleType ?? "signal", instruction.phase);
            if (i === null) break;
            const w = window.innerWidth;
            const h = window.innerHeight;
            pool.x[i] = Math.random() * w;
            pool.y[i] = Math.random() * h;
            const { x, y } = resolveTarget(instruction, currentCount + n);
            pool.targetX[i] = x;
            pool.targetY[i] = y;
          }
        } else if (deficit < 0) {
          let toRelease = -deficit;
          for (let i = 0; i < pool.capacity && toRelease > 0; i++) {
            if (pool.active[i] === 1 && pool.ownerSlot[i] === ownerId) {
              pool.release(i);
              toRelease--;
            }
          }
        } else {
          // Re-target existing particles each reconcile so hover-focus redirect (spec:
          // "hovering an engine redirects nearby particles toward it") stays live.
          let seen = 0;
          for (let i = 0; i < pool.capacity; i++) {
            if (pool.active[i] === 1 && pool.ownerSlot[i] === ownerId) {
              const { x, y } = resolveTarget(instruction, seen);
              pool.targetX[i] = x;
              pool.targetY[i] = y;
              seen++;
            }
          }
        }
        if (instruction.phase === "exiting") {
          for (let i = 0; i < pool.capacity; i++) {
            if (pool.active[i] === 1 && pool.ownerSlot[i] === ownerId) pool.phase[i] = 2;
          }
        }
      });
    };

    // Network-mesh overlay (spec: Earth-illusion "network" look) — draws
    // thin lines between an instruction's own raw `targets` (not the
    // jittered dust particles), so it stays cheap regardless of density.
    // Opt-in via `instruction.connect`; every other scene's circle/nodes
    // usage leaves this undefined and is unaffected.
    const drawConnections = (instructions: Map<string, ParticleInstruction>) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const diag = Math.hypot(w, h);
      instructions.forEach((instruction) => {
        if (!instruction.connect || instruction.phase === "exiting") return;
        const targets = instruction.targets;
        if (!targets || targets.length < 2) return;
        const maxDist = (instruction.connectRadius ?? 0.14) * diag;
        const pts = targets.map((p) => ({ x: p.x * w, y: p.y * h }));
        ctx.lineWidth = 1;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i]!.x - pts[j]!.x;
            const dy = pts[i]!.y - pts[j]!.y;
            const dist = Math.hypot(dx, dy);
            if (dist >= maxDist) continue;
            const alpha = 0.16 * (1 - dist / maxDist);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pts[i]!.x, pts[i]!.y);
            ctx.lineTo(pts[j]!.x, pts[j]!.y);
            ctx.stroke();
          }
        }
      });
    };

    const draw = () => {
      for (let i = 0; i < pool.capacity; i++) {
        if (pool.active[i] !== 1) continue;
        const alpha = pool.life[i]!;
        if (alpha <= 0) {
          pool.release(i);
          continue;
        }
        const isSignal = pool.type[i] === 1;
        // Material identity override (this session, overriding ai/context/09-particle-engine.md's
        // shard-not-dust rule at explicit user direction): circular dust particles matching
        // Hero's HeroBackgroundParticles technique — soft round glow, twinkle, no rotation/shard shape.
        const twinkle = Math.sin(performance.now() * 0.002 + pool.noiseSeed[i]!) * 0.5 + 0.5;
        const twinkledAlpha = alpha * (0.75 + twinkle * 0.25);
        const size = 1.1 + pool.energy[i]! * 1.3;
        ctx.beginPath();
        ctx.arc(pool.x[i]!, pool.y[i]!, size, 0, Math.PI * 2);
        ctx.fillStyle = isSignal ? `rgba(139, 92, 246, ${0.55 * twinkledAlpha})` : `rgba(232, 232, 240, ${0.4 * twinkledAlpha})`;
        if (isSignal) {
          ctx.shadowColor = colors.purple[500];
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        if (twinkledAlpha > 0.5) {
          ctx.beginPath();
          ctx.arc(pool.x[i]!, pool.y[i]!, size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkledAlpha * (isSignal ? 0.5 : 0.35)})`;
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const mouse = mouseStore.getSnapshot();
      const snapshot = instructionStore.getSnapshot();
      reconcile(snapshot);
      for (let i = 0; i < pool.capacity; i++) {
        if (pool.active[i] === 1) stepParticle(pool, i, dt, mouse.x, mouse.y, mouse.active, reducedMotion);
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawConnections(snapshot);
      draw();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [instructionStore, mouseStore, tier, degradeFactor, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
