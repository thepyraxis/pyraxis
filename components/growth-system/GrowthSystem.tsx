"use client";

import { useEffect, useRef, useState } from "react";
import { growthNodes } from "./nodes";
import GrowthNode from "./GrowthNode";
import GrowthSystemPanel from "./GrowthSystemPanel";

const BLUR_RESET_MS = 250;

/**
 * Scene 03 — Growth System. Horizontal Website → AI Receptionist →
 * Smart Booking → Follow-Up Automation → Repeat Purchase → Smart Reviews
 * → Reputation System → Business Growth journey — the same 7 modules as
 * Infrastructure Modules (one source of truth, `growth-engines/engines.ts`),
 * plus one terminal outcome node. Answers "how does the system connect?";
 * Infrastructure Modules answers "what does each module do?" — the row
 * itself stays minimal (icon + title, nothing resizes, nothing clips);
 * a single shared panel below does the communicating, distinct from
 * Infrastructure Modules' own per-card panel pattern (see
 * GrowthSystemPanel.tsx for how the two are kept from feeling identical).
 *
 * No node is active on load — the panel shows a neutral intro until the
 * visitor's own hover/focus picks a node, so nothing here auto-plays.
 * Mouse-leaving the row doesn't reset instantly: it holds the last active
 * node for BLUR_RESET_MS and only falls back to the neutral state if no
 * node is hovered again within that window, so moving across adjacent
 * nodes doesn't flicker back to the intro in between.
 *
 * The panel below is fixed in place — CSS-centered, never measured or
 * translated. Only its content crossfades on swap (see
 * GrowthSystemPanel.tsx), so there's no position math and nothing to clip.
 *
 * Left column uses its own narrower local grid template (not the shared
 * `grid-cols-split` token other sections rely on) so the node row can
 * sit closer to the heading without touching column widths elsewhere
 * on the site.
 */
export default function GrowthSystem() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingReset = () => {
    if (resetTimeout.current !== null) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
  };

  // Hovering another node cancels any pending reset — the panel keeps
  // showing whichever node is now active, no flash back to the default.
  const handleFocus = (index: number) => {
    clearPendingReset();
    setActiveIndex(index);
  };

  // Leaving the row doesn't clear immediately — it keeps the last active
  // node on screen and only falls back to the default message if nothing
  // is hovered again within BLUR_RESET_MS, so moving between adjacent
  // nodes never flickers back to the neutral state in between.
  const handleBlur = () => {
    clearPendingReset();
    resetTimeout.current = setTimeout(() => {
      setActiveIndex(null);
      resetTimeout.current = null;
    }, BLUR_RESET_MS);
  };

  useEffect(() => clearPendingReset, []);

  return (
    <section
      id="growth-system"
      aria-label="The PYRAXIS growth system"
      className="relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-x-clip px-[clamp(1.5rem,5vw,3.75rem)] py-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-12 lg:grid-cols-[240px_1fr] lg:gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-purple-400">The Solution</p>
          <h2 className="mt-6 font-display text-[clamp(30px,4.8vw,44px)] font-semibold leading-[1.15] text-ink-100">
            One connected system.
            <span className="block italic text-purple-400">Endless growth.</span>
          </h2>
          <p className="mt-6 max-w-[420px] font-display text-base leading-relaxed text-ink-300">
            A seamless ecosystem that turns strangers into loyal customers and advocates.
          </p>
          <a
            href="#growth-engines"
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors hover:border-purple-400 hover:text-purple-200"
          >
            See How It Works
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="flex flex-col">
          <div
            className="no-scrollbar -mx-24 -my-24 flex items-start justify-start gap-1 overflow-x-auto px-24 py-24"
          >
            {growthNodes.map((node, index) => (
              <GrowthNode
                key={node.id}
                node={node}
                index={index}
                isLast={index === growthNodes.length - 1}
                isFocused={activeIndex === index}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            ))}
          </div>
          <GrowthSystemPanel activeIndex={activeIndex} />
        </div>
      </div>
    </section>
  );
}
