# Checkpoint — Phase 01: Foundation + project structure

Source: `ai/memory/roadmap.md` Phase 01. No single spec file — this phase is cross-cutting infrastructure, not one scene; see `ai/context/04-architecture.md` / `ai/context/09-particle-engine.md` / `ai/context/10-deployment.md` as applicable.

## Requirements

UNKNOWN — derive from `ai/context/` and the relevant manual section when this phase is picked up; do not invent requirements.

## Acceptance Criteria

- [x] Next.js 15+ App Router initialized, TypeScript strict mode enabled
- [x] Tailwind CSS installed and configured
- [x] npm as package manager — team decision: standardize on npm (already in production use, `package-lock.json` present); pnpm requirement in the original spec is superseded. See D-013.
- [x] Fixed project structure scaffolded per ai/context/04-architecture.md (folders already placeholder-scaffolded; populate, don't restructure)
- [x] utils/ vs lib/utils/ duplication resolved — root `utils/` did not exist in this snapshot; only `lib/utils/` does. D-006 closed.

## Completed Tasks

- [x] Design tokens, providers, particle engine, transition, and Growth System built — see D-012. pnpm migration still open.

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
