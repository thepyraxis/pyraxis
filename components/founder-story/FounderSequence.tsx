"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";

const FRAME_COUNT = 150;
const FRAME_PATH = (i: number) => `/founder-sequence/frame-${String(i).padStart(3, "0")}.webp`;
// First N frames fetched at high priority so *something* is always paintable
// fast; the tail trickles in at low priority behind hero/above-fold assets.
const HIGH_PRIORITY_FRAMES = 30;

/**
 * Module-scope cache: images are created once and survive remounts
 * (dynamic-import strict-mode remounts, route changes) so frames are
 * never re-downloaded. Unlike before, the actual network fetch is NOT
 * kicked off at module-evaluation time — 150 requests firing the moment
 * the page loads competed with hero/above-fold assets and made the whole
 * page feel slow, even though the visitor might never scroll this far.
 * `startLoading()` below is only called once the section is actually
 * near the viewport.
 */
let sharedFrames: HTMLImageElement[] | null = null;
let loadingStarted = false;

function getFrames(): HTMLImageElement[] {
  if (sharedFrames) return sharedFrames;
  const images: HTMLImageElement[] = new Array(FRAME_COUNT);
  for (let i = 1; i <= FRAME_COUNT; i += 1) {
    const img = new Image();
    img.decoding = "async";
    images[i - 1] = img;
  }
  sharedFrames = images;
  return images;
}

function startLoading() {
  if (loadingStarted) return;
  loadingStarted = true;
  const images = getFrames();
  for (let i = 1; i <= FRAME_COUNT; i += 1) {
    const img = images[i - 1];
    if (!img) continue;
    // fetchPriority hint keeps the visible-soon frames off the network's low bucket.
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
      i <= HIGH_PRIORITY_FRAMES ? "high" : "low";
    img.src = FRAME_PATH(i);
  }
}

type FounderSequenceProps = {
  className?: string;
};

/**
 * Scroll-scrubbed frame sequence — replaces the static founder portrait.
 * Frames are pre-reversed on disk (frame-001.webp === original last
 * frame), so scrolling forward through the section plays the source clip
 * backwards without any runtime index-flipping. Also draggable: click/touch
 * and drag left-right to scrub through frames by hand.
 */
export default function FounderSequence({ className }: FounderSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const currentFrameRef = useRef(1);
  const draggingRef = useRef(false);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const wrapperEl = wrapperRef.current;
    if (!canvasEl || !wrapperEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas = canvasEl;
    const wrapper = wrapperEl;
    const ctx = ctxEl;

    let destroyed = false;
    const images = getFrames();

    // Kick off the real network fetch only once this section is close to
    // the viewport (generous rootMargin so frames still have a head start
    // before the user actually scrolls into the scrub range).
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startLoading();
          loadObserver.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    loadObserver.observe(wrapper);

    function draw() {
      const frame = currentFrameRef.current;
      const img = images[frame - 1];
      if (!img || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrapper.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (canvas.width - dw) / 2;
      const dy = (canvas.height - dh) / 2;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Redraw once the currently-targeted frame actually finishes loading
    // (covers the low-priority tail arriving late), plus paint the first
    // frame the instant it's ready.
    let loadedFirst = false;
    for (let i = 0; i < images.length; i += 1) {
      const img = images[i];
      if (!img || (img.complete && img.naturalWidth)) continue;
      img.addEventListener(
        "load",
        () => {
          if (destroyed) return;
          if (!loadedFirst) {
            loadedFirst = true;
            draw();
          } else if (i + 1 === currentFrameRef.current) {
            draw();
          }
        },
        { once: true }
      );
    }
    draw();

    const onResize = () => draw();
    window.addEventListener("resize", onResize);

    // --- Drag-to-scrub: grab and drag left/right to move through frames
    // by hand, independent of scroll position. ---
    let dragStartX = 0;
    let dragStartFrame = 1;
    const DRAG_PX_PER_FRAME = 6;

    function onPointerDown(e: PointerEvent) {
      draggingRef.current = true;
      dragStartX = e.clientX;
      dragStartFrame = currentFrameRef.current;
      wrapper.setPointerCapture(e.pointerId);
      wrapper.style.cursor = "grabbing";
    }
    function onPointerMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      const deltaX = e.clientX - dragStartX;
      const frameDelta = Math.round(deltaX / DRAG_PX_PER_FRAME);
      currentFrameRef.current = Math.min(
        FRAME_COUNT,
        Math.max(1, dragStartFrame + frameDelta)
      );
      draw();
    }
    function endDrag(e: PointerEvent) {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      wrapper.style.cursor = "grab";
      try {
        wrapper.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }
    wrapper.style.cursor = "grab";
    wrapper.style.touchAction = "none";
    wrapper.addEventListener("pointerdown", onPointerDown);
    wrapper.addEventListener("pointermove", onPointerMove);
    wrapper.addEventListener("pointerup", endDrag);
    wrapper.addEventListener("pointercancel", endDrag);

    let st: ScrollTrigger | null = null;
    if (reducedMotion) {
      // Respect reduced motion: hold on the final (original-first) frame,
      // no scroll-scrub (drag still works).
      currentFrameRef.current = FRAME_COUNT;
      draw();
    } else {
      st = ScrollTrigger.create({
        trigger: wrapper.closest("section") ?? wrapper,
        // Tighter window than the full section height so the sequence
        // finishes over less scroll distance — reads as faster playback.
        start: "top 85%",
        end: "bottom 25%",
        scrub: true,
        onUpdate: (self) => {
          // Dragging takes priority — don't fight the user's hand.
          if (draggingRef.current) return;
          currentFrameRef.current = Math.min(
            FRAME_COUNT,
            Math.max(1, Math.round(self.progress * (FRAME_COUNT - 1)) + 1)
          );
          draw();
        },
      });
    }

    return () => {
      destroyed = true;
      loadObserver.disconnect();
      window.removeEventListener("resize", onResize);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerup", endDrag);
      wrapper.removeEventListener("pointercancel", endDrag);
      st?.kill();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
