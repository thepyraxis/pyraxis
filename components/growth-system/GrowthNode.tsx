"use client";
import type React from "react";

import Image from "next/image";
import type { GrowthNodeData, GrowthIcon } from "./nodes";

const ICON_SRC: Record<GrowthIcon, string> = {
  website: "/icons/growth-system-48/website-globe-48.webp",
  "ai-receptionist": "/icons/growth-system-48/ai-receptionist-brain-48.webp",
  "smart-booking": "/icons/growth-system-48/smart-booking-calendar-48.webp",
  "follow-up-automation": "/icons/growth-system-48/follow-up-automation-48.webp",
  "repeat-purchase": "/icons/growth-system-48/repeat-purchase-48.webp",
  "smart-reviews": "/icons/growth-system-48/smart-reviews-star-48.webp",
  "reputation-system": "/icons/growth-system-48/reputation-shield-48.webp",
  "business-growth": "/icons/growth-system-48/business-growth-48.webp",
};

// Business Growth previously reused the shared `measure-grow.webp` (a
// 1536×1024 canvas designed for Process's icon treatment), whose wide
// canvas made object-contain letterbox the artwork vertically — it
// rendered noticeably smaller than the other 7 icons at the same box
// size no matter how much it was scaled up. Fixed at the source: it now
// has its own asset (`business-growth.webp`), cropped to its content
// bounding box and re-centered in a canvas with the same ~80% fill ratio
// as the other Growth System icons (see the icon audit in git history /
// PR notes for the exact numbers). No CSS scale override needed anymore.

interface GrowthNodeProps {
  node: GrowthNodeData;
  index: number;
  isFocused: boolean;
  isLast: boolean;
  onFocus: (index: number) => void;
  onBlur: () => void;
}

/**
 * Scene 03 — Growth System. Compact icon + title, fixed size always
 * (48px), no scaling on activation. The icon itself is always rendered in
 * its final bright, glowing state (opacity 1, brightness 1.2, two-layer
 * drop-shadow) — hover/focus no longer changes the icon at all. Hover
 * only adds two independent node-level effects: a ::before pseudo-element
 * reusing the exact Infrastructure Modules card glow (rgba(139,92,246,0.16)
 * → transparent 68%, blur 6px, -25% inset) as a background halo, fading in
 * over 240ms; and a border-color brighten. One border only, no rings, no
 * panel.
 */
export default function GrowthNode({ node, index, isFocused, isLast, onFocus, onBlur }: GrowthNodeProps) {
  return (
    <div className="flex shrink-0 items-start">
      <div className="flex w-[92px] shrink-0 flex-col items-center">
        <button
          type="button"
          onMouseEnter={() => onFocus(index)}
          onMouseLeave={onBlur}
          onFocus={() => onFocus(index)}
          onBlur={onBlur}
          aria-pressed={isFocused}
          className="group flex flex-col items-center gap-2 rounded-2xl focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400"
        >
          {/* Fixed-height icon row — independent of label line count. Glow
              reuses the exact Infrastructure Modules card treatment
              (rgba(139,92,246,0.16) → transparent 68%, blur 6px, -25%
              inset) so both sections read as one design system. */}
          <div
            className={`relative flex h-20 w-20 shrink-0 items-center justify-center before:pointer-events-none before:absolute before:inset-[-20px] before:rounded-full before:bg-[radial-gradient(circle,rgba(139,92,246,0.16),transparent_68%)] before:blur-[6px] before:transition-opacity before:duration-[240ms] before:ease-out before:content-[''] ${
              isFocused ? "before:opacity-100" : "before:opacity-0"
            }`}
          >
            <span
              className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ease-out ${
                isFocused ? "border-purple-300" : "border-purple-500/40"
              }`}
            >
              <Image
                src={ICON_SRC[node.icon]}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="relative h-12 w-12 object-contain transition-transform duration-300 ease-out"
                style={{
                  // Icon rendering is now constant — the exact "hover" look
                  // (full opacity, brightness 1.2, the original two-layer
                  // drop-shadow glow) is the icon's one and only state. No
                  // isFocused branching here anymore: hover/focus no longer
                  // touches the icon at all, it only toggles the halo
                  // (before-pseudo above) and the border color. Crisp PNG,
                  // no extra blur layers, no fuzziness — this is the same
                  // rendering that used to be gated behind isFocused.
                  opacity: 1,
                  filter:
                    "brightness(1.2) drop-shadow(0 0 5px rgba(139,92,246,1)) drop-shadow(0 0 14px rgba(139,92,246,0.7))",
                  // Business Growth: measured the actual content bounding box
                  // inside each PNG. The other 7 icons fill ~76–81% of their
                  // square canvas in both width and height. Business Growth's
                  // artwork fills ~80% width but only ~66% height — its
                  // source art is inherently wider/flatter (a bar-chart glyph)
                  // than the rounder icons it sits next to, not a bug in this
                  // component. At the current 1.16 scale its effective fill
                  // is ~93% width / ~77% height — by area it's already at or
                  // above the sibling average, so it is NOT being scaled
                  // further here; the earlier "still lighter" read was most
                  // likely the compression softness fixed above, which hits
                  // this icon's thinner linework hardest. Re-check visually
                  // before nudging this again.
                  transform: node.icon === "business-growth" ? "scale(1.16)" : undefined,
                }}
              />
            </span>
          </div>

          {/* Fixed-height label row — wraps up to 2 lines without moving anything else. */}
          <div className="flex h-10 w-full items-start justify-center">
            <span
              className={`line-clamp-2 text-center font-display text-sm leading-tight transition-colors duration-300 ${
                isFocused ? "text-ink-100" : "text-ink-300"
              }`}
            >
              {node.label}
            </span>
          </div>
        </button>
      </div>

      {!isLast && (
        <span aria-hidden="true" className="relative mx-3 hidden h-20 w-6 shrink-0 items-center justify-center sm:flex">
          <span
            className={`block text-center transition-colors duration-500 ${
              isFocused ? "text-purple-300" : "text-purple-500/40"
            }`}
          >
            →
          </span>
          {isFocused && (
            <span
              key={index}
              className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-purple-300/80 shadow-[0_0_5px_rgba(192,132,252,0.6)]"
              style={{ animation: "growth-node-travel 900ms ease-out infinite" }}
            />
          )}
        </span>
      )}
    </div>
  );
}
