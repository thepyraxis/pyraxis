# TODO

Quick checklist. Full detail: [`ai/memory/roadmap.md`](ai/memory/roadmap.md) (17 phases) and [`ai/checkpoints/`](ai/checkpoints/) (per-phase acceptance criteria). Check a box only once its checkpoint's acceptance criteria all pass — see `ai/scripts/finish-phase.md`.

## Infrastructure phases

- [x] Phase 01 — Foundation + project structure
- [x] Phase 02 — Design System + tokens
- [x] Phase 03 — Global Providers
- [x] Phase 04 — Global Particle Engine *(Canvas2D, not Three.js — see `ai/memory/decisions.md` D-012)*

## Scenes (in build order — never build out of order, `ai/rules/architecture.md` #6)

- [x] Hero *(built out of sequential order — Phases 01-04 skipped; see `ai/memory/known-issues.md`)*
- [x] Hero → Problem transition
- [x] Problem *(built out of sequential order — Phases 01-04, 06 skipped; see `ai/memory/known-issues.md`)*
- [x] Growth System *(spec `ai/specs/growth-system.md` still unfilled — built from manuals directly, see D-012)*
- [x] Growth Engines *(six engines, not the original seven — see `ai/memory/decisions.md` D-014)*
- [ ] Why PYRAXIS *(implementation complete — `components/why-pyraxis/`; box stays unchecked pending full Section Completion Gate, `ai/rules/architecture.md` #7)*
- [ ] Portfolio *(implementation complete — `components/portfolio/`; same pending-gate status)*
- [ ] Process *(implementation complete — `components/process/`; same pending-gate status)*
- [ ] Future-Proof Systems (climax — manuals call this "Intelligence Core", see `ai/memory/decisions.md` D-005) *(Complete via user manual browser QA — see STATUS.md)*
- [ ] CTA *(Complete via user manual browser QA — see STATUS.md; box stays unchecked pending the automated Section Completion Gate)*
- [ ] Footer *(implementation complete this pass's audit found — `components/footer/`, wired into `app/page.tsx`; TODO previously said this whole group was un-built, which was stale — corrected. Box stays unchecked pending the same automated gate as the rest of this list.)*

**Priority order for the above (D-013):** Tier 1 — Growth Engines, Why PYRAXIS, Portfolio (sell the service). Tier 2 — Process, Future-Proof Systems (credibility). Tier 3 — CTA, Footer (depend on everything above).

## Closeout phases

- [ ] Phase 16 — Performance optimization
- [ ] Phase 17 — Final polish + QA

## Open decisions blocking nothing yet, but needed before relevant phases

- [ ] Resolve `utils/` vs `lib/utils/` duplicate (before Phase 01 utility code) — `ai/memory/known-issues.md` D-006
- [ ] Real logo asset / brand hex / typeface (before Phase 02 completes)
- [ ] Security/auth/data-handling policy (before any backend work)
- [ ] Hosting/CI/CD/env vars (before Phase 17 / launch)
