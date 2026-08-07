"use client";

import { useEffect } from "react";

type Edge = "bottom" | "top";

/**
 * Crossfades `targetRef`'s opacity based on how close `sectionRef`'s own
 * "bottom" or "top" edge is to the top of the viewport.
 *
 * This is the whole trick behind a seamless Hero -> Problem atmosphere:
 * Hero and Problem are adjacent in normal flow, so Hero's bottom edge and
 * Problem's top edge are the *same physical scroll position* — the seam.
 * Each section only ever measures its OWN edge, independently, every
 * frame. There's no shared "seam" component, no scroll-progress value
 * passed between them, no third element doing a dissolve — two
 * completely decoupled reads of the same geometry happen to line up,
 * which is what makes the crossfade feel like one continuous atmosphere
 * instead of a handoff.
 *
 * - edge "bottom" (the section that's leaving): opaque while its bottom
 *   is still comfortably below the viewport top, fading to 0 as that
 *   bottom edge rises up to and past it.
 * - edge "top" (the section that's arriving): transparent while its top
 *   is still comfortably below the viewport top, fading to 1 as that top
 *   edge rises up to and past it — i.e. as it takes over the screen.
 *
 * `fadeDistance` is how many px of scroll the crossfade spans. Kept
 * generous (default ~520px, well under one viewport) so the handoff reads
 * as a slow atmospheric shift, not a sudden cut.
 */
export function useEdgeFadeOpacity(
  targetRef: React.RefObject<HTMLElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
  edge: Edge,
  fadeDistance = 520
) {
  useEffect(() => {
    let raf = 0;
    let destroyed = false;

    // PERF FIX: this used to call section.getBoundingClientRect() inside
    // the rAF loop itself — a forced synchronous layout read, every
    // single frame, forever (not even gated to when Hero is on screen).
    // getBoundingClientRect() has to flush any pending layout before it
    // can answer, so on a page with lots of other animated elements this
    // was a recurring main-thread stall sitting right next to the
    // particle canvas's own rAF work — exactly what reads as "not
    // flowing smoothly" rather than a clean drop in fps.
    //
    // Fix: measure the section's document-relative position ONCE (and on
    // resize), then derive its current viewport position each frame from
    // window.scrollY, which is already known to the browser and never
    // forces layout.
    let sectionDocTop = 0;
    let sectionHeight = 0;

    function measure() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      sectionDocTop = rect.top + window.scrollY;
      sectionHeight = rect.height;
    }
    measure();
    window.addEventListener("resize", measure);

    function tick() {
      if (destroyed) return;
      const target = targetRef.current;
      if (target) {
        const top = sectionDocTop - window.scrollY;
        const edgeY = edge === "bottom" ? top + sectionHeight : top;
        const raw = edgeY / fadeDistance;
        const opacity =
          edge === "bottom"
            ? Math.max(0, Math.min(1, raw))
            : Math.max(0, Math.min(1, 1 - raw));
        target.style.opacity = opacity.toFixed(3);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [targetRef, sectionRef, edge, fadeDistance]);
}
