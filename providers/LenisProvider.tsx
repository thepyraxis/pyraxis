"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Single Lenis instance for the whole app (ai/specs/architecture/lenis-smooth-scroll.md).
 * Mounts once, outermost of the scroll-related providers — ScrollProvider reads
 * scroll position from Lenis instead of window.scrollY once this is in the tree.
 *
 * Lenis's RAF is driven by gsap.ticker (not its own requestAnimationFrame loop)
 * so there is exactly one animation loop driving both scroll and ScrollTrigger,
 * per ai/rules/architecture.md #2 (never build systems outside the global GSAP
 * loop) and #8 (five-year test: swapping the scroll engine shouldn't require
 * touching every section's ScrollTrigger calls — and it doesn't, because
 * ScrollTrigger keeps reading native document scroll position; Lenis just
 * smooths how that position changes).
 */
const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ai/rules/animation.md #10: never fully disable — keep it feeling native
    // instead of removing smoothing’s benefit (e.g. still-passive wheel handling).
    const lenis = new Lenis({
      duration: reduceMotion ? 0.1 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: reduceMotion ? 1 : 1.5,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
}

/**
 * Returns the Lenis instance, or null before mount / on the server.
 * Use for imperative control only (lenis.stop() / lenis.start() / lenis.scrollTo()).
 * Do NOT read scroll position here — use useScrollStore() from ScrollProvider instead.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
