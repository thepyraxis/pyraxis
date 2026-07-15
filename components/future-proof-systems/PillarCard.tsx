"use client";

import type React from "react";
import { useCallback, useRef, useState } from "react";
import { SpreadsheetIcon, BrainIcon, HandshakeHeartIcon, ConvergeIcon, ChartUpIcon } from "@/components/common/LineIcons";
import type { FutureProofIcon } from "./content";

const ICONS: Record<FutureProofIcon, React.ComponentType<{ className?: string }>> = {
  data: SpreadsheetIcon,
  brain: BrainIcon,
  heart: HandshakeHeartIcon,
  converge: ConvergeIcon,
  growth: ChartUpIcon,
};

interface PillarCardProps {
  index: number;
  title: string;
  description: string;
  icon: FutureProofIcon;
}

/**
 * Cursor-tracked hover glow only — no lift/scale animation (glow was
 * the only thing asked for). Glow position is written directly to the
 * DOM via a ref (CSS custom properties), not React state, so pointer
 * movement never triggers a re-render — this is what was causing the
 * lag; setState on every mousemove event re-rendered the whole card
 * dozens of times a second.
 */
export default function PillarCard({ index, title, description, icon }: PillarCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[icon];

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.background = `radial-gradient(200px circle at ${x}% ${y}%, rgba(139,92,246,0.16), transparent 70%)`;
  }, []);

  return (
    <div
      ref={cardRef}
      role="group"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`relative flex w-full min-w-0 flex-col overflow-hidden rounded-[24px] border bg-card/40 p-6 transition-[border-color,box-shadow] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
        hovered
          ? "border-purple-500 shadow-[0_0_1px_rgba(139,92,246,0.9),0_0_20px_rgba(139,92,246,0.4),0_0_44px_rgba(139,92,246,0.22)]"
          : "border-border/70 shadow-[0_0_16px_rgba(139,92,246,0.06)]"
      }`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
      />

      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-purple-500/40">
        <Icon className="h-5 w-5 text-purple-400" />
      </span>
      <span className="relative mt-4 font-sans text-[11px] uppercase tracking-[0.2em] text-purple-400">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="relative mt-1 font-display text-base font-semibold text-ink-100">{title}</h3>
      <p className="relative mt-2 font-display text-[15px] leading-relaxed text-ink-300">{description}</p>
    </div>
  );
}
