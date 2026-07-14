"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Copy matches the reference design's Problem section verbatim. */
export default function ProblemHeadline() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll("[data-reveal]");
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="max-w-[560px] text-left">
      <p data-reveal className="text-[11px] uppercase tracking-[0.3em] text-purple-400">
        The Real Problem
      </p>

      <h2
        data-reveal
        className="mt-6 font-display text-[clamp(32px,5.6vw,48px)] font-semibold leading-[1.1] tracking-[-0.01em] text-ink-100"
      >
        Broken systems cost more than
        <span className="italic text-ink-300"> you think.</span>
      </h2>

      <p data-reveal className="mt-6 max-w-[440px] font-display text-base leading-relaxed text-ink-300">
        Every missed lead, slow response, and manual follow-up is money walking away from your business.
      </p>

      <a
        data-reveal
        href="#growth-system"
        className="mt-8 inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
      >
        Let&apos;s Fix That
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
