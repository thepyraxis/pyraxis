const STATS = [
  { value: "79%", caption: "of leads never get a response.", source: "HubSpot" },
  { value: "67%", caption: "of customers choose a competitor due to slow response.", source: "Salesforce" },
  { value: "30%+", caption: "potential revenue lost due to poor follow-up.", source: "Bain & Company" },
  { value: "2-3x", caption: "more expensive to acquire a new customer vs. retain an existing one.", source: "McKinsey" },
];

/** Deduplicated, in citation order — used for the compact footnote line. */
const SOURCES = Array.from(new Set(STATS.map((s) => s.source)));

/** Bottom stat band — matches the reference design's Problem section footer bar. */
export default function ProblemStatBar() {
  return (
    <div data-reveal className="mt-16 lg:mt-20">
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
          <div key={stat.value} className="flex-1 sm:px-6">
            <p className="font-display text-2xl font-semibold text-purple-400 sm:text-3xl">{stat.value}</p>
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
