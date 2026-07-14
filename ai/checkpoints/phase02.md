# Checkpoint — Phase 02: Design System + tokens

Source: `ai/memory/roadmap.md` Phase 02. No single spec file — this phase is cross-cutting infrastructure, not one scene; see `ai/context/04-architecture.md` / `ai/context/09-particle-engine.md` / `ai/context/10-deployment.md` as applicable.

## Requirements

UNKNOWN — derive from `ai/context/` and the relevant manual section when this phase is picked up; do not invent requirements.

## Acceptance Criteria

- [x] All token categories from ai/context/05-design-system.md implemented under styles/tokens/ (`colors.ts`, `surfaces.ts`, `motion.ts`, `particles.ts`)
- [x] Four surface types (Flat, Glass, Metal, Signal) defined in `styles/tokens/surfaces.ts`
- [x] Purple capped at ~5% visual weight rule encoded as `PURPLE_WEIGHT_CAP` in `styles/tokens/colors.ts`
- [x] Brand hex values and typeface (Cormorant Garamond / Syne) formalized as tokens, matching values already live in `tailwind.config.ts`/`layout.tsx`. Logo asset itself is still the placeholder `/logo.svg` (unchanged — a real asset swap is a design decision, not something to invent here).

## Completed Tasks

- [x] See D-012.

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
