# Checkpoint — Phase 10: Why PYRAXIS

Source: `ai/memory/roadmap.md` Phase 10. Spec: `ai/specs/why-pyraxis.md`.

## Requirements

Answer three belief questions (why not an agency, why one connected system, why trust PYRAXIS) without repeating Growth Engines' service content. Editorial layout, large type, no cards, minimal UI. Intensity stays Low — this is the rest beat before Portfolio.

## Acceptance Criteria

- [x] Full Section Completion Gate passes: `tsc --noEmit`, `eslint`, `next build` all clean
- [x] Matches `ai/specs/why-pyraxis.md` and `ai/knowledge/sections.json` entry
- [x] Intensity = Low (rest beat) per Visual Rhythm Map — particle density (0.05 / 0.02 reduced-motion) kept below Growth Engines' 0.12, no card grid, no hover interaction

## Completed Tasks

- [x] `components/why-pyraxis/content.ts` — headline + three-point copy, brand-voice checked
- [x] `components/why-pyraxis/WhyPyraxis.tsx` — section, `IntersectionObserver`-driven GSAP reveal + low-density particle circles via `ParticleProvider`, reduced-motion path
- [x] Wired into `app/page.tsx` after `GrowthEngines`
- [x] `tsc --noEmit`, `eslint`, `next build` all clean

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/why-pyraxis.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
