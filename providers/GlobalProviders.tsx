import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AnimationProvider } from "./AnimationProvider";
import { PerformanceProvider } from "./PerformanceProvider";
import { MouseProvider } from "./MouseProvider";
import { LenisProvider } from "./LenisProvider";
import { ScrollProvider } from "./ScrollProvider";
import { ParticleProvider } from "./ParticleProvider";

/**
 * All global providers mount exactly once, here, at the app root
 * (ai/checkpoints/phase03.md). No section ever instantiates its own
 * theme/animation/performance/mouse/scroll/particle system.
 * Order matters: LenisProvider mounts before ScrollProvider since
 * ScrollProvider reads scroll state that Lenis drives
 * (ai/specs/architecture/lenis-smooth-scroll.md). ParticleProvider
 * (innermost of the infra providers) depends on Mouse/Performance/
 * Animation context, so it mounts last.
 */
export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <PerformanceProvider>
          <MouseProvider>
            <LenisProvider>
              <ScrollProvider>
                <ParticleProvider>{children}</ParticleProvider>
              </ScrollProvider>
            </LenisProvider>
          </MouseProvider>
        </PerformanceProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
}
