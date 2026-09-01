"use client";

import { useRef, useState } from "react";
import type React from "react";
import { futureProofHeadline, futureProofPillars, futureProofPaths } from "./content";
import { SpreadsheetIcon, BrainIcon, HandshakeHeartIcon, ConvergeIcon, ChartUpIcon } from "@/components/common/LineIcons";
import { SignatureNode, SignaturePath } from "@/components/signature-system";
import type { FutureProofIcon } from "./content";
import Section from "@/components/layout/Section";
import SectionContent from "@/components/layout/SectionContent";
import { useSectionHandoff } from "@/hooks/useSectionHandoff";

const ICONS: Record<FutureProofIcon, React.ComponentType<{ className?: string }>> = {
  data: SpreadsheetIcon,
  brain: BrainIcon,
  heart: HandshakeHeartIcon,
  converge: ConvergeIcon,
  growth: ChartUpIcon,
};

/**
 * Scene 08 — Future-Proof Systems / "After Launch".
 *
 * Rebuilt on the Signature System (creative/SIGNATURE_MOTIF.md) instead
 * of a five-card grid: each pillar is a Node (a state the business is
 * in), each gap between them is a labeled Path (the verb that causes the
 * next state) — Customer Data *shapes* Smarter Decisions *creates*
 * Better Experience *earns* Repeat Customers *compounds into*
 * Compounding Growth. Removing a Path here would remove the actual claim
 * being made (that each stage causes the next), which is the motif's own
 * test for whether a Path belongs.
 *
 * The final node (Compounding Growth) is the Outcome — same Node
 * primitive, no special-case styling, but rendered permanently active:
 * it's the resting state the chain arrives at, not one more thing to
 * hover.
 */
export default function FutureProofSystems() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastIndex = futureProofPillars.length - 1;

  // ai/specs/architecture/section-boundary-handoff.md
  useSectionHandoff("future-proof-systems", sectionRef, "top");
  useSectionHandoff("future-proof-systems", sectionRef, "bottom");

  return (
    <Section ref={sectionRef} id="future-proof-systems" aria-label="After Launch" className="z-0 overflow-hidden">
      <SectionContent>
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-400">{futureProofHeadline.eyebrow}</p>
          <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.15] text-ink-100">
            {futureProofHeadline.heading}
            <span className="block italic text-ink-100">{futureProofHeadline.headingAccent}</span>
          </h2>
          <p className="mt-6 max-w-[380px] font-display text-base leading-relaxed text-ink-300">
            {futureProofHeadline.subline}
          </p>
          <a
            href="#cta"
            className="mt-8 inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          >
            {futureProofHeadline.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-16 flex flex-col items-stretch gap-0 lg:flex-row lg:items-start">
          {futureProofPillars.map((pillar, index) => {
            const Icon = ICONS[pillar.icon];
            const isOutcome = index === lastIndex;
            const isActive = isOutcome || activeIndex === index;

            return (
              <div key={pillar.id} className="flex flex-1 flex-col items-start lg:min-w-0">
                <div
                  className="flex items-start gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                >
                  <SignatureNode state={isActive ? "active" : "idle"} size="md">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </SignatureNode>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-400">
                      {isOutcome ? "Outcome" : `Stage ${index + 1}`}
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold text-ink-100">{pillar.title}</h3>
                    <p className="mt-1 max-w-[220px] font-display text-[14px] leading-relaxed text-ink-300">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {index < lastIndex && (
                  <>
                    <SignaturePath
                      active={activeIndex === index}
                      orientation="vertical"
                      label={futureProofPaths[index]}
                      className="ml-[27px] lg:hidden"
                    />
                    <SignaturePath
                      active={activeIndex === index}
                      orientation="horizontal"
                      label={futureProofPaths[index]}
                      className="mt-9 hidden w-full lg:flex"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </SectionContent>
    </Section>
  );
}
