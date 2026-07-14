"use client";

import { createContext, useContext, type ReactNode } from "react";
import { colors, surfaces, motion, densityBudget } from "@/styles/tokens";

const tokens = { colors, surfaces, motion, densityBudget } as const;

type Tokens = typeof tokens;

const ThemeContext = createContext<Tokens>(tokens);

/** Mounts design tokens once at app root (ai/checkpoints/phase03.md). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
