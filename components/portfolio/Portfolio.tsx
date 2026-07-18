"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "./projects";
import ProjectCard from "./ProjectCard";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import { SCROLL_EASE, SCROLL_DISTANCE_MULTIPLIER, TABLET_MEDIA_QUERY, MOBILE_MEDIA_QUERY } from "./motion";
import Section from "@/components/layout/Section";
import SectionContent from "@/components/layout/SectionContent";

type LayoutMode = "desktop" | "tablet" | "mobile";

/**
 * Scene — Portfolio (Phase 11, ai/specs/portfolio.md).
 *
 * Data-driven horizontal rail: renders entirely from `projects.ts`, no
 * hardcoded card count (spec §Data-Driven Rendering) — adding a seventh
 * project only ever requires editing that file.
 *
 * Desktop/tablet: vertical scroll drives a pinned horizontal translate
 * via ScrollTrigger scrub (spec §Scroll behavior). Mobile: native
 * `overflow-x` + `scroll-snap`, no scrub — avoids scroll-jacking on touch
 * (ai/rules/animation.md mobile carve-out, same reasoning as
 * growth-engines' vertical-stack decision). Reduced motion collapses the
 * rail to a static scrollable list with no scrub and no pin, per spec
 * §Reduced motion.
 *
 * No per-card icon canvas (unlike growth-engines) — cards have no icon
 * glyph in this spec's Card Specification. The shared ambient particle
 * field substitutes for per-card particle construction; see motion.ts.
 */
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("desktop");

  useEffect(() => {
    const tabletMql = window.matchMedia(TABLET_MEDIA_QUERY);
    const mobileMql = window.matchMedia(MOBILE_MEDIA_QUERY);
    const computeMode = (): LayoutMode => {
      if (mobileMql.matches) return "mobile";
      if (tabletMql.matches) return "tablet";
      return "desktop";
    };
    setLayoutMode(computeMode());
    const handler = () => setLayoutMode(computeMode());
    tabletMql.addEventListener("change", handler);
    mobileMql.addEventListener("change", handler);
    return () => {
      tabletMql.removeEventListener("change", handler);
      mobileMql.removeEventListener("change", handler);
    };
  }, []);

  // Previously this effect also sent a "scatter" ambient instruction into
  // the shared ParticleEngine on visibility change. Removed along with
  // every other non-Hero section's use of that engine (see growth-engines/
  // growth-system for the fuller explanation — six sections each running
  // a per-frame instruction into one shared simulation was the actual
  // cause of the reported lag/hang). Nothing else in this component
  // depended on the visibility boolean itself, so the observer goes too.

  // Horizontal scroll-scrub rail — desktop/tablet only, skipped entirely
  // under reduced motion (spec: rail becomes a static scrollable list).
  useEffect(() => {
    if (layoutMode === "mobile" || reducedMotion) {
      return;
    }
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!wrapper || !track || !section) return;

    const ctx = gsap.context(() => {
      const wrapperStyle = getComputedStyle(wrapper);
      const wrapperPaddingX = parseFloat(wrapperStyle.paddingLeft || "0") + parseFloat(wrapperStyle.paddingRight || "0");
      const visibleTrackWidth = wrapper.clientWidth - wrapperPaddingX;
      const scrollLength = Math.max(0, track.scrollWidth - visibleTrackWidth);
      if (scrollLength === 0) {
        return;
      }

      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: -scrollLength,
        ease: SCROLL_EASE,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollLength * SCROLL_DISTANCE_MULTIPLIER}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Force one real re-measure once everything (images, fonts, other
      // sections' heights) has settled, so the pin's start/end reflect
      // actual page layout rather than an early, possibly-wrong snapshot.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const refreshTimeout = window.setTimeout(refresh, 300);

      return () => {
        window.removeEventListener("load", refresh);
        window.clearTimeout(refreshTimeout);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [layoutMode, reducedMotion]);

  const railStatic = layoutMode === "mobile" || reducedMotion;

  return (
    <Section
      ref={sectionRef}
      id="portfolio"
      aria-label="Portfolio"
      className={`z-0 ${railStatic ? "min-h-fit" : "min-h-[100vh]"}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.06), transparent 65%)",
        }}
      />

      <SectionContent>
        <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-purple-400">Recent Deployments</span>
        <h2 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-semibold text-ink-100">
          Real systems.
          <span className="block italic text-purple-400">Real results.</span>
        </h2>
        <p className="mt-3 max-w-2xl font-display text-sm leading-relaxed text-ink-300 md:text-base">
          A few examples of how we&apos;ve helped businesses streamline, automate, and scale.
        </p>
        <a
          href="#process"
          className="mt-6 inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
        >
          View All Projects
          <span aria-hidden="true">→</span>
        </a>

        <div
          ref={wrapperRef}
          className={
            railStatic
              ? "mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6"
              : "relative -mx-11 mt-16 overflow-x-hidden overflow-y-visible px-11 pb-12 pt-14 lg:mt-24"
          }
        >
          <div
            ref={trackRef}
            className={railStatic ? "contents" : "flex gap-6"}
          >
            {projects.map((project, index) => (
              <div key={project.id} className={railStatic ? "snap-start" : ""}>
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </div>
      </SectionContent>
    </Section>
  );
}
