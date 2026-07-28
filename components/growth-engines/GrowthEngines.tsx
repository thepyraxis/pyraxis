"use client";

import { useEffect, useRef, useState } from "react";
import { growthEngines } from "./engines";
import GrowthEngineCard from "./GrowthEngineCard";
import GrowthEnginesHeadline from "./GrowthEnginesHeadline";
import SectionContent from "@/components/layout/SectionContent";

const CARD_COUNT = growthEngines.length;
// How much extra vertical scroll room the section reserves for stepping
// through all cards while pinned, on top of the one screen it needs to
// even become sticky. Tuned so each card gets a comfortable amount of
// scroll distance without making the page absurdly long.
const STEP_VH = 55;
const PIN_HEIGHT_VH = 100 + (CARD_COUNT - 1) * STEP_VH;
// Single constant ease for the whole rail — every card gets the exact
// same glide speed, first to last. No edge cases, no distance-to-edge
// branching. That variable easing (fast near the ends, slow in the
// middle) was what produced the visible jerk/snap on the last couple
// cards — uniform weighting removes it outright.
const LERP = 0.15;

/**
 * Scene 04 — Infrastructure Modules. A true scroll-jacked, pinned rail:
 * the section is made tall (`PIN_HEIGHT_VH`), its content sticks to the
 * viewport for that whole scroll distance, and vertical scroll progress
 * through that distance drives the rail's horizontal scrollLeft directly.
 * Net effect: scroll down, the section locks in place and steps through
 * cards one by one; once the last card is reached the section's scroll
 * room is used up and the page continues scrolling down normally (same
 * going back up). No wheel-hijacking, no "jumps past the section" —
 * the browser's own scroll IS the card-stepper, so it can't desync or
 * outrun itself the way a wheel-delta accumulator could.
 */
export default function GrowthEngines() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    let raf = 0;
    let destroyed = false;
    // Eased pixel position, separate from the raw scroll-derived target —
    // this is what makes the rail glide between cards instead of jumping
    // to whatever pixel the scroll math lands on this frame.
    let currentScrollLeft = rail.scrollLeft;

    // rail.scrollWidth/clientWidth only change when the rail is resized
    // (viewport resize, font load, etc.) — not every animation frame —
    // so they're measured once up front and recached on resize, instead
    // of forcing a layout read on every tick alongside the one read
    // (getBoundingClientRect) that actually does need to run every frame.
    let maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    function measureMaxScrollLeft() {
      if (!rail) return;
      maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    }
    measureMaxScrollLeft();
    window.addEventListener("resize", measureMaxScrollLeft);
    // Local fonts can swap in slightly after mount; re-measure once they're
    // ready so a late layout shift doesn't leave maxScrollLeft stale until
    // the next window resize.
    document.fonts?.ready?.then(measureMaxScrollLeft).catch(() => {});

    function tick() {
      if (destroyed || !section || !rail) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;

      setIsSectionVisible(rect.top < window.innerHeight && rect.bottom > 0);

      if (total > 0) {
        // Straight linear map: how far scrolled through the pinned range
        // is exactly how far across the rail we should be. No buffers,
        // no split offsets — one formula for the whole range.
        const progress = Math.max(0, Math.min(1, -rect.top / total));
        const target = progress * maxScrollLeft;

        // Same ease, every card, every frame. This is what keeps card-to-
        // card motion feeling identical instead of speeding up near either
        // end of the rail.
        currentScrollLeft += (target - currentScrollLeft) * LERP;
        if (Math.abs(target - currentScrollLeft) < 0.5) currentScrollLeft = target;
        rail.scrollLeft = currentScrollLeft;

        const eased = maxScrollLeft > 0 ? currentScrollLeft / maxScrollLeft : 0;
        const idx = Math.round(eased * (CARD_COUNT - 1));
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureMaxScrollLeft);
    };
  }, []);

  // Dot-nav / card click: jump the page's own scroll position to the
  // point in the pinned range that corresponds to that card, so the
  // scroll-driven rail stays the single source of truth instead of
  // fighting a manually-set rail.scrollLeft that the next scroll tick
  // would just overwrite anyway.
  const goToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(CARD_COUNT - 1, index));
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) {
      setActiveIndex(clamped);
      return;
    }
    const targetY = window.scrollY + rect.top + (clamped / (CARD_COUNT - 1)) * total;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section
      id="growth-engines"
      aria-label="Infrastructure modules"
      ref={sectionRef}
      className="relative z-0"
      style={{ height: `${PIN_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden px-header py-section-y">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.07), transparent 65%)",
          }}
        />

        <SectionContent padded={false}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-split lg:items-center lg:gap-10">
            <GrowthEnginesHeadline activeIndex={activeIndex} />

            <div className="flex min-w-0 flex-col items-center">
              <div
                ref={railRef}
                className="no-scrollbar flex w-full items-start gap-5 overflow-x-auto px-4 pb-12 pt-12"
              >
                {growthEngines.map((engine, index) => (
                  <div
                    key={engine.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                  >
                    <GrowthEngineCard
                      engine={engine}
                      index={index}
                      active={isSectionVisible}
                      isFocused={activeIndex === index}
                      onFocus={goToIndex}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2">
                {growthEngines.map((engine, index) => (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => goToIndex(index)}
                    aria-label={`Show ${engine.title}`}
                    className={`h-1.5 rounded-full transition-all ${
                      activeIndex === index ? "w-5 bg-purple-400" : "w-1.5 bg-ink-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SectionContent>
      </div>
    </section>
  );
}
