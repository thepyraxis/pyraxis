"use client";
import type React from "react";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { whyPyraxisHeadline, whyPyraxisPoints, type WhyPyraxisIcon } from "./content";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import { TargetIcon, PerformBarsIcon, GearIcon, HandshakeHeartIcon } from "@/components/common/LineIcons";
import Section from "@/components/layout/Section";
import SectionContent from "@/components/layout/SectionContent";

const ICONS: Record<WhyPyraxisIcon, React.ComponentType<{ className?: string }>> = {
  target: TargetIcon,
  bars: PerformBarsIcon,
  gear: GearIcon,
  handshake: HandshakeHeartIcon,
};

/**
 * Scene 05 — Why PYRAXIS. Centered headline + CTA, four-icon approach
 * row spanning full width beneath. InfinityGlyph removed per request.
 */
export default function WhyPyraxis() {
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
    <Section ref={sectionRef} id="why-pyraxis" aria-label="Why PYRAXIS" className="z-0 overflow-hidden">
      <SectionContent>
        <div className="grid grid-cols-1 items-center gap-10">
          <div>
            <p data-reveal className="text-[11px] uppercase tracking-[0.3em] text-purple-400">
              {whyPyraxisHeadline.eyebrow}
            </p>
            <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.15] text-ink-100">
              {whyPyraxisHeadline.lines.map((line, i) => (
                <span
                  data-reveal
                  key={line}
                  className={`block ${i === 1 ? "italic text-purple-400" : ""}`}
                >
                  {line}
                </span>
              ))}
            </h2>
            <a
              data-reveal
              href="#portfolio"
              className="mt-8 inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              {whyPyraxisHeadline.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border/50 pt-12 sm:grid-cols-4 lg:mt-20">
          {whyPyraxisPoints.map((point) => {
            const Icon = ICONS[point.icon];
            return (
              <div data-reveal key={point.id} className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/40">
                  <Icon className="h-6 w-6 text-purple-400" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-100">{point.label}</h3>
                <p className="mt-2 max-w-[180px] font-display text-[15px] leading-relaxed text-ink-300">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </SectionContent>
    </Section>
  );
}
