"use client";

import { useEffect } from "react";

/**
 * Module-level singleton mouse tracker. One `mousemove` listener total,
 * no matter how many components call the hook below. Coordinates are
 * normalized to [-1, 1] relative to viewport center, so every consumer
 * just multiplies by its own depth constant.
 */
type MouseState = { nx: number; ny: number; active: boolean };

const mouseState: MouseState = { nx: 0, ny: 0, active: false };
let listenerRefCount = 0;

function onWindowMouseMove(e: MouseEvent) {
  mouseState.nx = (e.clientX / window.innerWidth) * 2 - 1;
  mouseState.ny = (e.clientY / window.innerHeight) * 2 - 1;
  mouseState.active = true;
}

function acquireListener() {
  listenerRefCount += 1;
  if (listenerRefCount === 1) {
    window.addEventListener("mousemove", onWindowMouseMove, { passive: true });
  }
}

function releaseListener() {
  listenerRefCount -= 1;
  if (listenerRefCount <= 0) {
    listenerRefCount = 0;
    window.removeEventListener("mousemove", onWindowMouseMove);
  }
}

type ParallaxOptions = {
  /** Max travel in px at the extreme edge of the viewport. */
  depth: number;
  /** Lerp factor per frame, 0-1. Lower = heavier/laggier. Default 0.08. */
  ease?: number;
  /** Hard disable (e.g. touch devices, or a parent-level condition). */
  disabled?: boolean;
};

/**
 * Applies a lagged parallax translate directly to `ref.current` via
 * `transform`, driven by its own requestAnimationFrame loop. No React
 * state, no re-renders — this only ever touches the DOM node's style.
 *
 */
export function useParallaxMouse<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { depth, ease = 0.08, disabled = false }: ParallaxOptions
) {
  useEffect(() => {
    if (disabled) return;

    acquireListener();

    let raf = 0;
    let destroyed = false;
    let curX = 0;
    let curY = 0;

    function tick() {
      if (destroyed) return;
      const targetX = mouseState.active ? mouseState.nx * depth : 0;
      const targetY = mouseState.active ? mouseState.ny * depth : 0;
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;

      const el = ref.current;
      if (el && (Math.abs(curX) > 0.01 || Math.abs(curY) > 0.01)) {
        el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      releaseListener();
    };
  }, [ref, depth, ease, disabled]);
}

/**
 * Very small mouse-driven 3D tilt (rotateX/rotateY), applied directly to
 * `ref.current`. This is the "expensive-feeling" cue Stripe/Linear/Apple
 * hero sections use — a degree or two, nothing more. Own rAF + lerp,
 * no state,.
 */
export function useTiltMouse<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { maxDeg = 1, ease = 0.06, disabled = false }: { maxDeg?: number; ease?: number; disabled?: boolean } = {}
) {
  useEffect(() => {
    if (disabled) return;

    acquireListener();

    let raf = 0;
    let destroyed = false;
    let curX = 0;
    let curY = 0;

    function tick() {
      if (destroyed) return;
      const targetY = mouseState.active ? mouseState.nx * maxDeg : 0; // left/right -> rotateY
      const targetX = mouseState.active ? -mouseState.ny * maxDeg : 0; // up/down -> rotateX
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;

      const el = ref.current;
      if (el) {
        el.style.transform = `perspective(1200px) rotateX(${curX.toFixed(3)}deg) rotateY(${curY.toFixed(3)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      releaseListener();
    };
  }, [ref, maxDeg, ease, disabled]);
}

/**
 * Read-only access to the eased cursor position in viewport px, for
 * components that need to position something (e.g. a glow) at the
 * cursor rather than just parallax-shift a layer. Runs its own rAF/lerp
 * and calls `onFrame` each tick — still zero React state.
 */
export function useCursorGlow(
  onFrame: (x: number, y: number, active: boolean) => void,
  { ease = 0.12, disabled = false }: { ease?: number; disabled?: boolean } = {}
) {
  useEffect(() => {
    if (disabled) return;

    acquireListener();

    let raf = 0;
    let destroyed = false;
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;

    function tick() {
      if (destroyed) return;
      const targetX = ((mouseState.nx + 1) / 2) * window.innerWidth;
      const targetY = ((mouseState.ny + 1) / 2) * window.innerHeight;
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;
      onFrame(curX, curY, mouseState.active);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      releaseListener();
    };
  }, [onFrame, ease, disabled]);
}
