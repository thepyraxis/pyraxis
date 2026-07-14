/**
 * Shared static line-icon set — plain inline SVG, no canvas, no rAF loop.
 * Used by section card grids (Future-Proof Systems, Process, Why PYRAXIS)
 * that need a purple-stroke glyph but don't need the particle-construct
 * treatment (`ProblemIconCanvas` / `GrowthEngineIconCanvas`). Costs
 * nothing: painted once, no per-frame JS.
 */

type IconProps = { className?: string };

const base = "h-full w-full";

export function BrainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8c-4 0-6 3-6 6-3 1-4 4-3 7-2 2-2 5 0 7-1 3 1 6 4 6h1v4h16v-4h1c3 0 5-3 4-6 2-2 2-5 0-7 1-3 0-6-3-7 0-3-2-6-6-6h-8z" />
      <path d="M24 8v26M17 16c2 1 3 3 3 5M31 16c-2 1-3 3-3 5M15 27c2 0 4-1 5-3M33 27c-2 0-4-1-5-3" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="21" cy="21" r="11" />
      <path d="M29 29 40 40" />
    </svg>
  );
}

export function StrategyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="20" r="3" />
      <circle cx="34" cy="14" r="3" />
      <path d="M14 18l10 6 8-8" />
      <path d="M30 12l6-1 1 6" />
      <path d="M14 34 34 24" />
    </svg>
  );
}

export function CubesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6 34 12v12L24 30 14 24V12z" />
      <path d="M24 6v12M24 18 14 12M24 18l10-6M24 18v12" />
    </svg>
  );
}

export function RocketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6c6 4 9 11 9 18-3 1-6 1-9 0v10l-4-6h-2l-4 6V24c-3 1-6 1-9 0 0-7 3-14 9-18a13 13 0 0 1 10 0z" />
      <circle cx="24" cy="18" r="3" />
    </svg>
  );
}

export function ChartUpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 38h32" />
      <rect x="12" y="28" width="5" height="10" />
      <rect x="21" y="22" width="5" height="16" />
      <rect x="30" y="14" width="5" height="24" />
      <path d="M10 20 18 12l6 5 12-11" />
      <path d="M30 6h6v6" />
    </svg>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="7" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PerformBarsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 38h28" />
      <rect x="13" y="26" width="5" height="12" />
      <rect x="22" y="18" width="5" height="20" />
      <rect x="31" y="10" width="5" height="28" />
    </svg>
  );
}

export function GearIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="6" />
      <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5 37 37M37 11l-3.5 3.5M14.5 33.5 11 37" />
    </svg>
  );
}

export function ConvergeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 24 10 10M24 24 38 10M24 24 10 38M24 24 38 38" />
      <circle cx="24" cy="24" r="4" />
    </svg>
  );
}

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20v8h5l19 9V11L13 20H8z" />
      <path d="M32 17a8 8 0 0 1 0 14" />
      <path d="M15 28v7a3 3 0 0 0 6 0v-5" />
    </svg>
  );
}

export function BarChartTrendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 40h32" />
      <rect x="12" y="30" width="5" height="8" />
      <rect x="21" y="22" width="5" height="16" />
      <rect x="30" y="14" width="5" height="24" />
      <circle cx="14.5" cy="27" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="23.5" cy="19" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="32.5" cy="11" r="1.6" fill="currentColor" stroke="none" />
      <path d="M14.5 27 23.5 19 32.5 11" strokeDasharray="2 3" />
    </svg>
  );
}

export function HandshakeHeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 34s-10-6.4-10-13.6C14 16 17 13 20.5 13c1.9 0 3 .9 3.5 1.8.5-.9 1.6-1.8 3.5-1.8C31 13 34 16 34 20.4 34 27.6 24 34 24 34z" />
    </svg>
  );
}

export function SpreadsheetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="32" height="32" rx="2.5" />
      <path d="M8 18h32M8 28h32M19 8v32M30 8v32" />
    </svg>
  );
}
