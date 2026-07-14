"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const AnimationContext = createContext<boolean>(false);

/**
 * Single source of truth for `prefers-reduced-motion`. Sections read this
 * instead of each running their own matchMedia listener (ai/rules/coding.md
 * #10). Per ai/rules/animation.md #10, consumers should substitute opacity
 * for morphing and reduce density — never fully disable animation.
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return <AnimationContext.Provider value={reduced}>{children}</AnimationContext.Provider>;
}

export function usePrefersReducedMotion(): boolean {
  return useContext(AnimationContext);
}
