# Checkpoint — Phase 03: Global Providers

Source: `ai/memory/roadmap.md` Phase 03. No single spec file — this phase is cross-cutting infrastructure, not one scene; see `ai/context/04-architecture.md` / `ai/context/09-particle-engine.md` / `ai/context/10-deployment.md` as applicable.

## Requirements

UNKNOWN — derive from `ai/context/` and the relevant manual section when this phase is picked up; do not invent requirements.

## Acceptance Criteria

- [x] ThemeProvider, ParticleProvider, MouseProvider, ScrollProvider, PerformanceProvider, AnimationProvider all mount once, composed in `providers/GlobalProviders.tsx`, mounted in `app/layout.tsx`
- [x] No section-level instantiation — Growth System and the Hero→Problem transition both consume `useParticles()` from the shared provider only

## Completed Tasks

- [x] See D-012.

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
