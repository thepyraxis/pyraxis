# Checkpoint — Phase 04: Global Particle Engine

Source: `ai/memory/roadmap.md` Phase 04. No single spec file — this phase is cross-cutting infrastructure, not one scene; see `ai/context/04-architecture.md` / `ai/context/09-particle-engine.md` / `ai/context/10-deployment.md` as applicable.

## Requirements

UNKNOWN — derive from `ai/context/` and the relevant manual section when this phase is picked up; do not invent requirements.

## Acceptance Criteria

- [x] Single canvas, single simulation, single renderer implemented in `components/three/ParticleEngine.tsx` — Canvas2D, not Three.js (see D-012 for why)
- [x] Particle DNA implemented as struct-of-arrays in `components/three/particlePool.ts` — all fields present. Behavior state machine simplified to 3 phases; see note in `particleTypes.ts`.
- [x] Object pooling in place (`ParticlePool.acquire`/`release`/`releaseOwner`) — fixed-capacity typed arrays, no per-frame allocation in the physics step (ai/rules/performance.md #2)
- [x] Density budgets enforced per device tier via `styles/tokens/particles.ts` + `PerformanceProvider`'s tier detection and fps-based degrade factor

## Completed Tasks

- [x] See D-012. Open follow-up: migrate Hero/Problem's own canvases into this engine (ai/memory/known-issues.md).

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
