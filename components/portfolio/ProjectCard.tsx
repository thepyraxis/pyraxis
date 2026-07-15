"use client";
import type React from "react";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { ProjectData, ProjectPreviewIcon } from "./projects";
import { CARD_HOVER_LIFT_PX, CARD_HOVER_SCALE, CARD_HOVER_EASE } from "./motion";
import { whatsappInquiryHref } from "@/lib/config/contact";
import { GearIcon, BrainIcon, ConvergeIcon } from "@/components/common/LineIcons";

const PREVIEW_ICONS: Record<ProjectPreviewIcon, React.ComponentType<{ className?: string }>> = {
  gear: GearIcon,
  brain: BrainIcon,
  converge: ConvergeIcon,
};

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

/**
 * One deployment card — mockup panel, name, category, and a large stat +
 * label, matching the reference "Recent Deployments" cards.
 *
 * No real screenshots exist in /public for any project yet. Previously
 * this showed a bare "Case Study — Coming Soon" placeholder — honest
 * (no fake UI chrome pretending to be a screenshot), but apologetic and
 * a dead end. Replaced with a "Project Preview" presentation: a real
 * category icon in a bordered emblem (factual — sourced from
 * `project.previewIcon`, not decorative-only) instead of a repeated
 * first-letter monogram, plus a real, working "Request full case study"
 * link (a project-specific WhatsApp inquiry) instead of an inert message.
 * It doesn't claim a screenshot exists; it turns "nothing to show yet"
 * into a genuine next step for the visitor. Swap `previewSrc` in
 * `projects.ts` to a real asset path per-project as screenshots become
 * available — no changes needed here when that happens (see the
 * conditional render below).
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const lifted = hovered;
  const PreviewIcon = PREVIEW_ICONS[project.previewIcon];

  return (
    <div
      ref={cardRef}
      role="group"
      tabIndex={0}
      aria-label={`${project.name}, ${project.category}${project.industry ? `, ${project.industry}` : ""}${
        project.problem && project.solution ? `. Before: ${project.problem} Built: ${project.solution}` : ""
      }, result: ${project.statValue} ${project.statLabel}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        transform: lifted ? `translateY(-${CARD_HOVER_LIFT_PX}px) scale(${CARD_HOVER_SCALE})` : undefined,
        transitionTimingFunction: CARD_HOVER_EASE,
      }}
      className={`group relative flex h-[480px] w-[92vw] shrink-0 flex-col overflow-hidden rounded-[28px] border bg-card/60 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:w-[78vw] lg:w-[400px] ${
        lifted
          ? "border-purple-500 shadow-[0_0_1px_rgba(139,92,246,0.9),0_0_20px_rgba(139,92,246,0.45),0_0_48px_rgba(139,92,246,0.25)]"
          : "border-border/70 shadow-[0_0_16px_rgba(139,92,246,0.06)]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${lifted ? "opacity-100" : "opacity-0"}`}
        style={{
          background: `radial-gradient(220px circle at ${glow.x}% ${glow.y}%, rgba(139,92,246,0.16), transparent 70%)`,
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[22px] top-[10px] z-0 select-none font-display text-[40px] font-semibold italic leading-none text-purple-400/[0.16]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 px-7 pb-0 pt-[60px]">
        <h3 className="font-display text-xl font-semibold text-ink-100">{project.name}</h3>
        <p className="mt-1.5 font-display text-[15px] text-ink-300">{project.category}</p>
        {project.industry && (
          <span className="mt-3 inline-flex w-fit items-center rounded-full border border-purple-500/25 bg-purple-500/[0.08] px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-purple-300">
            {project.industry}
          </span>
        )}
      </div>

      <div
        aria-hidden={!project.previewSrc}
        className="relative mt-5 h-[210px] w-full overflow-hidden"
        style={{
          background: `radial-gradient(120% 100% at 50% 100%, ${project.accent}33, transparent 60%), linear-gradient(180deg, #0a0a12, #050508)`,
        }}
      >
        {project.previewSrc ? (
          // Real asset path — fills in cleanly once a project has one,
          // with zero changes needed anywhere else. next/image (fill mode),
          // matching the Image usage pattern used elsewhere in the codebase.
          // Wrapped in a link to the live site when one exists — the
          // screenshot itself becomes the "View Live Website" action,
          // with no new button element added to the card.
          project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live website: ${project.name}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 z-20 block"
            >
              <Image
                src={project.previewSrc}
                alt={`${project.name} preview`}
                fill
                className="object-cover"
                style={{ objectPosition: "50% 15%" }}
              />
            </a>
          ) : (
            <Image
              src={project.previewSrc}
              alt={`${project.name} preview`}
              fill
              className="object-cover"
              style={{ objectPosition: "50% 15%" }}
            />
          )
        ) : project.problem && project.solution ? (
          // Confirmed client copy exists — carries the two rungs of the
          // story a screenshot would otherwise show at a glance.
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full border"
              style={{ borderColor: `${project.accent}66`, color: project.accent }}
            >
              <PreviewIcon className="h-3.5 w-3.5" />
            </span>

            <div className="flex flex-col gap-1">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-500">Before</p>
              <p className="line-clamp-2 font-display text-[13px] leading-snug text-ink-300">{project.problem}</p>
            </div>

            <span aria-hidden="true" className="text-purple-400/60">
              ↓
            </span>

            <div className="flex flex-col gap-1">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-500">Built</p>
              <p className="line-clamp-2 font-display text-[13px] leading-snug text-ink-300">{project.solution}</p>
            </div>

            <a
              href={whatsappInquiryHref(`Hi! I'd like to see the case study for ${project.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/link relative z-20 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-purple-300 transition-colors hover:text-purple-200 focus-visible:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              Request full case study
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover/link:w-full" />
            </a>
          </div>
        ) : (
          // No confirmed client copy exists yet for this project. A
          // neutral status, not placeholder text pretending to be real
          // case-study content — an intentional minimal state, not an
          // unfinished one. Icon and CTA are unchanged either way.
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full border"
              style={{ borderColor: `${project.accent}66`, color: project.accent }}
            >
              <PreviewIcon className="h-5 w-5" />
            </span>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-500">
              Available on Request
            </span>
            <a
              href={whatsappInquiryHref(`Hi! I'd like to see the case study for ${project.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/link relative z-20 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-300 transition-colors hover:text-purple-200 focus-visible:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              Request full case study
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover/link:w-full" />
            </a>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-6 border-t border-border/40 px-7 pb-7 pt-6">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View live website: ${project.name}`}
            onClick={(e) => e.stopPropagation()}
            className="font-display text-3xl font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400"
            style={{ color: project.accent }}
          >
            {project.statValue}
          </a>
        ) : (
          <p className="font-display text-3xl font-semibold" style={{ color: project.accent }}>
            {project.statValue}
          </p>
        )}
        <p className="mt-1 font-display text-[15px] text-ink-300">{project.statLabel}</p>
      </div>
    </div>
  );
}
