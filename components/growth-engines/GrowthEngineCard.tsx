"use client";

import Image from "next/image";
import type { GrowthEngineData } from "./engines";

const ICON_SRC: Record<GrowthEngineData["icon"], string> = {
  website: "/icons/website-globe.webp",
  "ai-receptionist": "/icons/ai-receptionist-brain.webp",
  "smart-booking": "/icons/smart-booking-calendar.webp",
  "follow-up-automation": "/icons/follow-up-automation.webp",
  "repeat-purchase": "/icons/repeat-purchase.webp",
  "smart-reviews": "/icons/smart-reviews-star.webp",
  "reputation-system": "/icons/reputation-shield.webp",
};

interface GrowthEngineCardProps {
  engine: GrowthEngineData;
  index: number;
  active: boolean;
  isFocused: boolean;
  onFocus: (index: number) => void;
}

/** One infrastructure-module card — fixed 244×288 footprint (narrowed
 *  from 270px for a more portrait-leaning proportion) so every card in
 *  the rail lines up top and bottom regardless of copy length. Icon →
 *  title (clamped 2 lines) → description (clamped 2 lines) → flexible
 *  spacer eats any leftover height; bottom padding stays fixed. The module
 *  number is a large italic low-opacity numeral anchored to the top-left
 *  corner — decorative background texture, not a UI label — so hierarchy
 *  reads icon → title → description, matching the original HTML version. */
export default function GrowthEngineCard({ engine, index, isFocused, onFocus }: GrowthEngineCardProps) {
  return (
    <div
      role="group"
      aria-label={`${engine.title}: ${engine.description}`}
      tabIndex={0}
      onFocus={() => onFocus(index)}
      className={`relative flex h-[288px] w-[244px] shrink-0 flex-col overflow-hidden rounded-[24px] border bg-card/40 px-6 pb-6 pt-7 text-left transition-[border-color,box-shadow,transform] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
        isFocused
          ? "-translate-y-1 border-purple-500 shadow-[0_0_1px_rgba(139,92,246,0.9),0_0_14px_rgba(139,92,246,0.45),0_0_34px_rgba(139,92,246,0.25)]"
          : "border-border/70 shadow-[0_0_16px_rgba(139,92,246,0.06)]"
      }`}
    >
      {/* Decorative module number — large, italic, low opacity, anchored
          into the top-left corner and rendered behind the content stack.
          Purely background texture: aria-hidden, no layout weight, never
          competes with the title for attention. Restored to the intended
          60–64px hierarchy; clearance from the icon (which starts at
          x≈76px in this card's 244px width) is handled by pulling the
          numeral tighter into the corner (-top-3 left-3, instead of the
          previous -top-2 left-4) and trimming its opacity slightly,
          rather than shrinking the type size. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 left-3 z-0 select-none font-display text-[62px] font-semibold italic leading-none text-purple-400/[0.10] transition-opacity duration-300 ease-out"
        style={{ opacity: isFocused ? 0.85 : 0.6 }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon — fixed-height slot, so it sits at the same Y on every card.
          Enlarged so it reads as the clear focal point above the title.
          Glow intensifies slightly on the active card. */}
      <div className="relative z-10 mx-auto flex h-[92px] w-[92px] shrink-0 items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-25%] rounded-full transition-opacity duration-300 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.16), transparent 68%)",
            filter: "blur(6px)",
            opacity: isFocused ? 1 : 0.65,
          }}
        />
        <Image
          src={ICON_SRC[engine.icon]}
          alt={engine.title}
          width={92}
          height={92}
          className="relative aspect-square w-full object-contain"
        />
      </div>

      {/* Content stack — slightly dimmed at rest, full brightness on the
          active card, so focus reads through content weight too, not
          only the border. Title now leads (the small number badge is
          gone from the flow — it lives as the decorative corner mark
          above), so hierarchy is icon → title → description. */}
      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col transition-opacity duration-300 ease-out"
        style={{ opacity: isFocused ? 1 : 0.82 }}
      >
        <h3 className="mt-4 line-clamp-2 shrink-0 font-display text-[19px] font-semibold leading-snug text-ink-100">
          {engine.title}
        </h3>
        <p className="mt-1 line-clamp-2 shrink-0 font-display text-[13px] leading-normal text-ink-300">
          {engine.description}
        </p>

        {/* Flexible spacer — absorbs whatever height 2 clamped lines don't
            use, so shorter copy doesn't collapse the card and longer copy
            never grows it. */}
        <div className="flex-1" aria-hidden="true" />
      </div>
    </div>
  );
}
