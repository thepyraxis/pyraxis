# Development Log

Tracks live project state. Update after every completed task. See `ai/memory/current.md` for the canonical current-task pointer — this file is the working-notes companion to it.

## Current Milestone
Phase 09 — Growth Engines. Complete. See `ai/memory/current.md`.

## Latest Completed Work
Growth Engines scene: six reusable engine cards (Website, Lead, Booking, WhatsApp, Review, AI Assistant), particle-built icons via `GrowthEngineIconCanvas`, global `ParticleProvider`/`AnimationProvider` integration for ambient signal traffic, scroll-triggered headline reveal, hover/keyboard focus with particle redirect, vertical-mobile/horizontal-desktop layout. See `ai/memory/completed.md`.

## Active Task
None in progress. Next: Phase 10 — Why PYRAXIS. See `ai/memory/next.md`.

## Blocking Issues
None new. Particle-engine-ownership split (self-contained icon-construction canvases vs. global ambient engine) and unfilled `ai/specs/growth-system.md` remain open — see `ai/memory/known-issues.md`.

## Performance Notes
Growth Engines' ambient particle density capped at 0.12 of the device-tier budget (0.04 under reduced motion), shared with other sections through the same pool. Icon-construction canvases pause via `IntersectionObserver` when off-screen.

## Technical Debt
Same as `ai/memory/known-issues.md` "Open" section — no new debt introduced by this phase beyond the six-vs-seven engine content deviation (D-014).
