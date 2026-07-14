# Checkpoint — Phase 07: Problem

Source: `ai/memory/roadmap.md` Phase 07. Spec: `ai/specs/problem.md`.

## Requirements

Derived from Experience Blueprint §10 (see `ai/specs/problem.md` for the full breakdown): 70vh, urgency/recognition, huge typography + minimal copy + four large icons that physically construct themselves, no clutter, cooler/harsher lighting than Hero.

## Acceptance Criteria

- [x] Full Section Completion Gate passes — `tsc --noEmit`, `eslint`, `next build` all clean
- [x] Matches ai/specs/problem.md and ai/knowledge/sections.json entry
- [x] Intensity = High per Visual Rhythm Map

## Completed Tasks

- [x] Section shell, cooler/harsher lighting layer — `components/problem/Problem.tsx`
- [x] Headline + verbatim Product Bible §02 subline, single entrance reveal — `components/problem/ProblemHeadline.tsx`
- [x] Four manufactured (stroke-only, no-fill) icons: Ghosted Leads, Manual Chaos, Slow Response, Lost Revenue — `components/problem/icons.tsx`
- [x] Scroll-driven assemble/disassemble particle construction (icons never fade in), sparse lost/interrupted flicker while settled — `components/problem/ProblemIconCanvas.tsx`
- [x] Icon ids (not functions) passed across the server/client boundary — `components/problem/ProblemIcons.tsx`

Known deviation, not blocking this checkpoint but tracked at the project level: built without Phases 01–04 or Phase 06 (Hero → Problem transition doesn't exist yet — no physical particle hand-off between the two scenes) — see `ai/memory/known-issues.md`.

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/problem.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
