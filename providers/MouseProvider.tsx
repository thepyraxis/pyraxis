"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { createExternalStore } from "@/lib/utils/externalStore";

export interface MouseState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

const idleMouse: MouseState = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

type MouseStore = ReturnType<typeof createExternalStore<MouseState>>;
const MouseContext = createContext<MouseStore | null>(null);

/**
 * One window-level pointer listener for the whole app (ai/rules/coding.md
 * #10) — sections/canvases never attach their own mousemove listeners.
 * Position updates go through an external store, not React state, so
 * consumers (the particle engine) read it inside their own rAF loop
 * instead of forcing a re-render on every pixel of movement
 * (ai/rules/performance.md).
 */
export function MouseProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<MouseStore>(createExternalStore(idleMouse));

  useEffect(() => {
    const store = storeRef.current;

    // Write synchronously on every event. The store is a plain external
    // ref (no React re-render triggered), so batching through an extra
    // internal rAF added a second, independently-scheduled RAF hop between
    // input and the particle engine's own rAF read — pure added latency,
    // no benefit.
    const handleMove = (e: PointerEvent) => {
      const prev = store.getSnapshot();
      store.setState({
        x: e.clientX,
        y: e.clientY,
        vx: e.clientX - prev.x,
        vy: e.clientY - prev.y,
        active: true,
      });
    };

    const handleLeave = () => store.setState((prev) => ({ ...prev, active: false }));

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return <MouseContext.Provider value={storeRef.current}>{children}</MouseContext.Provider>;
}

/** Read-only getter for use inside animation loops — does not subscribe/re-render. */
export function useMouseStore(): MouseStore {
  const store = useContext(MouseContext);
  if (!store) throw new Error("useMouseStore must be used within MouseProvider");
  return store;
}
