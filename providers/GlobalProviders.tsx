import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AnimationProvider } from "./AnimationProvider";
import { PerformanceProvider } from "./PerformanceProvider";
import { MouseProvider } from "./MouseProvider";
import { ScrollProvider } from "./ScrollProvider";
import { ParticleProvider } from "./ParticleProvider";

/**
 * All global providers mount exactly once, here, at the app root
 * (ai/checkpoints/phase03.md). No section ever instantiates its own
 * theme/animation/performance/mouse/scroll/particle system.
 * Order matters: ParticleProvider (innermost of the infra providers)
 * depends on Mouse/Performance/Animation context, so it mounts last.
 */
export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <PerformanceProvider>
          <MouseProvider>
            <ScrollProvider>
              <ParticleProvider>{children}</ParticleProvider>
            </ScrollProvider>
          </MouseProvider>
        </PerformanceProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
}
