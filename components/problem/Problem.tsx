"use client";

import { useRef } from "react";
import ProblemHeadline from "./ProblemHeadline";
import ProblemIcons from "./ProblemIcons";
import ProblemStatBar from "./ProblemStatBar";
import ProblemAmbientParticles from "./ProblemAmbientParticles";
import ProblemWaveBackground from "./ProblemWaveBackground";
import ResponsiveCanvas from "@/components/common/ResponsiveCanvas";
import { useEdgeFadeOpacity } from "@/hooks/useEdgeFadeOpacity";
import { useSectionHandoff } from "@/hooks/useSectionHandoff";
import Section from "@/components/layout/Section";
import SectionContent from "@/components/layout/SectionContent";

/**
 * Scene 02 — The Real Problem. Layout: headline + CTA on the left,
 * four symptom cards on the right, full-width stat bar underneath —
 * matches the reference design.
 */
export default function Problem() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const particlesWrapRef = useRef<HTMLDivElement | null>(null);

  // Mirror of Hero's fade: as Problem's own top edge rises up to and past
  // the top of the viewport (Problem taking over the screen), this field
  // ramps from 0 -> 1 opacity. Hero's field is fading out over the same
  // physical scroll range from its own side (see Hero.tsx) — the two
  // never talk to each other, they just happen to be reading the same
  // seam, which is what makes the handoff read as one atmosphere.
  useEdgeFadeOpacity(particlesWrapRef, sectionRef, "top");

  // Shared-engine boundary handoff (additive to the crossfade above, entry
  // side) and Problem's own exit toward GrowthSystem (no local-canvas
  // crossfade exists on that side yet — this is Problem's only exit signal).
  // ai/specs/architecture/section-boundary-handoff.md
  useSectionHandoff("problem", sectionRef, "top");
  useSectionHandoff("problem", sectionRef, "bottom");

  return (
    <Section
      ref={sectionRef}
      id="problem"
      aria-label="The problem"
      className="z-0 flex min-h-[70vh] items-center bg-[#020205]"
    >
      {/*
        Problem's own ambient dust field — same palette as Hero's for
        atmospheric continuity, but its own particles, confined to its own
        box, faded in from the outside (see useEdgeFadeOpacity above).
        Sits behind the noise/vignette layer, same backmost slot Hero's
        field occupies relative to Hero's own noise/glow.
      */}
      <div
        ref={particlesWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <ProblemAmbientParticles className="absolute inset-0 h-full w-full" />
      </div>

      {/*
        MASTER_MOTION_BIBLE Part A §4 / Part B "Lighting Rules" previously
        called for zero glow in this section. Admin-approved, explicit
        exception: ProblemWaveBackground (topographic wave/terrain, real
        glow, additive blending) is now the section's background layer —
        added on direct instruction, overriding that rule for this one
        visual. Noise texture below kept as-is underneath it.
      */}
      <ResponsiveCanvas>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <ProblemWaveBackground sectionRef={sectionRef} />
        </div>
      </ResponsiveCanvas>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
          }}
        />
      </div>

      <SectionContent>
        <div className="grid grid-cols-1 gap-12 pt-[clamp(2.5rem,9vw,4.375rem)] lg:grid-cols-split lg:items-center lg:gap-10 lg:pt-0">
          <ProblemHeadline />
          <ProblemIcons />
        </div>
        <div className="mt-16 h-[clamp(64px,18vw,200px)] w-full" />
        <ProblemStatBar />
      </SectionContent>
    </Section>
  );
}
