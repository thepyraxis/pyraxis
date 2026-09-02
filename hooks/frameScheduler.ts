"use client";

/**
 * One shared requestAnimationFrame scheduler for lightweight DOM/mouse work.
 * Consumers register a callback and the scheduler owns the single RAF.
 */
type FrameCallback = (time: number) => void;

const callbacks = new Set<FrameCallback>();
let rafId = 0;

function frame(time: number) {
  rafId = 0;
  for (const callback of callbacks) callback(time);
  if (callbacks.size > 0) rafId = requestAnimationFrame(frame);
}

export function registerFrame(callback: FrameCallback) {
  callbacks.add(callback);
  if (!rafId) rafId = requestAnimationFrame(frame);
}

export function unregisterFrame(callback: FrameCallback) {
  callbacks.delete(callback);
  if (callbacks.size === 0 && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}
