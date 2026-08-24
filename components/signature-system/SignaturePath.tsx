"use client";
import SignatureShard from "./SignatureShard";

/**
 * SignaturePath — the transformation between two Nodes (see
 * creative/SIGNATURE_MOTIF.md). The line/arrow itself never glows — only
 * a shard travels along it, and only when `active`. If removing a Path
 * wouldn't change what the section communicates, it shouldn't be here
 * (motif rule: Path must carry meaning, not decorate a gap).
 *
 * `label` is optional and is how a Path stops being just an arrow: e.g.
 * "becomes", "triggers", "closes" — the verb connecting two states.
 * Future-Proof Systems uses this; Growth System (icon-to-icon, meaning is
 * obvious from the icons) does not.
 */
export interface SignaturePathProps {
  active: boolean;
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

export default function SignaturePath({
  active,
  orientation = "horizontal",
  label,
  className = "",
}: SignaturePathProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center ${
        isHorizontal ? "h-20 w-6" : "h-6 w-20"
      } ${className}`}
    >
      <span
        className={`block text-center transition-colors duration-500 ${
          active ? "text-purple-300" : "text-purple-500/40"
        }`}
      >
        {isHorizontal ? "→" : "↓"}
      </span>
      {label && (
        <span
          className={`absolute font-sans text-[9px] uppercase tracking-[0.15em] transition-colors duration-500 ${
            isHorizontal ? "-top-4 left-1/2 -translate-x-1/2" : "left-7 top-1/2 -translate-y-1/2"
          } ${active ? "text-purple-300" : "text-ink-400"}`}
        >
          {label}
        </span>
      )}
      {active && <SignatureShard orientation={orientation} />}
    </div>
  );
}
