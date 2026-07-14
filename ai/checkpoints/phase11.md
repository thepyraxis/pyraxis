# Checkpoint — Phase 11: Portfolio

Source: `ai/memory/roadmap.md` Phase 11. Spec: `ai/specs/portfolio.md`.

## Requirements

Per `ai/specs/portfolio.md` (spec locked): showcase real systems built, no fake case studies/stats/testimonials (`ai/rules/design.md`, D-004).

## Acceptance Criteria

- [x] Full Section Completion Gate passes (`tsc --noEmit`, `eslint`, `next build` clean)
- [x] Matches `ai/specs/portfolio.md` and `ai/knowledge/sections.json` entry
- [x] No fake case studies, stats, or testimonials (`ai/rules/design.md`, D-004) — `projects.ts` populated with 6 real systems

## Completed Tasks

- [x] Spec locked (`ai/specs/portfolio.md`), synced to shipped code
- [x] `projects.ts` populated with 6 real systems
- [x] Scroll-scrub rail built
- [x] Runtime QA (user screenshots) found and fixed 2 real bugs: (1) card hover glow/shadow clipped top+right — CSS forces `overflow-y: auto` when `overflow-x` is non-visible on the same box, plus wrapper padding too small for the 44px shadow blur + 10px hover lift — fixed via wider wrapper padding; (2) that padding fix broke scroll-scrub distance math (`wrapper.clientWidth` now included new padding, undershooting `scrollLength`) — fixed by subtracting the wrapper's own computed padding before calculating visible track width
- [x] Keyboard nav, mobile snap, cleanup/unmount logic eyeballed clean against spec

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/portfolio.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
