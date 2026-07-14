"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import GrowthEnginePanel from "./GrowthEnginePanel";

interface GrowthEnginesHeadlineProps {
  activeIndex: number;
}

export default function GrowthEnginesHeadline({ activeIndex }: GrowthEnginesHeadlineProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 16 });
    let played = false;
    const ctx = gsap.context(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !played) {
              played = true;
              gsap.to(targets, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(root);
      return () => observer.disconnect();
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="max-w-[420px]">
      <p data-reveal className="text-[11px] uppercase tracking-[0.3em] text-purple-400">
        Infrastructure Modules
      </p>
      <h2
        data-reveal
        className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.15] text-ink-100"
      >
        Powerful by default.
        <span className="block italic text-purple-400">Built to scale.</span>
      </h2>
      <div data-reveal>
        <GrowthEnginePanel activeIndex={activeIndex} />
      </div>
      <a
        data-reveal
        href="#portfolio"
        className="mt-8 inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
      >
        Explore All Modules
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
