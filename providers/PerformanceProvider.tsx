"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { DeviceTier } from "@/styles/tokens";

interface PerformanceState {
  tier: DeviceTier;
  /** 1 = full density budget for tier, degrades toward 0.4 under sustained low fps. */
  degradeFactor: number;
}

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "desktop";
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (isCoarsePointer && width < 768) return "mobile";
  if (isCoarsePointer && width < 1200) return "tablet";
  if (cores <= 4 && width < 1200) return "tablet";
  return "desktop";
}

const PerformanceContext = createContext<PerformanceState>({ tier: "desktop", degradeFactor: 1 });

/**
 * Detects device tier once, then watches real frame rate so the particle
 * engine's density budget can degrade under load — performance always wins
 * (ai/context/09-particle-engine.md).
 */
export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PerformanceState>({ tier: "desktop", degradeFactor: 1 });
  const frameTimes = useRef<number[]>([]);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setState((prev) => ({ ...prev, tier: detectTier() }));

    let last = performance.now();
    const sampleWindow = 60;

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      frameTimes.current.push(delta);
      if (frameTimes.current.length > sampleWindow) frameTimes.current.shift();

      if (frameTimes.current.length === sampleWindow) {
        const avg = frameTimes.current.reduce((a, b) => a + b, 0) / sampleWindow;
        const fps = 1000 / avg;
        setState((prev) => {
          const nextFactor = fps < 45 ? Math.max(0.4, prev.degradeFactor - 0.1) : Math.min(1, prev.degradeFactor + 0.05);
          return Math.abs(nextFactor - prev.degradeFactor) > 0.01 ? { ...prev, degradeFactor: nextFactor } : prev;
        });
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <PerformanceContext.Provider value={state}>{children}</PerformanceContext.Provider>;
}

export function usePerformanceTier(): PerformanceState {
  return useContext(PerformanceContext);
}
