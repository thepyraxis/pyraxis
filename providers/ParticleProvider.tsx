"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import { createExternalStore } from "@/lib/utils/externalStore";
import type { ParticleInstruction } from "@/components/three/particleTypes";
import ParticleEngine from "@/components/three/ParticleEngine";

type InstructionMap = Map<string, ParticleInstruction>;
type InstructionStore = ReturnType<typeof createExternalStore<InstructionMap>>;

const ParticleContext = createContext<InstructionStore | null>(null);

/**
 * The global particle engine (ai/context/09-particle-engine.md — one canvas,
 * one simulation, one renderer). Sections never instantiate their own
 * particle system; they call `useParticles().sendInstruction(...)` to tell
 * the shared engine what shape/density/phase they want, and the engine
 * mounted here is the only thing that touches the canvas.
 */
export function ParticleProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<InstructionStore>(createExternalStore<InstructionMap>(new Map()));

  return (
    <ParticleContext.Provider value={storeRef.current}>
      <ParticleEngine instructionStore={storeRef.current} />
      {children}
    </ParticleContext.Provider>
  );
}

export function useParticles() {
  const store = useContext(ParticleContext);
  if (!store) throw new Error("useParticles must be used within ParticleProvider");

  const sendInstruction = useCallback(
    (instruction: ParticleInstruction) => {
      store.setState((prev) => {
        const next = new Map(prev);
        next.set(instruction.sourceId, instruction);
        return next;
      });
    },
    [store],
  );

  const clearInstruction = useCallback(
    (sourceId: string) => {
      store.setState((prev) => {
        if (!prev.has(sourceId)) return prev;
        const next = new Map(prev);
        next.delete(sourceId);
        return next;
      });
    },
    [store],
  );

  return { sendInstruction, clearInstruction };
}
