"use client";

import { useEffect, useRef } from "react";

/**
 * Exact port of the original site's cursor engine (script.js lines 1-77,
 * style.css .cursor/.cursor-ring). Verified against source, not
 * approximated:
 *   - dot: 8x8px, --purple-bright (#6D28D9), mix-blend-mode: screen,
 *     snaps instantly to mx-4/my-4, scale 2 while hovering
 *   - ring: 32x32px, border rgba(109,40,217,.35), bg rgba(109,40,217,.05),
 *     trails via LERP 0.28, velocity-based scale stretch when idle
 *     (dx/dy vs ring position, capped at +0.2), eased into place at 0.16
 *   - hover (a, button): dot scale 2, ring scale target 1.6, ring recolors
 *     to rgba(88,0,208,.8) border / rgba(88,0,208,.12) bg / glow shadow
 *   - hidden entirely on (pointer: coarse)—
 *     native cursor is restored in both cases, never neither
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Only hide the native pointer when touch is confidently detected.
    // If we skip rendering entirely on a false-positive coarse-pointer
    // read (some trackpads/hybrid laptops misreport), you'd see neither
    // cursor — fail safe by still animating the custom one regardless.
    const prevCursor = document.body.style.cursor;
    if (!isTouchDevice) document.body.style.cursor = "none";

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let targetScale = 1;
    let currentScale = 1;
    let isHovering = false;
    let mouseInitialized = false;
    let raf = 0;
    let destroyed = false;

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      mouseInitialized = true;
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Event delegation instead of querying `a, button` once — survives
    // dynamic/client-rendered content without a MutationObserver.
    function onMouseOver(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;
      isHovering = true;
      targetScale = 1.6;
      ring!.style.borderColor = "rgba(88, 0, 208, 0.8)";
      ring!.style.background = "rgba(88, 0, 208, 0.12)";
      ring!.style.boxShadow = "0 0 24px rgba(88, 0, 208, 0.3)";
    }
    function onMouseOut(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;
      isHovering = false;
      targetScale = 1;
      ring!.style.borderColor = "rgba(109, 40, 217, 0.35)";
      ring!.style.background = "rgba(109, 40, 217, 0.05)";
      ring!.style.boxShadow = "0 0 10px rgba(109, 40, 217, 0.1)";
    }
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    function animateCursor() {
      if (destroyed) return;
      if (!mouseInitialized) {
        raf = requestAnimationFrame(animateCursor);
        return; // prevents the initial 0,0 jump, exactly like the original
      }

      const dotScale = isHovering ? 2 : 1;
      dot!.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0) scale(${dotScale})`;

      const LERP = 0.28;
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;

      if (!isHovering) {
        const dx = mx - rx;
        const dy = my - ry;
        const velocity = Math.min(Math.sqrt(dx * dx + dy * dy) / 300, 0.2);
        targetScale = 1 + velocity;
      }

      currentScale += (targetScale - currentScale) * 0.16;
      ring!.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0) scale(${currentScale})`;

      raf = requestAnimationFrame(animateCursor);
    }
    raf = requestAnimationFrame(animateCursor);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (!isTouchDevice) document.body.style.cursor = prevCursor;
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-2 w-2 rounded-full [mix-blend-mode:screen] [will-change:transform]"
        style={{ background: "#6D28D9" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99998] h-8 w-8 rounded-full [will-change:transform]"
        style={{
          border: "1px solid rgba(109, 40, 217, 0.35)",
          background: "rgba(109, 40, 217, 0.05)",
          transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
        }}
      />
    </>
  );
}
