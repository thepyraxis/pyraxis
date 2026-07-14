# Checkpoint — Phase 12: Process

Source: `ai/memory/roadmap.md` Phase 12. Spec: `ai/specs/process.md`.

## Requirements

Per `ai/specs/process.md` (spec written first, genuine unknowns flagged as Open Questions rather than invented, locked before component code).

## Acceptance Criteria

- [x] Full Section Completion Gate passes (`tsc --noEmit`, `eslint`, `next build` clean)
- [x] Matches `ai/specs/process.md` and `ai/knowledge/sections.json` entry

## Completed Tasks

- [x] Fixed five-stage vertical progression (Discovery/Strategy/Build/Launch/Scale, `content.ts`, never data-driven)
- [x] Scroll-linked traveling signal dot (no pin/horizontal rail — stack is vertical at every breakpoint, unlike Portfolio)
- [x] Ambient particles via shared `ParticleProvider` (shape: nodes, one target per stage, focusIndex biases toward activeStage)
- [x] Accelerating exit handoff on ScrollTrigger onLeave per Blueprint §15
- [x] Reduced-motion path: static list, no signal
- [x] Found and fixed 2 doc-sync gaps unrelated to Process code: `components.json` missing Portfolio/ProjectCard entries (predated session), and its top-level `note` field falsely claimed Phase 03/04 providers weren't built (they were, per D-012) — both corrected

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/process.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
