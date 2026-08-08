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

// Split in two: `tier` is near-static (set once, rarely changes) but
// `degradeFactor` updates on every fps sample once the app dips under
// 45fps — that's every rAF tick for several frames in a row during any
// heavy scene (Hero's particle+logo+cursor stack, Problem's scroll-in
// wave/fountain/icon-assemble burst). Bundling both into one context
// object meant EVERY consumer re-rendered on EVERY degradeFactor tick,
// even ones that only ever read `tier` — and `ParticleEngine` had
// `degradeFactor` in its effect's dependency array, so its whole rAF
// loop + resize listener got torn down and rebuilt on every tick too.
// Net effect: a brief fps dip cascaded into a global re-render/remount
// storm that read as the whole page "hanging" right when scroll or
// playback was already under load — the storm caused by the very thing
// meant to relieve load. Two contexts means a degradeFactor tick only
// re-renders whoever actually reads degradeFactor.
const TierContext = createContext<DeviceTier>("desktop");
const DegradeContext = createContext<number>(1);

/**
 * Detects device tier once, then watches real frame rate so the particle
 * engine's density budget can degrade under load — performance always wins
 * (ai/context/09-particle-engine.md).
 */
export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<DeviceTier>("desktop");
  const [degradeFactor, setDegradeFactor] = useState(1);
  const frameTimes = useRef<number[]>([]);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setTier(detectTier());

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
        setDegradeFactor((prev) => {
          const nextFactor = fps < 45 ? Math.max(0.4, prev - 0.1) : Math.min(1, prev + 0.05);
          return Math.abs(nextFactor - prev) > 0.01 ? nextFactor : prev;
        });
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <TierContext.Provider value={tier}>
      <DegradeContext.Provider value={degradeFactor}>{children}</DegradeContext.Provider>
    </TierContext.Provider>
  );
}

/**
 * Back-compat combined hook — still returns both, but now composed from
 * two contexts. Prefer `usePerformanceTierOnly()` in components that
 * never read `degradeFactor` (Hero/Problem/Globe canvases), so they stop
 * re-rendering on every fps-driven degradeFactor tick.
 */
export function usePerformanceTier(): PerformanceState {
  const tier = useContext(TierContext);
  const degradeFactor = useContext(DegradeContext);
  return { tier, degradeFactor };
}

export function usePerformanceTierOnly(): DeviceTier {
  return useContext(TierContext);
}

export function useDegradeFactor(): number {
  return useContext(DegradeContext);
}
