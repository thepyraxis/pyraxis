"use client";

import { useRef } from "react";
import ProblemHeadline from "./ProblemHeadline";
import ProblemIcons from "./ProblemIcons";
import ProblemStatBar from "./ProblemStatBar";
import ProblemAmbientParticles from "./ProblemAmbientParticles";
import { useEdgeFadeOpacity } from "@/hooks/useEdgeFadeOpacity";

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

  return (
    <section
      ref={sectionRef}
      id="problem"
      aria-label="The problem"
      className="relative z-0 flex min-h-[70vh] items-center bg-[#020205] px-header py-24"
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
        MASTER_MOTION_BIBLE Part A §4 / Part B "Lighting Rules": Problem is
        the one section that earns zero glow — "no glow anywhere... the
        section is deliberately the least attractive-looking in the site."
        The previous version had a purple/indigo-tinted radial gradient
        here, which read as a colored light source and softened the
        "discomfort" beat this section exists to deliver. Replaced with a
        neutral, colorless vignette — depth is preserved (this is not a
        flat section), but nothing here is lit. Noise texture kept as-is;
        grain reads as grit/texture, not light.

        The ambient dust field above doesn't reopen that rule: it's plain
        filled arcs with no shadowBlur/glow (same technique as Hero's
        field), kept at a lower count and only ever reaching full opacity
        once Hero has fully faded — a quiet atmosphere continuing, not a
        new light source.
      */}
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

      <div className="relative z-10 mx-auto w-full max-w-container">
        <div className="grid grid-cols-1 gap-12 pt-[70px] lg:grid-cols-split lg:items-center lg:gap-10 lg:pt-0">
          <ProblemHeadline />
          <ProblemIcons />
        </div>
        <div className="mt-16 h-[clamp(64px,18vw,200px)] w-full" />
        <ProblemStatBar />
      </div>
    </section>
  );
}
