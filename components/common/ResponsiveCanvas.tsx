"use client";

import type { ReactNode } from "react";
import { usePerformanceTier } from "@/providers/PerformanceProvider";

type ResponsiveCanvasProps = {
  /** The real WebGL/canvas content — only mounted on desktop-tier devices. */
  children: ReactNode;
  /** Optional lightweight replacement shown on mobile/tablet. Omit for none. */
  fallback?: ReactNode;
};

/**
 * Gates a WebGL scene behind the app's existing device-tier detection
 * (providers/PerformanceProvider.tsx) instead of a CSS `hidden` class.
 * `hidden`/`display:none` still lets the component mount — the
 * WebGLRenderer, texture fetch, and rAF loop all start regardless of
 * whether the canvas is painted. On mobile that's wasted GPU/battery/
 * network for a scene nobody sees. This unmounts the heavy child
 * entirely on non-desktop tiers instead.
 */
export default function ResponsiveCanvas({ children, fallback = null }: ResponsiveCanvasProps) {
  const { tier } = usePerformanceTier();

  if (tier !== "desktop") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
