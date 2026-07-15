import { futureProofHeadline, futureProofPillars, type FutureProofIcon } from "./content";
import type React from "react";
import { SpreadsheetIcon, BrainIcon, HandshakeHeartIcon, ConvergeIcon, ChartUpIcon } from "@/components/common/LineIcons";

const ICONS: Record<FutureProofIcon, React.ComponentType<{ className?: string }>> = {
  data: SpreadsheetIcon,
  brain: BrainIcon,
  heart: HandshakeHeartIcon,
  converge: ConvergeIcon,
  growth: ChartUpIcon,
};

/**
 * Scene 08 — Future-Proof Systems / "After Launch". Headline + CTA on the
 * left, a five-card cause-and-effect chain on the right connected by
 * arrows — same shell as before. Answers "what happens after launch,"
 * not "what features do we have": each pillar is the direct reason the
 * next one happens (Customer Data → Smarter Decisions → Better
 * Experience → Repeat Customers → Compounding Growth), handing the
 * visitor straight into the CTA. Static SVG icons (LineIcons) — no
 * canvas, no rAF; `layout.ts`/`motion.ts` in this folder are unrelated
 * leftover particle-geometry constants actually consumed by
 * components/cta, not by this component — intentionally untouched.
 */
export default function FutureProofSystems() {
  return (
    <section
      id="future-proof-systems"
      aria-label="After Launch"
      className="relative z-0 overflow-hidden px-[clamp(1.5rem,5vw,3.75rem)] py-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1240px]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-purple-400">{futureProofHeadline.eyebrow}</p>
          <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.15] text-ink-100">
            {futureProofHeadline.heading}
            <span className="block italic text-purple-400">{futureProofHeadline.headingAccent}</span>
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

        <div className="mt-12 flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:gap-3">
          {futureProofPillars.map((pillar, index) => {
            const Icon = ICONS[pillar.icon];
            return (
              <div key={pillar.id} className="flex flex-1 items-start lg:min-w-0">
                <div className="flex w-full min-w-0 flex-col rounded-[24px] border border-border/70 bg-card/40 p-6 shadow-[0_0_16px_rgba(139,92,246,0.06)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-500/40">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </span>
                  <span className="mt-4 font-sans text-[11px] uppercase tracking-[0.2em] text-purple-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-display text-base font-semibold text-ink-100">{pillar.title}</h3>
                  <p className="mt-2 font-display text-[15px] leading-relaxed text-ink-300">{pillar.description}</p>
                </div>
                {index < futureProofPillars.length - 1 && (
                  <span aria-hidden="true" className="mt-16 hidden shrink-0 px-1 text-purple-500/60 lg:block">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
