"use client";
import type React from "react";

import Image from "next/image";
import type { GrowthNodeData, GrowthIcon } from "./nodes";
import { SignatureNode, SignaturePath } from "@/components/signature-system";

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
 * Scene 03 — Growth System. This is the canonical Node in the site
 * (creative/SIGNATURE_MOTIF.md) — the halo/border/travel mechanics live
 * in components/signature-system now (SignatureNode + SignaturePath);
 * this file only owns what's specific to Growth System: the icon set,
 * the fixed-size label row, and the mobile-vs-desktop connector
 * orientation. Any other section adopting the motif (e.g. Future-Proof
 * Systems) reuses the same two primitives instead of copying this file.
 */
export default function GrowthNode({ node, index, isFocused, isLast, onFocus, onBlur }: GrowthNodeProps) {
  return (
    <div className="flex shrink-0 flex-col items-center sm:flex-row sm:items-start">
      <div className="flex w-[92px] shrink-0 flex-col items-center">
        <SignatureNode
          as="button"
          size="lg"
          state={isFocused ? "active" : "idle"}
          onActivate={() => onFocus(index)}
          onDeactivate={onBlur}
          className="flex-col gap-2 rounded-2xl"
        >
          <Image
            src={ICON_SRC[node.icon]}
            alt=""
            width={48}
            height={48}
            unoptimized
            className="relative h-12 w-12 object-contain transition-transform duration-300 ease-out"
            style={{
              // Icon rendering is constant — full opacity, brightness 1.2,
              // the original two-layer drop-shadow glow — regardless of
              // isFocused. Only the Node halo/border (SignatureNode)
              // reacts to focus state.
              opacity: 1,
              filter:
                "brightness(1.2) drop-shadow(0 0 5px rgba(139,92,246,1)) drop-shadow(0 0 14px rgba(139,92,246,0.7))",
              transform: node.icon === "business-growth" ? "scale(1.16)" : undefined,
            }}
          />
        </SignatureNode>

        {/* Fixed-height label row — wraps up to 2 lines without moving anything else. */}
        <div className="mt-2 flex h-10 w-full items-start justify-center">
          <span
            className={`line-clamp-2 text-center font-display text-sm leading-tight transition-colors duration-300 ${
              isFocused ? "text-ink-100" : "text-ink-300"
            }`}
          >
            {node.label}
          </span>
        </div>
      </div>

      {!isLast && (
        <>
          {/* Mobile: vertical connector between stacked steps. */}
          <SignaturePath active={isFocused} orientation="vertical" className="mt-16 sm:hidden" />
          {/* sm+: horizontal connector, shard travels when this node is active. */}
          <SignaturePath active={isFocused} orientation="horizontal" className="mx-3 hidden sm:flex" />
        </>
      )}
    </div>
  );
}
