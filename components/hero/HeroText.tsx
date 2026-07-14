"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";


/**
 * Copy restored verbatim from the original site's index.html
 * (.hero-headline, .hero-founder-line, .hero-subtext, .hero-trust-indicator).
 * Previous version had drifted to invented copy ("Digital Systems That
 * Attract, Convert & Grow Businesses") — this replaces it exactly.
 */
export default function HeroText() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll("[data-reveal]");
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: 18,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <h1 data-reveal className="font-display leading-[1.15]">
        <span className="block bg-gradient-to-br from-[#e8e8f8] to-[#888898] bg-clip-text pb-[0.05em] text-[clamp(34px,8vw,78px)] font-semibold text-transparent">
          Websites,
        </span>
        <span className="block bg-gradient-to-br from-[#e8e8f8] to-[#888898] bg-clip-text pb-[0.05em] text-[clamp(34px,8vw,78px)] font-semibold text-transparent">
          Automation &amp; AI Systems
        </span>
        <em className="block bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] bg-clip-text pb-[0.05em] text-[clamp(34px,8vw,78px)] font-semibold italic text-transparent">
          That Turn
        </em>
        <em className="block bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] bg-clip-text pb-[0.05em] text-[clamp(34px,8vw,78px)] font-semibold italic text-transparent">
          Leads Into Customers
        </em>
      </h1>

      <p data-reveal className="mt-[20px] font-display text-[15px] text-ink-300">
        Built by <strong className="font-semibold text-ink-200">Aman Deep Sharma</strong>, founder
        of{" "}
        <Image
          src="/pyraxis-wordmark.svg"
          alt="PYRAXIS"
          width={100}
          height={14}
          priority
          className="ml-1 inline-block h-[0.7em] w-auto translate-y-[0.08em] align-baseline"
        />
        .
      </p>

      <p data-reveal className="mt-[20px] max-w-md font-display text-base leading-relaxed text-ink-400 sm:text-lg">
        I build growth systems that attract leads, convert customers, and increase repeat business
        automatically.
      </p>

      <p
        data-reveal
        className="mt-[24px] text-[11px] uppercase tracking-[0.15em] text-ink-400"
      >
        Growth Systems Built For:{" "}
        <span className="font-semibold text-purple-500">
          Service Businesses · Coaches · Agencies · Local Businesses
        </span>
      </p>
    </div>
  );
}
