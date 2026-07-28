"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  /** Numeric part that gets counted up, e.g. 79 for "79%". Omit for stats
   * that aren't a clean single number (e.g. "2-3x" stays static, matching
   * the reference doc's own "24/7" stat). */
  target?: number;
  prefix?: string;
  suffix: string;
  caption: string;
  source: string;
};

const STATS: Stat[] = [
  { target: 79, suffix: "%", caption: "of leads never get a response.", source: "HubSpot" },
  { target: 67, suffix: "%", caption: "of customers choose a competitor due to slow response.", source: "Salesforce" },
  { target: 30, suffix: "%+", caption: "potential revenue lost due to poor follow-up.", source: "Bain & Company" },
  { prefix: "2-3", suffix: "x", caption: "more expensive to acquire a new customer vs. retain an existing one.", source: "McKinsey" },
];

/** Deduplicated, in citation order — used for the compact footnote line. */
const SOURCES = Array.from(new Set(STATS.map((s) => s.source)));

function StatValue({ stat, revealed }: { stat: Stat; revealed: boolean }) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!revealed || startedRef.current || stat.target === undefined) return;
    startedRef.current = true;

    const target = stat.target;
    const duration = 1600;
    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [revealed, stat.target]);

  if (stat.target === undefined) {
    return (
      <>
        {stat.prefix}
        {stat.suffix}
      </>
    );
  }

  return (
    <>
      {count}
      {stat.suffix}
    </>
  );
}

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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} data-reveal className="mt-16 lg:mt-20">
      <div className="flex flex-col gap-8 rounded-2xl border border-border/70 bg-card/40 p-8 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-4 border-b border-border/50 pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
          <svg viewBox="0 0 24 24" className="mt-1 h-6 w-6 shrink-0 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v10M9 10c0-1.5 1.2-2.2 3-2.2s3 .7 3 2c0 1.6-2 1.8-3 2.2-1.4.5-3 1-3 2.6 0 1.3 1.2 2.1 3 2.1s3-.7 3-2.2" />
          </svg>
          <p className="font-display text-[15px] leading-relaxed text-ink-300">
            Inefficient systems don&apos;t just hurt growth — they drain your profits every single day.
          </p>
        </div>

        {STATS.map((stat) => (
          <div key={stat.caption} className="flex-1 sm:px-6">
            <p className="font-display text-2xl font-semibold text-purple-400 sm:text-3xl tabular-nums">
              <StatValue stat={stat} revealed={revealed} />
            </p>
            <p className="mt-1 font-display text-[15px] leading-snug text-ink-300">{stat.caption}</p>
          </div>
        ))}
      </div>

      {/*
        Attribution — a stack of precise-looking percentages with no source
        reads as invented rather than persuasive. Kept intentionally quiet
        (small, muted, no borders/cards of its own) so it doesn't compete
        with the stat bar itself; it exists to be checkable, not to be read
        as headline copy.
      */}
      <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.15em] text-ink-400 sm:text-left">
        Sources: {SOURCES.join(" · ")}
      </p>
    </div>
  );
}
