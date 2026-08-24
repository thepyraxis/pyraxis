"use client";

import { projects } from "./projects";
import ProjectCard from "./ProjectCard";
import Section from "@/components/layout/Section";
import SectionContent from "@/components/layout/SectionContent";

/**
 * Scene — Portfolio (Phase 11, ai/specs/portfolio.md).
 *
 * Data-driven grid: renders entirely from `projects.ts`, no hardcoded
 * card count — adding a seventh project only ever requires editing
 * that file.
 *
 * Static layout — no scroll-scrub, no pin, no horizontal rail tension.
 * Cards sit at their natural point in the page and stay there; only
 * per-card hover lift remains (see ProjectCard).
 */
export default function Portfolio() {
  return (
    <Section id="portfolio" aria-label="Portfolio" className="z-0 min-h-fit">
      {/* Quiet section — no ambient purple, no motif (creative/SIGNATURE_MOTIF.md).
          Projects are parallel case studies, not sequential system states,
          so this is the page's breath, not another purple beat. */}
      <SectionContent>
        <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-ink-400">Recent Deployments</span>
        <h2 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-semibold text-ink-100">
          Real systems.
          <span className="block italic text-purple-400">Real results.</span>
        </h2>
        <p className="mt-3 max-w-2xl font-display text-sm leading-relaxed text-ink-300 md:text-base">
          A few examples of how we&apos;ve helped businesses streamline, automate, and scale.
        </p>
        <a
          href="#process"
          className="mt-6 inline-flex items-center gap-2 rounded-[2px] border border-border px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-ink-300 transition-colors duration-300 ease-out hover:border-ink-400 hover:text-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-400"
        >
          View All Projects
          <span aria-hidden="true">→</span>
        </a>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </SectionContent>
    </Section>
  );
}
