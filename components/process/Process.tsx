"use client";
import type React from "react";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { processHeadline, processStages, type ProcessIcon } from "./content";
import { STEP_VH } from "./motion";
import Image from "next/image";

const ICON_SRC: Record<ProcessIcon, string> = {
  search: "/icons/discovery-call.webp",
  strategy: "/icons/strategy-plan.webp",
  cubes: "/icons/build-launch.webp",
  rocket: "/icons/optimize-scale.webp",
  chart: "/icons/measure-grow.webp",
};
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import Section from "@/components/layout/Section";
import SectionContent from "@/components/layout/SectionContent";

const STAGE_COUNT = processStages.length;
const PIN_HEIGHT_VH = STAGE_COUNT * STEP_VH;

// Content-only handoff — the card itself never animates (border/glow/
// shadow/size/position stay fixed); only the content inside crossfades.
// One smooth ease-out everywhere, no spring/bounce/back. Incoming starts
// before outgoing finishes so the card is never empty and never resets.
const CONTENT_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // smooth ease-out, no overshoot
const CONTENT_OUT_MS = 320;
const CONTENT_IN_MS = 320;
const CONTENT_OVERLAP_MS = 90; // incoming begins this many ms before outgoing ends
const CONTENT_IN_DELAY = CONTENT_OUT_MS - CONTENT_OVERLAP_MS;

/**
 * Crossfade (+ optional small translateY) for one piece of card content.
 * distancePx stays 0 for secondary elements (decorative number, week
 * label, badge, icon — crossfade only, per spec) and 4–6px for the
 * priority elements (title, description) so travel stays barely visible.
 */
function contentState(index: number, activeIndex: number, distancePx = 0): React.CSSProperties {
  const isActiveNow = index === activeIndex;
  const isPast = index < activeIndex;
  const offset = isActiveNow ? "0px" : `${isPast ? "-" : ""}${distancePx}px`;
  return {
    opacity: isActiveNow ? 1 : 0,
    transform: distancePx ? `translateY(${offset})` : undefined,
    transitionProperty: distancePx ? "opacity, transform" : "opacity",
    transitionDuration: `${isActiveNow ? CONTENT_IN_MS : CONTENT_OUT_MS}ms`,
    transitionTimingFunction: CONTENT_EASE,
    transitionDelay: `${isActiveNow ? CONTENT_IN_DELAY : 0}ms`,
  };
}

/**
 * Scene — Process.
 *
 * Mobile/tablet: unchanged horizontal card row.
 * Desktop (lg+): an Apple/Linear-style stacking sequence — the section
 * is made tall, each stage sticks in the same screen position as the one
 * before it, and as the user scrolls the next card simply covers the
 * previous one (z-index does the work, no manual translate math). A
 * slim energy rail alongside the stack fills upward with scroll progress
 * and highlights the node nearest the active card, carrying the
 * "timeline" read without a from-scratch particle system.
 */
export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Explicit desktop detection so the left column can get a real,
  // JS-computed inline height matching the stack's scroll distance —
  // sidesteps CSS Grid's implicit row-stretch, which has proven
  // unreliable in combination with a sticky descendant here.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Entry reveal for the left headline block — unchanged pattern.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 16 });
    // Watch the small headline block itself, not `section` — the section
    // is hundreds of vh tall (it wraps the whole pinned stack), so a
    // ratio-based threshold against its full height almost never crosses
    // 0.2 during normal scroll. Only the headline needs to be on screen.
    const watchTarget = (targets[0] as HTMLElement | undefined) ?? section;
    let played = false;
    let rafId = 0;
    let observer: IntersectionObserver | null = null;

    const play = () => {
      if (played) return;
      played = true;
      gsap.to(targets, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 });
      observer?.disconnect();
    };

    const ctx = gsap.context(() => {
      // Wait a frame so the browser's own scroll-position restore (on
      // refresh) and any late layout shifts (e.g. isDesktop's height
      // change above) have settled before we decide anything — starting
      // the observer/rect-check too early races that restore and can
      // permanently miss the reveal if the section is already scrolled
      // past by the time it's checked.
      rafId = requestAnimationFrame(() => {
        const rect = watchTarget.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        if (alreadyVisible) {
          play();
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) play();
            });
          },
          { threshold: 0.2 },
        );
        observer.observe(watchTarget);
      });
    }, section);

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      ctx.revert();
    };
  }, [reducedMotion]);

  // Scroll-driven progress through the stack: which card is "active"
  // (nearest the sticky top offset) and how far the energy rail fills.
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    let raf = 0;
    let destroyed = false;

    function tick() {
      if (destroyed || !stack) return;
      const rect = stack.getBoundingClientRect();
      const total = rect.height - window.innerHeight;

      if (total > 0) {
        const scrolledPast = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolledPast / total));
        const idx = Math.min(STAGE_COUNT - 1, Math.round(progress * (STAGE_COUNT - 1)));
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section ref={sectionRef} id="process" aria-label="Process" className="z-0">
      <SectionContent>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[40%_60%] lg:gap-16">
          {/* Left — sticky headline, stays in place while the stack scrolls
              past. Explicit JS-computed height (not CSS Grid stretch, not
              min-height) on the wrapper — the most reliable way to
              guarantee the sticky element gets genuine room for the
              entire scroll, since grid-stretch + sticky descendants
              proved unreliable here. */}
          <div style={isDesktop ? { height: `${PIN_HEIGHT_VH}vh` } : undefined}>
            <div data-reveal className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-purple-400">{processHeadline.eyebrow}</p>
              <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.15] text-ink-100">
                {processHeadline.heading}
                <span className="block italic text-purple-400">{processHeadline.headingAccent}</span>
              </h2>
              <p className="mt-6 max-w-[380px] font-display text-base leading-relaxed text-ink-300">
                {processHeadline.subline}
              </p>
              <a
                href="#future-proof-systems"
                className="mt-8 inline-flex self-start items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
              >
                {processHeadline.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Mobile/tablet — unchanged horizontal card row. */}
          <div className="flex items-start gap-2 overflow-x-auto pb-2 lg:hidden">
            {processStages.map((stage, index) => (
              <div key={stage.id} className="flex shrink-0 items-start">
                <div className="flex w-[180px] flex-col rounded-[24px] border border-border/70 bg-card/40 p-5 shadow-[0_0_16px_rgba(139,92,246,0.06)]">
                  <span className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.2em] text-purple-400">
                    {String(index + 1).padStart(2, "0")}
                    <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-purple-500/50" />
                    <span className="text-ink-500">{stage.timeframe}</span>
                  </span>
                  <Image
                    src={ICON_SRC[stage.icon]}
                    alt={stage.label}
                    width={36}
                    height={36}
                    className="mt-3 h-9 w-9 object-contain"
                  />
                  <h3 className="mt-3 font-display text-base font-semibold text-ink-100">{stage.label}</h3>
                  <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full border border-purple-500/25 bg-purple-500/[0.08] px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-purple-300">
                    <span aria-hidden="true">✓</span>
                    {stage.outcome}
                  </span>
                  <p className="mt-2 font-display text-[15px] leading-relaxed text-ink-300">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop — sticky stacking sequence. */}
          <div ref={stackRef} className="relative hidden lg:block" style={{ height: `${PIN_HEIGHT_VH}vh` }}>
            {processStages.map((stage, index) => {
              return (
                <div key={stage.id} className="relative" style={{ height: `${STEP_VH}vh` }}>
                  <div
                    className="sticky top-0 flex h-screen items-center pl-12"
                    style={{ zIndex: index + 1 }}
                  >
                    <div className="relative w-full max-w-[480px]">
                      {/* Card container — permanently static. Border, glow,
                          shadow, size, and position never animate; only
                          the content inside it crossfades, so this reads
                          as one object updating, never a swap. */}
                      <div
                        className="relative w-full rounded-[24px] border border-purple-400/70 p-8 shadow-[0_0_1px_rgba(139,92,246,0.9),0_0_32px_rgba(139,92,246,0.45),0_0_80px_rgba(139,92,246,0.25)] backdrop-blur-md"
                        style={{
                          background: "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.1), rgba(255,255,255,0.02))",
                        }}
                      >
                        {/* Decorative stage number — same design language as the
                            Infrastructure Modules cards (large, italic, low
                            opacity, top-left corner, behind everything, purely
                            background texture). Positioned to ignore this
                            card's own padding (absolute offsets are relative
                            to the padding box, not inset by it) so it sits in
                            the corner whitespace; the header row below gets a
                            small mt-4 so its top edge (y≈48px from the card
                            border) clears the numeral's line box (bottom
                            edge ≈44px at this -top-3/text-[56px] combination)
                            with a few px to spare — real, measured clearance,
                            not just occlusion. */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-[19px] top-[-3px] z-0 select-none font-display text-[56px] font-semibold italic leading-none text-purple-400/[0.10]"
                          style={contentState(index, activeIndex)}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Two-column header — icon becomes the visual anchor
                            instead of a small floating mark with empty space
                            beside it. Icon column keeps its exact glow
                            treatment (same radial-gradient + blur(10px), same
                            opacity/active values), just resized from 56px to
                            80px and no longer centered. Right column stacks
                            week label → title → deliverable badge, vertically
                            centered against the icon via the row's default
                            stretch + this column's justify-center, so the
                            title reads as aligned with the icon. */}
                        {/* Content group — wrapped once so the whole block
                            (header row + description) shifts right together
                            via a single ml-8 (32px, within the 24–40px
                            target). Internal spacing (mt-4 before the header
                            row, mt-5 before the description, gap-5 between
                            icon/text) is untouched — only the group's
                            horizontal position relative to the card/decorative
                            number changes, giving the numeral breathing room
                            without moving it or resizing anything. */}
                        <div className="ml-[46px]">
                          <div className="relative z-10 mt-4 flex items-stretch gap-5">
                            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-[-15%] rounded-full"
                                style={{
                                  background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)",
                                  filter: "blur(10px)",
                                  ...contentState(index, activeIndex),
                                  opacity: index === activeIndex ? 1 : 0.35,
                                }}
                              />
                              <Image
                                src={ICON_SRC[stage.icon]}
                                alt={stage.label}
                                width={96}
                                height={96}
                                className="relative h-24 w-24 object-contain"
                                style={contentState(index, activeIndex)}
                              />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                              <span
                                className="flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-400"
                                style={contentState(index, activeIndex)}
                              >
                                <span className="text-ink-500">{stage.timeframe}</span>
                              </span>
                              <h3
                                className="mt-2 font-display text-xl font-semibold text-ink-100"
                                style={contentState(index, activeIndex, 5)}
                              >
                                {stage.label}
                              </h3>
                              <span
                                className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-500/[0.08] px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-purple-300"
                                style={contentState(index, activeIndex)}
                              >
                                <span aria-hidden="true">✓</span>
                                {stage.outcome}
                              </span>
                            </div>
                          </div>

                          <p
                            className="relative z-10 mt-5 -mr-8 max-w-[418px] pr-2 font-display text-[15px] leading-relaxed text-ink-300"
                            style={contentState(index, activeIndex, 4)}
                          >
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Progress dots — a single independent instance, decoupled from
                any individual card. `absolute inset-0` gives this zero
                flow-height footprint (so it can't get pushed past the
                stack's fixed-height bottom edge the way a normal-flow
                sibling would); the inner sticky child then gets the full
                650vh of genuine room to stay pinned dead-center for the
                whole scroll. Only the active dot's highlight updates. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
              <div className="sticky top-0 flex h-screen items-center pl-12">
                <div className="relative w-full max-w-[480px]">
                  <div
                    className="absolute left-full top-1/2 ml-14 flex -translate-y-1/2 flex-col items-center gap-3 transition-opacity duration-500 ease-out"
                    style={{ opacity: activeIndex > 0 && activeIndex < STAGE_COUNT - 1 ? 1 : 0 }}
                  >
                    {processStages.map((s, i) => (
                      <span
                        key={s.id}
                        className={`h-1.5 rounded-full transition-[background-color,opacity] duration-[240ms] ease-out ${
                          activeIndex === i ? "w-5 bg-purple-400" : "w-1.5 bg-ink-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>
    </Section>
  );
}
