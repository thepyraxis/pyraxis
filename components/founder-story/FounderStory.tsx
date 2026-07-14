"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { founderStoryContent } from "./content";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";

const initials = founderStoryContent.founderName
  .split(" ")
  .map((part) => part[0])
  .join("");

/**
 * Scene — Founder Story. Sits between Portfolio (Proof) and Process (How
 * we work): the one deliberately quiet section on the page, answering
 * "why does PYRAXIS exist" before the visitor moves into procedural
 * territory again. No ambient particles, no glow wash, no scroll-scrub —
 * just the same fade/opacity/small-upward-move reveal WhyPyraxis already
 * uses (IntersectionObserver + data-reveal + GSAP stagger), so motion
 * intensity actually drops here rather than merely reusing a component
 * that happens to look calm.
 *
 * No fabricated portrait photo — a bordered initials mark instead, same
 * "don't invent what isn't real" approach as Portfolio's placeholders.
 */
export default function FounderStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(!!entry?.isIntersecting), { threshold: 0.3 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 14 });
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      gsap.to(targets, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 });
    }, section);

    return () => ctx.revert();
  }, [isVisible, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="founder-story"
      aria-label="Founder Story"
      className="relative z-0 px-6 py-24 lg:px-[60px]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1240px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_260px]">
          <div>
            <p data-reveal className="text-[11px] uppercase tracking-[0.3em] text-purple-400">
              {founderStoryContent.eyebrow}
            </p>
            <h2 data-reveal className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.15] text-ink-100">
              {founderStoryContent.heading}
            </h2>

            <p data-reveal className="mt-8 max-w-[480px] font-display text-2xl font-semibold leading-snug text-ink-100 md:text-[28px]">
              {founderStoryContent.statement}
            </p>

            <div className="mt-5 flex max-w-[440px] flex-col gap-1.5">
              {founderStoryContent.supportingSentences.map((sentence) => (
                <p data-reveal key={sentence} className="font-display text-base leading-relaxed text-ink-300">
                  {sentence}
                </p>
              ))}
            </div>

            <div data-reveal className="mt-8 border-t border-border/50 pt-6">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink-100">
                {founderStoryContent.founderName}
              </p>
              <p className="mt-1 font-display text-[15px] text-ink-500">{founderStoryContent.founderTitle}</p>
            </div>
          </div>

          {/* Portrait placeholder — no fabricated photo, a plain initials
              mark instead. Quiet: a border only, no glow, no motion of
              its own beyond the shared fade-up.

              TODO(production): replace this <span> with a real photo of
              Aman Deep Sharma before launch. Swap it for:
                <Image
                  src="/founder-portrait.jpg"   // drop the file in /public
                  alt="Aman Deep Sharma, Founder of PYRAXIS"
                  width={260}
                  height={260}
                  className="h-[220px] w-[220px] rounded-full border border-border/60 object-cover lg:h-[260px] lg:w-[260px]"
                />
              Keep the same `data-reveal` wrapper div and the same
              220px/260px sizing so no other spacing/layout in this
              section needs to change. No AI-generated artwork — a real
              photo only. */}
          <div data-reveal className="flex justify-center lg:justify-end">
            <span className="flex h-[220px] w-[220px] items-center justify-center rounded-full border border-border/60 font-display text-4xl font-semibold text-ink-500 lg:h-[260px] lg:w-[260px]">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
