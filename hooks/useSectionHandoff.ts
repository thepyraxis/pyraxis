"use client";

import { useEffect } from "react";
import { useScrollStore } from "@/providers/ScrollProvider";
import { useParticles } from "@/providers/ParticleProvider";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import type { ParticleInstruction } from "@/components/three/particleTypes";

type Edge = "top" | "bottom";

interface HandoffOptions {
  /** Fraction of viewport height the ramp spans, 0-1. Default 0.2 (~20%). */
  rampFraction?: number;
  /** Peak share of the device density budget during the handoff. Kept small
   *  on purpose — this is connective dust between sections, not a section's
   *  own primary effect. See ai/specs/architecture/section-boundary-handoff.md. */
  peakDensity?: number;
}

/**
 * Sends a small, additional instruction to the shared particle engine as a
 * section's own edge crosses near the viewport edge — the shared "bridge"
 * dust between adjacent sections (ai/specs/architecture/
 * section-boundary-handoff.md). This does NOT touch or replace whatever
 * local canvas that section already renders; it is a second, independent,
 * low-density instruction under its own sourceId.
 *
 * - edge "bottom" (section leaving the viewport, i.e. the outgoing side of
 *   a boundary): density ramps from peakDensity down to 0 as the section's
 *   own bottom edge rises from rampFraction*viewportHeight above the
 *   viewport bottom up to the viewport bottom itself. phase: "exiting".
 * - edge "top" (section arriving, i.e. the incoming side of a boundary):
 *   density ramps from 0 up to peakDensity as the section's own top edge
 *   falls from the viewport bottom up to rampFraction*viewportHeight below
 *   the viewport top. phase: "entering".
 *
 * Two decoupled reads of the same physical scroll range (like
 * useEdgeFadeOpacity) — no shared state passed between adjacent sections,
 * each just measures its own edge.
 *
 * Skipped entirely under prefers-reduced-motion (no sendInstruction call at
 * all) — ai/rules/animation.md #10.
 */
export function useSectionHandoff(
  sourceId: string,
  sectionRef: React.RefObject<HTMLElement | null>,
  edge: Edge,
  options: HandoffOptions = {}
) {
  const { rampFraction = 0.2, peakDensity = 0.04 } = options;
  const { sendInstruction, clearInstruction } = useParticles();
  const scrollStore = useScrollStore();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const instructionId = `handoff-${sourceId}-${edge}`;

    const apply = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const rampPx = vh * rampFraction;

      let density: number;
      let phase: ParticleInstruction["phase"];

      if (edge === "bottom") {
        // Fully visible (bottom well below viewport bottom): no handoff yet.
        // As rect.bottom approaches 0 (viewport bottom) from above, ramp up;
        // once it crosses past viewport bottom, ramp back down to 0.
        const distanceToBottom = rect.bottom - vh;
        const raw = 1 - Math.abs(distanceToBottom) / rampPx;
        density = Math.max(0, Math.min(1, raw)) * peakDensity;
        phase = "exiting";
      } else {
        // Section arriving: as rect.top approaches viewport top, ramp up;
        // once it crosses past, ramp back down.
        const raw = 1 - Math.abs(rect.top) / rampPx;
        density = Math.max(0, Math.min(1, raw)) * peakDensity;
        phase = "entering";
      }

      if (density <= 0.001) {
        clearInstruction(instructionId);
        return;
      }

      sendInstruction({
        sourceId: instructionId,
        shape: "scatter",
        density,
        phase,
        particleType: "ambient",
      });
    };

    // Was: every section's every edge (~20 across the site) subscribed to
    // the scroll store unconditionally, so every Lenis scroll update fired
    // ~20 getBoundingClientRect() layout reads regardless of whether that
    // section's boundary was anywhere near the viewport. An edge can only
    // possibly be inside its ramp distance while the section itself is
    // within roughly a viewport of the screen, so gate the scroll-store
    // subscription behind an IntersectionObserver with that margin — far
    // sections do zero work per scroll tick instead of one geometry read.
    const section = sectionRef.current;
    if (!section) return;

    let unsubscribe: (() => void) | null = null;
    const subscribe = () => {
      if (unsubscribe) return;
      apply();
      unsubscribe = scrollStore.subscribe(apply);
    };
    const unsubscribeAll = () => {
      unsubscribe?.();
      unsubscribe = null;
      clearInstruction(instructionId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) subscribe();
        else unsubscribeAll();
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      unsubscribeAll();
    };
  }, [sourceId, edge, sectionRef, rampFraction, peakDensity, sendInstruction, clearInstruction, scrollStore, reducedMotion]);
}
