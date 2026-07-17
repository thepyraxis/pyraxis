"use client";

import { useEffect, useState } from "react";
import { growthNodes } from "./nodes";

const EXIT_MS = 180;
const ENTER_MS = 380;
const DESC_DELAY_MS = 90;
const STAT_DELAY_MS = 160;

interface GrowthSystemPanelProps {
  activeIndex: number | null;
}

/**
 * Shared detail panel beneath the Growth System node row. Fixed in
 * place — CSS-centered, never measured, never translated. Only the
 * content inside crossfades on swap, using the same exit-then-
 * staggered-enter pattern as the Infrastructure Modules left panel
 * (see GrowthEnginePanel.tsx): fade + translateY(8px) out over
 * EXIT_MS, swap content, then fade + translateY(0) in over ENTER_MS
 * with title → description → stat staggered in. No layout shift, no
 * position math, nothing to clip.
 *
 * `activeIndex === null` is the resting state — no auto-play, no
 * default-selected node — and shows a neutral one-line introduction
 * instead of any module's content, centered under the row.
 */
export default function GrowthSystemPanel({ activeIndex }: GrowthSystemPanelProps) {
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

  const node = contentIndex !== null ? growthNodes[contentIndex] : null;
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
    <div className="relative mt-8 flex h-[132px] w-full items-start justify-center">
      <div className="flex w-full max-w-[320px] flex-col items-center text-center px-4">
        {/* Small connective pointer — only meaningful once a node is active. */}
        <span
          aria-hidden="true"
          className="h-3 w-px bg-purple-500/40 transition-opacity duration-300"
          style={{ opacity: node ? 1 : 0 }}
        />

        <div className="mt-2">
          {node ? (
            <>
              <h3 style={base(0)} className="font-display text-2xl font-semibold text-ink-100">
                {node.label}
              </h3>
              <p
                style={base(DESC_DELAY_MS)}
                className="mx-auto mt-2 max-w-[300px] font-display text-[15px] leading-relaxed text-ink-300"
              >
                {node.benefit}
              </p>
              <div style={base(STAT_DELAY_MS)} className="mt-4 flex items-baseline justify-center gap-1.5">
                <span aria-hidden="true" className="text-lg text-purple-400">
                  ↑
                </span>
                <span className="font-display text-3xl font-semibold leading-none text-purple-300">
                  {node.stat.value}
                </span>
              </div>
              <span
                style={base(STAT_DELAY_MS)}
                className="mt-1.5 block font-sans text-[11px] uppercase tracking-[0.16em] text-ink-500"
              >
                {node.stat.label}
              </span>
            </>
          ) : (
            <>
              <h3 style={base(0)} className="font-display text-2xl font-semibold text-ink-100">
                One Connected Growth System
              </h3>
              <p
                style={base(DESC_DELAY_MS)}
                className="mx-auto mt-2 max-w-[300px] font-display text-[15px] leading-relaxed text-ink-300"
              >
                Move through each stage to discover how every module works together to turn visitors into loyal
                customers.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
