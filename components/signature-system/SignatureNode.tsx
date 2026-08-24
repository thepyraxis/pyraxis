"use client";
import type React from "react";

/**
 * SignatureNode — a business state (see creative/SIGNATURE_MOTIF.md).
 *
 * Extracted from GrowthNode's icon/halo/border markup, generalized so any
 * section can render a Node without re-deriving the glow/border rules.
 * API is semantic (`state`, `size`), not implementation ("purpleGlow",
 * "isShiny") — the motif doc explicitly warns against that drift.
 *
 * Renders a circular frame around whatever content is passed (icon,
 * glyph, number) — it does not know or care what a Node represents in a
 * given section, only how a Node looks/behaves.
 */
export interface SignatureNodeProps {
  /** "idle" = the node exists but nothing is flowing through it right now.
   *  "active" = a shard is currently at/entering this node — brightened
   *  border + halo. This is the ONLY visual state the motif defines;
   *  don't add "hover"/"focus"/"selected" variants that mean the same
   *  thing under a different name. */
  state: "idle" | "active";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  as?: "div" | "button";
  onActivate?: () => void;
  onDeactivate?: () => void;
  ariaLabel?: string;
}

const SIZE_MAP = {
  sm: { frame: "h-11 w-11", halo: "inset-[-14px]" },
  md: { frame: "h-16 w-16", halo: "inset-[-20px]" },
  lg: { frame: "h-20 w-20", halo: "inset-[-28px]" },
} as const;

export default function SignatureNode({
  state,
  size = "md",
  children,
  className = "",
  as = "div",
  onActivate,
  onDeactivate,
  ariaLabel,
}: SignatureNodeProps) {
  const isActive = state === "active";
  const dims = SIZE_MAP[size];
  const Wrapper = as === "button" ? "button" : "div";

  return (
    <Wrapper
      type={as === "button" ? "button" : undefined}
      aria-label={ariaLabel}
      aria-pressed={as === "button" ? isActive : undefined}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={`group relative flex shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 ${className}`}
    >
      {/* Halo — only ever on the node, only ever when active. This is the
          single glow budget the whole motif spends. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute ${dims.halo} rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.16),transparent_68%)] blur-[6px] transition-opacity duration-[240ms] ease-out ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`relative flex ${dims.frame} shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ease-out ${
          isActive ? "border-purple-300" : "border-purple-500/40"
        }`}
      >
        {children}
      </span>
    </Wrapper>
  );
}
