/**
 * Particle density budgets (Experience Blueprint §04, Design System §23,
 * ai/context/09-particle-engine.md). Performance always wins — the engine
 * degrades density before it degrades frame rate.
 */
export type DeviceTier = "desktop" | "tablet" | "mobile";

export const densityBudget: Record<DeviceTier, { min: number; max: number }> = {
  desktop: { min: 3000, max: 8000 },
  tablet: { min: 1200, max: 2500 },
  mobile: { min: 400, max: 1200 },
};
