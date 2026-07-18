"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";
import { ctaHeadline } from "./content";
import { ctaActions } from "@/lib/config/contact";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";

/**
 * Scene — CTA.
 *
 * No decorative globe or static illustration here — the shared
 * ParticleEngine's ambient field is the section's atmospheric language,
 * consistent with the rest of the page, plus the existing static CSS glow
 * layer. A prior version ran concurrent shared-ParticleEngine rAF
 * instructions for a rotating "earth" ring + orbit ring, which contributed
 * to a reported lag/hang; that per-frame work is not reintroduced here.
 * An additional CSS-only ambient drift-particle layer was removed in the
 * final polish pass (ai/specs — Task 8): it was purely decorative and
 * didn't communicate anything the radial glow doesn't already carry.
 */
export default function CTA() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const primaryRef = useRef<HTMLAnchorElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => setIsSectionVisible(!!entry?.isIntersecting), {
      threshold: 0.2,
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Entry reveal — eyebrow/supporting sentence via the standard
  // data-reveal stagger; the headline uses a real clip-path mask-reveal
  // instead of a slide-up (ai/rules/animation.md #7).
  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;
    const staggerTargets = section.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(staggerTargets, { opacity: 1, y: 0 });
      gsap.set(headline, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
      return;
    }

    gsap.set(staggerTargets, { opacity: 0, y: 14 });
    gsap.set(headline, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
    if (!isSectionVisible) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(headline, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power2.inOut" });
      tl.to(staggerTargets, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 }, "<0.15");
    }, section);

    return () => ctx.revert();
  }, [isSectionVisible, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      aria-label="Get Started"
      className="relative z-0 flex min-h-screen items-center overflow-hidden bg-[#020205] px-header py-24"
    >
      {/* Subtle radial purple glow behind the content — calm, not decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full lg:left-[6%]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-container flex-col items-start text-left lg:max-w-none">
        <div className="w-full max-w-[680px]">
          <p data-reveal className="text-[11px] uppercase tracking-[0.3em] text-purple-400">
            {ctaHeadline.eyebrow}
          </p>

          <h2
            ref={headlineRef}
            className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-tight text-ink-100"
          >
            {ctaHeadline.heading}
          </h2>

          <p data-reveal className="mt-8 max-w-md font-display text-base leading-relaxed text-ink-300">
            {ctaHeadline.supporting}
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
            <a
              ref={primaryRef}
              href={ctaActions.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative inline-flex min-w-[176px] items-center justify-center overflow-hidden rounded-[2px] px-10 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white",
                "bg-gradient-to-br from-purple-vivid to-purple-700",
                "border border-purple-400/0",
                "shadow-[0_8px_32px_rgba(123,47,224,0.35)] transition-all duration-300 ease-out",
                "hover:-translate-y-[3px] hover:border-purple-300/60 hover:shadow-[0_22px_72px_rgba(123,47,224,0.65)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400",
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-75 rounded-full bg-white/25 opacity-0 blur-[24px] transition-all duration-300 ease-out group-hover:scale-150 group-hover:opacity-[0.48]"
              />
              <span className="relative">{ctaActions.primary.label}</span>
            </a>

            <a
              href={ctaActions.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex min-w-[176px] items-center justify-center rounded-[2px] border border-purple-500/60 px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-300",
                "transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400",
              )}
            >
              {ctaActions.secondary.label}
            </a>
          </div>

          {/*
            Tertiary — Email. Deliberately the quietest tier: a plain text
            link, not a button, so the visual hierarchy (Primary button >
            Secondary button > Tertiary text) matches the actual intent
            hierarchy (book a call > chat now > formal/slow-lane contact).
          */}
          <a
            data-reveal
            href={ctaActions.tertiary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-8 inline-flex w-fit items-center font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 transition-colors hover:text-ink-200 focus-visible:text-ink-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          >
            Or {ctaActions.tertiary.label.toLowerCase()} us
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover:w-full" />
          </a>
        </div>
      </div>
    </section>
  );
}
