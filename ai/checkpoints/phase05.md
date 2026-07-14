# Checkpoint — Phase 05: Hero

Source: `ai/memory/roadmap.md` Phase 05. Spec: `ai/specs/hero.md`.

## Requirements

Derived from Experience Blueprint §09 and Design System (see `ai/specs/hero.md` for the full breakdown): 100vh, wonder/confidence/calm, massive logo + large headline + minimal copy, logo breathes and erodes/restores continuously, particles carry visible intent rather than drifting randomly.

## Acceptance Criteria

- [x] Full Section Completion Gate passes (ai/rules/architecture.md #7) — `tsc --noEmit`, `eslint`, `next build` all clean
- [x] Hero scene matches ai/specs/hero.md and ai/knowledge/sections.json entry
- [x] Intensity = Medium per Visual Rhythm Map

## Completed Tasks

- [x] Section shell + layered lighting (ambient fog / core glow / bloom / reflection) — `components/hero/Hero.tsx`
- [x] Logo scatter → assemble → hold → breathing/erosion story arc — `components/hero/HeroLogoCanvas.tsx`
- [x] Directional ambient particles (carry toward / leak away from the logo) — `components/hero/HeroAmbientParticles.tsx`
- [x] Two-tier headline typography, single entrance reveal, CTAs — `components/hero/HeroText.tsx`, `HeroButtons.tsx`
- [x] Responsive across all breakpoints (logo becomes a translucent watermark below `lg`)

Known deviation, not blocking this checkpoint but tracked at the project level: built without Phases 01–04 (no design tokens/global providers/particle engine yet — see `ai/memory/known-issues.md`).

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/hero.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
