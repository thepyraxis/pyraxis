# Current

Growth Engines (Phase 09) is implemented and passing its checkpoint (`ai/checkpoints/phase09.md`) — `tsc --noEmit`, `eslint`, and `next build` all clean. It reuses the real global `ParticleProvider`/`AnimationProvider` (which already existed in the codebase via Growth System, Phase 08) rather than a self-contained canvas for ambient particles, and resolves the previously-open horizontal-scroll-on-mobile decision (D-014: vertical stack below `md`).

This session also found `ai/memory/current.md`, `next.md`, `progress.md`, `completed.md`, `STATUS.md`, and `ai/state.json` badly out of sync with the actual codebase (they described Phases 01-04 and Growth System as not started, when that code already existed and passed its own checks) and corrected them — see `ai/memory/decisions.md` D-014. Cross-check code against these files at the start of every session rather than trusting either blindly.

The next real "current work" entry is **Phase 10 — Why PYRAXIS** (Tier 1 priority per D-013).

## How to use this file

Overwrite this file's body with exactly what is being worked on right now, every session. One item at a time — this file always describes a single unit of work, not a list.

## Related Files

`ai/logs/development.md` — working-notes companion (Active Task section mirrors this file); `ai/logs/sessions.md` — session-by-session journal.

## Last Updated

Updated after Growth Engines (Phase 09) implementation and memory-file reconciliation pass.
