"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import type Lenis from "lenis";
import { createExternalStore } from "@/lib/utils/externalStore";
import { useLenis } from "./LenisProvider";

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
 * One scroll source of truth for the whole app (ai/rules/coding.md #10).
 * Sections read scroll progress/velocity from this store instead of
 * mounting their own IntersectionObserver/scroll listener per component.
 *
 * Public ScrollState/useScrollStore shape is unchanged from the pre-Lenis
 * version (ai/specs/architecture/lenis-smooth-scroll.md Goal 2) — internally,
 * values now come from Lenis's own scroll event instead of window.scrollY,
 * since Lenis already computes progress/velocity/direction and driving a
 * second independent scroll listener would duplicate that work.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ScrollStore>(createExternalStore(initialScroll));
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const store = storeRef.current;

    const onScroll = (instance: Lenis) => {
      const velocity = instance.velocity;
      store.setState({
        y: instance.scroll,
        progress: Math.min(1, Math.max(0, instance.progress)),
        velocity,
        direction: velocity > 0.05 ? "down" : velocity < -0.05 ? "up" : "idle",
      });
    };

    lenis.on("scroll", onScroll);
    onScroll(lenis);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return <ScrollContext.Provider value={storeRef.current}>{children}</ScrollContext.Provider>;
}

export function useScrollStore(): ScrollStore {
  const store = useContext(ScrollContext);
  if (!store) throw new Error("useScrollStore must be used within ScrollProvider");
  return store;
}
