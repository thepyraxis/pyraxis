"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
// Reused from Header, not duplicated (spec §Component Specification #2 —
// "one idea, one location"). See Header.tsx's export comment.
import { LINKS } from "@/components/navigation/Header";
import { footerContact, footerCopyright, footerLegal } from "./content";
import { FOOTER_NAV_ARIA_LABEL, FOOTER_CONTENT_MAX_WIDTH_PX } from "./layout";
import { ENTRY_Y_OFFSET_PX, ENTRY_DURATION_S, ENTRY_STAGGER_S, ENTRY_EASE, ENTRY_THRESHOLD } from "./motion";
import Image from "next/image";
import Link from "next/link";

/**
 * Scene — Footer (Phase 15, ai/specs/footer.md).
 *
 * The lowest point on the page by design (spec §Emotional Goal: "Very
 * Low" intensity, the intentional floor after CTA's peak). Exactly four
 * elements — Logo, Navigation, Contact, Copyright — nothing else: no
 * second CTA, no particle spectacle, no newsletter/social/pricing. This is
 * deliberately the cheapest, quietest section to render on the whole page.
 *
 * No ParticleProvider usage here — see motion.ts's note on how the spec's
 * particle Open Question was resolved for this pass.
 */
export default function Footer() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // Visibility only — no particle instruction to send/clear here, unlike
  // every other scene's version of this effect.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: ENTRY_THRESHOLD },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Entry reveal — same data-reveal stagger pattern as every prior scene,
  // at reduced amplitude/duration (spec §Animation → Entry: "should read
  // as settling, not arriving"). This is the last section on the page, so
  // there is no exit/hand-off beat to wire up.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: ENTRY_Y_OFFSET_PX });
    if (!isSectionVisible) return;

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: ENTRY_DURATION_S,
        ease: ENTRY_EASE,
        stagger: ENTRY_STAGGER_S,
      });
    }, section);

    return () => ctx.revert();
  }, [isSectionVisible, reducedMotion]);

  return (
    <footer
      ref={sectionRef}
      id="footer"
      className="relative z-0 flex min-h-[40vh] flex-col items-center justify-center gap-10 overflow-hidden bg-[#020205] px-header py-16"
    >
      <div
        className="relative z-10 flex w-full flex-col items-center gap-8 text-center"
        style={{ maxWidth: FOOTER_CONTENT_MAX_WIDTH_PX }}
      >
        {/* Logo — same wordmark treatment as Header.tsx, not a new asset (spec §Component Specification #1). */}
        <Link data-reveal href="/" aria-label="PYRAXIS">
          <Image
            src="/pyraxis-wordmark.svg"
            alt="PYRAXIS"
            width={125}
            height={18}
            className="h-[18px] w-auto"
          />
        </Link>

        {/* Navigation — reuses Header's own LINKS array as-is (spec §Open
            Questions: "one idea, one location," not a second copy). */}
        <nav aria-label={FOOTER_NAV_ARIA_LABEL} data-reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-300 transition-colors hover:text-ink-100 focus-visible:text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact — reuses the same real WhatsApp/email deep links CTA uses (spec §Contact). */}
        <div data-reveal className="flex items-center gap-6">
          <a
            href={footerContact.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-300 transition-colors hover:text-ink-100 focus-visible:text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          >
            {footerContact.whatsapp.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            href={footerContact.email.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-300 transition-colors hover:text-ink-100 focus-visible:text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          >
            {footerContact.email.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover:w-full" />
          </a>
        </div>

        {/* Legal — real /privacy and /terms routes (ported from the
            original site), not new content. */}
        <div data-reveal className="flex items-center gap-6">
          {footerLegal.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400 transition-colors hover:text-ink-100 focus-visible:text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Copyright — single small line, year sourced at render time (spec §Component Specification #4). */}
        <p data-reveal className={cn("font-display text-[12px] text-ink-400")}>
          {footerCopyright()}
        </p>
      </div>
    </footer>
  );
}
