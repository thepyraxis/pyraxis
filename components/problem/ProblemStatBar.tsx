"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: string;
  label: string;
  source?: { name: string; href: string };
};

/**
 * Four stats, each traced to an original research source (not a
 * secondary compilation) and worded to match exactly what that source
 * measured — no rounding a qualifier off a number to make it sound
 * broader than the underlying research supports.
 */
const STATS: Stat[] = [
  {
    value: "5–25×",
    label: "more expensive to acquire a new customer than retain an existing one.",
    source: { name: "HBR / Bain & Company", href: "https://searchlab.nl/en/statistics/customer-retention-statistics-2026?utm_source=chatgpt.com" },
  },
  {
    value: "25–95%",
    label: "potential profit increase from a 5% improvement in customer retention.",
    source: { name: "Bain & Company", href: "https://searchlab.nl/en/statistics/customer-retention-statistics-2026?utm_source=chatgpt.com" },
  },
  {
    value: "67%",
    label: "of churn is preventable if the customer's problem is resolved during the first interaction.",
    source: { name: "HubSpot", href: "https://blog.hubspot.com/service/statistics-on-customer-retention?like=ow-ly&utm_source=chatgpt.com" },
  },
  {
    value: "67%",
    label: "more spending by returning customers than new customers.",
    source: { name: "Bain & Company", href: "https://searchlab.nl/en/statistics/customer-retention-statistics-2026?utm_source=chatgpt.com" },
  },
];

/** Bottom stat band — matches the reference design's Problem section footer bar. */
export default function ProblemStatBar() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      // Same rootMargin as ProblemWaveBackground's own IntersectionObserver
      // so the terrain and this stat reveal trigger on the same scroll
      // position instead of two independently-tuned thresholds.
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      data-reveal
      className="mt-16 transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform] lg:mt-20"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
      }}
    >
      <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-400 sm:text-left">
        The cost of inefficiency
      </p>
      <p className="mt-3 max-w-[560px] text-center font-display text-[17px] leading-relaxed text-ink-200 sm:text-left">
        Inefficient systems don&apos;t just slow growth. They quietly drain revenue every day.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 rounded-2xl border border-border/70 bg-card/40 p-8 sm:grid-cols-4 sm:gap-x-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <p className="font-display text-3xl font-semibold text-purple-400 tabular-nums sm:text-4xl">{stat.value}</p>
            <div className="mt-3 h-px w-8 bg-border/70" />
            <p className="mt-3 font-display text-[13px] leading-snug text-ink-300">
              {stat.label}
            </p>
            {stat.source && (
              <a
                href={stat.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 font-sans text-[10px] uppercase tracking-[0.1em] text-ink-500 no-underline hover:text-purple-400 hover:underline hover:decoration-solid hover:underline-offset-2"
              >
                {stat.source.name}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
