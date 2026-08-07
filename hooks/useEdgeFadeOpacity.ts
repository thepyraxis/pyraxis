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
    let scheduled = false;
    let destroyed = false;

    function apply() {
      scheduled = false;
      if (destroyed) return;
      const section = sectionRef.current;
      const target = targetRef.current;
      if (section && target) {
        const rect = section.getBoundingClientRect();
        const edgeY = edge === "bottom" ? rect.bottom : rect.top;
        const raw = edgeY / fadeDistance;
        const opacity =
          edge === "bottom"
            ? Math.max(0, Math.min(1, raw))
            : Math.max(0, Math.min(1, 1 - raw));
        target.style.opacity = opacity.toFixed(3);
      }
    }

    // Was: an unconditional requestAnimationFrame loop calling
    // getBoundingClientRect (forces a synchronous layout read) every
    // single frame for the entire page lifetime, even miles past this
    // section. Scroll position only changes on scroll/resize, so drive
    // this off those events instead — rAF-batched so bursts of scroll
    // events collapse to one layout read per frame, same pattern as
    // ProblemWaveBackground's own onScroll handler.
    function onScrollOrResize() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      destroyed = true;
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [targetRef, sectionRef, edge, fadeDistance]);
}
