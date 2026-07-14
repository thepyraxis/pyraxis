"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { createExternalStore } from "@/lib/utils/externalStore";

export interface ScrollState {
  y: number;
  progress: number;
  velocity: number;
  direction: "up" | "down" | "idle";
}

const initialScroll: ScrollState = { y: 0, progress: 0, velocity: 0, direction: "idle" };

type ScrollStore = ReturnType<typeof createExternalStore<ScrollState>>;
const ScrollContext = createContext<ScrollStore | null>(null);

/**
 * One window scroll listener for the whole app (ai/rules/coding.md #10).
 * Sections read scroll progress/velocity from this store instead of
 * mounting their own IntersectionObserver/scroll listener per component.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ScrollStore>(createExternalStore(initialScroll));

  useEffect(() => {
    const store = storeRef.current;
    let raf: number | null = null;

    const flush = () => {
      raf = null;
      const prev = store.getSnapshot();
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const velocity = y - prev.y;
      store.setState({
        y,
        progress: Math.min(1, Math.max(0, y / max)),
        velocity,
        direction: velocity > 0.5 ? "down" : velocity < -0.5 ? "up" : "idle",
      });
    };

    const handleScroll = () => {
      if (raf === null) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    flush();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return <ScrollContext.Provider value={storeRef.current}>{children}</ScrollContext.Provider>;
}

export function useScrollStore(): ScrollStore {
  const store = useContext(ScrollContext);
  if (!store) throw new Error("useScrollStore must be used within ScrollProvider");
  return store;
}
