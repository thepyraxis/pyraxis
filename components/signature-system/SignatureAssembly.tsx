"use client";
import { useState, type ReactNode } from "react";

/**
 * SignatureAssembly — a full system of Nodes connected by Paths (see
 * creative/SIGNATURE_MOTIF.md). Only use this when a section is showing
 * "the system" itself, not as a generic layout wrapper — most sections
 * should stay quiet (no motif at all: Portfolio, Founder Story, Footer,
 * Marquee).
 *
 * Owns the one piece of shared state every Assembly needs — which index
 * is active — so consumers (GrowthSystem, FutureProofSystems, ...) don't
 * each hand-roll their own useState/onFocus/onBlur wiring.
 */
export interface SignatureAssemblyProps {
  count: number;
  /** Render prop: (index, state) => node content for that position. */
  renderNode: (index: number, state: "idle" | "active") => ReactNode;
  /** Render prop: (index, pathActive) => path content between index and index+1. */
  renderPath: (index: number, pathActive: boolean) => ReactNode;
  className?: string;
  /** Uncontrolled by default; pass to control activation externally. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
}

export default function SignatureAssembly({
  count,
  renderNode,
  renderPath,
  className = "",
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: SignatureAssemblyProps) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState<number | null>(null);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : uncontrolledIndex;
  const setActiveIndex = onActiveIndexChange ?? setUncontrolledIndex;

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => {
        const isLast = index === count - 1;
        const nodeState: "idle" | "active" = activeIndex === index ? "active" : "idle";
        // A path is "active" when its origin node is active — the shard
        // is leaving that state toward the next one.
        const pathActive = activeIndex === index;

        return (
          <div
            key={index}
            className="contents"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          >
            {renderNode(index, nodeState)}
            {!isLast && renderPath(index, pathActive)}
          </div>
        );
      })}
    </div>
  );
}
