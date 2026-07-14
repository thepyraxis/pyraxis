"use client";

import { useEffect, useState } from "react";
import { growthEngines } from "./engines";

const EXIT_MS = 180;
const ENTER_MS = 380;
const FEATURE_STEP_MS = 45;
const DESC_DELAY_MS = 90;

interface GrowthEnginePanelProps {
  activeIndex: number;
}

/**
 * Dynamic info panel under Infrastructure Modules headline. Mirrors
 * `activeIndex` from pinned card rail. Swap = uniform fade-out, then
 * staggered fade/slide-in: title → description (+90ms) → features
 * (+45ms each) → stat last. CSS transitions + delays only. A thin
 * accent bar keys off the same index as the active card, giving the
 * panel a visible tether to the rail instead of feeling detached.
 */
export default function GrowthEnginePanel({ activeIndex }: GrowthEnginePanelProps) {
  const [contentIndex, setContentIndex] = useState(activeIndex);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    if (activeIndex === contentIndex) return;

    setPhase("exit");
    const swap = setTimeout(() => {
      setContentIndex(activeIndex);
      requestAnimationFrame(() => setPhase("enter"));
    }, EXIT_MS);

    return () => clearTimeout(swap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const engine = growthEngines[contentIndex] ?? growthEngines[0]!;
  const isOut = phase === "exit";

  const base = (delayMs: number) => ({
    transitionProperty: "opacity, transform",
    transitionDuration: `${isOut ? EXIT_MS : ENTER_MS}ms`,
    transitionTimingFunction: "ease-out",
    transitionDelay: isOut ? "0ms" : `${delayMs}ms`,
    opacity: isOut ? 0 : 1,
    transform: isOut ? "translateY(8px)" : "translateY(0)",
  });

  return (
    <div className="relative mt-16 max-w-[380px] pl-5">
      {/* Connector — subtle vertical accent that ties this panel to the
          active card; brightens/re-glows on each swap instead of the
          panel feeling like a separate, disconnected block. */}
      <span
        aria-hidden="true"
        key={`connector-${contentIndex}`}
        className="absolute -left-0 top-1 h-8 w-px rounded-full bg-purple-400/70 shadow-[0_0_10px_rgba(192,132,252,0.55)]"
        style={{
          transitionProperty: "opacity, height",
          transitionDuration: `${ENTER_MS}ms`,
          transitionTimingFunction: "ease-out",
          opacity: isOut ? 0 : 1,
        }}
      />

      <h3
        style={base(0)}
        className="font-display text-[30px] font-semibold leading-tight text-ink-100"
      >
        {engine.panelTitle}
      </h3>

      <p style={base(DESC_DELAY_MS)} className="mt-3 font-display text-[15px] leading-relaxed text-ink-300">
        {engine.panelDescription}
      </p>

      <ul className="mt-4 flex flex-col gap-1.5">
        {engine.features.map((feature, i) => (
          <li
            key={feature}
            style={base(DESC_DELAY_MS + FEATURE_STEP_MS * (i + 1))}
            className="flex items-center gap-2 font-display text-[15px] text-ink-300"
          >
            <span aria-hidden="true" className="text-xs font-semibold text-purple-400">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Result — rendered as a compact badge (pill, inline value + label)
          rather than a stacked headline + caption, so it reads as a
          status chip instead of another paragraph. */}
      <div
        style={base(DESC_DELAY_MS + FEATURE_STEP_MS * (engine.features.length + 1))}
        className="mt-6 border-t border-border/60 pt-5"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 py-1.5 pl-2 pr-3.5">
          <span className="font-display text-base font-semibold leading-none text-purple-300">{engine.stat.value}</span>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-300">
            {engine.stat.label}
          </span>
        </span>
      </div>
    </div>
  );
}
