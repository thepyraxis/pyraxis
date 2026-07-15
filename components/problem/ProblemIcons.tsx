"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

const SYMPTOMS = [
  { icon: "/icons/missed-leads.webp", title: "Missed Leads", caption: "Inquiries go unanswered." },
  { icon: "/icons/lost-bookings.webp", title: "Lost Bookings", caption: "Potential customers book elsewhere." },
  { icon: "/icons/no-follow-up.webp", title: "No Follow-Up", caption: "Leads go cold without nurture." },
  { icon: "/icons/weak-retention.webp", title: "Weak Retention", caption: "Customers don't come back." },
];

/**
 * Cursor-tracked hover glow, perf-hardened:
 * - rect cached once on pointerenter (not re-read via getBoundingClientRect
 *   on every mousemove — that forces a synchronous layout recalculation
 *   per event, the main source of the jank, worse here since Problem
 *   already runs a continuous particle canvas competing for the frame).
 * - style writes coalesced to at most one per animation frame via rAF,
 *   so a burst of mousemove events (can fire 60-120+/sec) collapses to
 *   the browser's actual paint rate.
 * - direct DOM style writes (no React state), so pointer movement never
 *   triggers a re-render.
 */
function SymptomCard({ icon, title, caption }: { icon: string; title: string; caption: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const flush = useCallback(() => {
    rafRef.current = null;
    const glow = glowRef.current;
    const pending = pendingRef.current;
    if (!glow || !pending) return;
    // transform only -> compositor thread, no style/paint recalculation
    glow.style.transform = `translate3d(${pending.x}px, ${pending.y}px, 0)`;
  }, []);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setHovered(true);
    const rect = cardRef.current?.getBoundingClientRect() ?? null;
    rectRef.current = rect;
    if (rect && glowRef.current) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pendingRef.current = { x, y };
      glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const handleFocus = useCallback(() => {
    setHovered(true);
    const rect = cardRef.current?.getBoundingClientRect() ?? null;
    rectRef.current = rect;
    if (rect && glowRef.current) {
      const x = rect.width / 2;
      const y = rect.height / 2;
      pendingRef.current = { x, y };
      glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    pendingRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handlePointerLeave}
      tabIndex={0}
      className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center transition-[border-color] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 -ml-[90px] -mt-[90px] h-[180px] w-[180px] rounded-full transition-opacity duration-300 will-change-transform ${hovered ? "opacity-100" : "opacity-0"}`}
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)" }}
      />

      <div className="relative flex aspect-square w-full max-w-[160px] items-center justify-center">
        <Image
          src={icon}
          alt={title}
          width={160}
          height={160}
          className="relative aspect-square w-full object-contain"
        />
      </div>
      <h3 className="relative mt-5 font-display text-lg font-semibold text-ink-100">{title}</h3>
      <p className="relative mt-2 max-w-[160px] font-display text-[15px] leading-relaxed text-ink-300">
        {caption}
      </p>
      <span aria-hidden="true" className="relative mt-4 h-px w-8 bg-purple-500/50" />
    </div>
  );
}

export default function ProblemIcons() {
  return (
    <div
      data-reveal
      className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:gap-x-8"
    >
      {SYMPTOMS.map((item) => (
        <SymptomCard key={item.title} icon={item.icon} title={item.title} caption={item.caption} />
      ))}
    </div>
  );
}
