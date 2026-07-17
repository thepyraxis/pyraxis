"use client";

import { useRef } from "react";
import HeroText from "./HeroText";
import HeroButtons from "./HeroButtons";
import HeroLogo from "./HeroLogo";
import HeroAmbientParticles from "./HeroAmbientParticles";
import { useParallaxMouse } from "@/hooks/useParallaxMouse";
import { useEdgeFadeOpacity } from "@/hooks/useEdgeFadeOpacity";

/**
 * Matches the reference HTML's actual `.hero` structure/stacking exactly:
 *   .hero-background (absolute, inset -5%, z-0, pointer-events-none):
 *     particles canvas (z-auto ≈ backmost) -> .layer-noise (z-1) ->
 *     .layer-glow (z-2) -> .layer-hero-image (z-3, flex justify-end,
 *     padding-right 12%)
 *   .hero-content (normal flow, z-10, max-width 800px, padding-top 100px)
 * Previously this had a "movie-poster" two-column layout with a second
 * particle layer sitting ABOVE the logo (variant="front") and a shared
 * max-width wrapper around logo+text — neither exists in the reference.
 * Fonts/text styling/HeroLogo asset are unchanged, only structure/stacking.
 *
 * Stacking note (particle field): the field's canvas fills its wrapper 1:1,
 * and that wrapper is exactly Hero's own box — nothing here bleeds into or
 * travels toward Problem. The Hero -> Problem handoff instead comes from
 * `useEdgeFadeOpacity` below, which crossfades this whole layer's opacity
 * as Hero's own bottom edge scrolls up toward the top of the viewport —
 * an atmosphere dimming out, not particles migrating anywhere.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const noiseRef = useRef<HTMLDivElement | null>(null);
  const particlesWrapRef = useRef<HTMLDivElement | null>(null);

  // Mouse parallax on .layer-noise / .layer-particles — matches the
  // reference's animateBackground(), which skips .layer-glow by class
  // check and never touches the logo (not a .background-layer at all).
  // depth = data-speed * 0.3 * ~1920px viewport width (noise 0.01,
  // particles 0.04).
  useParallaxMouse(noiseRef, { depth: 6 });
  useParallaxMouse(particlesWrapRef, { depth: 23 });

  // Atmosphere crossfade: as Hero's own bottom edge rises toward the top
  // of the viewport (Hero scrolling out of view), ease this field's
  // opacity down to 0. Problem's matching field ramps up over the same
  // physical scroll range from its own side (see Problem.tsx) — no
  // shared state between the two, just two edges of the same seam.
  useEdgeFadeOpacity(particlesWrapRef, sectionRef, "bottom");

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      className="relative z-20 flex min-h-screen items-center bg-[#020205] px-[clamp(1.5rem,5vw,3.75rem)]"
    >
      {/* Particle field — backmost layer, same slot the original occupied,
          confined to exactly Hero's own box (absolute inset-0 of a
          same-sized wrapper, no bleed). */}
      <div
        ref={particlesWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <HeroAmbientParticles className="absolute inset-0 h-full w-full" variant="back" />
      </div>

      {/* .hero-background — noise/glow/logo only now; clipped to exactly
          Hero's own box via its own overflow-hidden (section no longer
          clips), so the -5% inset never visually shows, same as before. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <div className="absolute inset-[-5%]">
          {/* .layer-noise */}
          <div
            ref={noiseRef}
            className="absolute inset-0 z-[1] opacity-[0.025]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            }}
          />

          {/* .layer-glow */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12), transparent 70%)",
            }}
          />

          {/* .layer-hero-image — logo, flex justify-end padding-right:12%,
              sits above particles/noise/glow, still decorative/background
              (pointer-events-none on the shell; the logo asset itself can
              still be interactive if it needs to be). */}
          <div className="absolute inset-0 z-[3] flex items-center justify-center pr-0 opacity-[0.08] sm:opacity-[0.12] md:justify-end md:pr-[8%] md:opacity-70 lg:pr-[12%] lg:opacity-100">
            <div className="pointer-events-auto aspect-[5986/3384] w-[clamp(140px,32vw,660px)] md:w-[clamp(320px,38vw,660px)]">
              <HeroLogo />
            </div>
          </div>
        </div>
      </div>

      {/* .hero-content — normal flow, not absolute, not shared with the logo */}
      <div className="relative z-10 w-full max-w-[800px] pt-[100px]">
        <HeroText />
        <HeroButtons />
      </div>
    </section>
  );
}
