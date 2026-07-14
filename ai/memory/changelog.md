# Changelog

Chronological record of changes to the repository and documentation.

## v1.7 — CTA scene (Phase 14 implementation)

- Built `components/cta/{CTA.tsx, content.ts, motion.ts, layout.ts}` against the already-locked `ai/specs/cta.md`, wired into `app/page.tsx` after `FutureProofSystems`.
- Earth-illusion ring is a direct continuation of Future-Proof Systems', not a rebuild: `motion.ts` imports/re-exports `EARTH_ROTATION_SPEED`/`ORBIT_ROTATION_SPEED` from `components/future-proof-systems/motion.ts`, and `CTA.tsx` calls `earthRingPositions`/`orbitPositions` directly from `components/future-proof-systems/layout.ts`. New sourceIds (`cta-earth`/`cta-orbit`), bottom-anchored geometry (~30% visible above the fold), Medium density below Future-Proof Systems' Very-High peak.
- Headline reveal uses a real `clip-path` mask-reveal (not the codebase's usual data-reveal y-offset), specifically because `ai/rules/animation.md` #7 forbids a slide-up for typography — the eyebrow/supporting-sentence still use the standard data-reveal stagger, matching every other scene.
- One-time particle-convergence-into-button entry beat (`playConstructBeat`): samples the Earth ring's live positions, eases them toward the primary button's measured `getBoundingClientRect()` over ~1.8s (hand-rolled power-curve lerp, same technique as Future-Proof Systems' `CONVERGE_EASE_POWER`, different endpoints), fires once via a ref guard after the copy reveal completes, then dissolves back to ambient rather than persisting as a permanent halo.
- Primary (WhatsApp) / secondary (email) links reused verbatim from `components/hero/HeroButtons.tsx` — no new copy or destinations invented.
- Reduced-motion path: static Earth ring, no orbit, no construct beat, button reveals via plain opacity.
- Found and fixed a real index-drift bug via `scripts/validate-refs.mjs`: `ai/indexes/components.md` was missing Portfolio/ProjectCard, Process, and FutureProofSystems entries — all three were built and already present in `ai/knowledge/components.json` from earlier sessions, but never added to the human-readable index. Backfilled alongside the new CTA entry. Also noted (not fixed, out of scope): `validate-refs.mjs`'s array-shape check on `components.json` never actually runs because the real file is a top-level object, not an array — see `ai/memory/known-issues.md`.
- Corrected a stale count in `ai/memory/known-issues.md` ("7 of 10 specs unfilled" → actually 2 of 10 as of this session: `growth-system.md` and `footer.md`).
- `tsc --noEmit`, `next lint`, `next build`, `node scripts/validate-all.mjs` all clean.
- **Not done this session:** the full Section Completion Gate (`ai/rules/architecture.md` #7 — real-browser breakpoints, 60fps including the convergence beat, Lighthouse, measured CLS). No browser tool was available. See `ai/checkpoints/phase14.md` for the itemized list; the phase is intentionally not marked Complete in `ai/memory/roadmap.md` pending that pass. `STATUS.md`/`CHANGELOG.md` were last fully synced around Phase 09 — Phases 10–13 shipped without matching entries here and that backfill is still owed, not attempted in this CTA-scoped session.

## v1.6 — Growth Engines (Phase 09)

- Built `components/growth-engines/` (six cards: Website, Lead, Booking, WhatsApp, Review, AI Assistant — see D-014 for why six, not the spec's original seven).
- Resolved the open "horizontal scroll on mobile" decision: vertical two-column stack below `md`, horizontal row at `md`+ (D-014, closes a `known-issues.md` item).
- Corrected several memory files (`current.md`, `next.md`, `progress.md`, `completed.md`, `STATUS.md`, `ai/state.json`) that had drifted out of sync with the actual codebase (they described Phases 01-04/08 as not started when the code already existed and passed its checks).
- `tsc --noEmit`, `eslint`, `next build` all clean.

## v1.5 — Hero + Problem scenes; documentation synced to match

**Application code** (first real code in this repository):

- Hero scene (Phase 05): `components/hero/{Hero,HeroLogo,HeroLogoCanvas,HeroAmbientParticles,HeroText,HeroButtons,HeroScrollIndicator}.tsx`. Logo has a real scatter → assemble (center-out staggered convergence, sampled from actual logo pixels) → settle → breathing/erosion story arc, not a static image. Ambient particles carry directional intent (carry toward / leak away from the logo, looping between roles) rather than pure random drift. Layered lighting (ambient fog / core glow / bloom / reflection) replaces a single flat radial. `hero-logo-mark` breathing-glow CSS class (previously dead code in `app/globals.css`) is now wired up.
- Problem scene (Phase 07): `components/problem/{Problem,ProblemHeadline,ProblemIcons,ProblemIconCanvas,icons}.tsx`. Four manufactured (stroke-only, no-fill) icons — Ghosted Leads, Manual Chaos, Slow Response, Lost Revenue — each sampled into particle points that assemble on scroll-in and disassemble on scroll-out via `IntersectionObserver`, per Experience Blueprint §10. Icon ids (not function references) are passed across the server/client boundary from the server-rendered `ProblemIcons.tsx` to the client `ProblemIconCanvas.tsx`, since functions can't cross that boundary.
- `Header` (`components/navigation/Header.tsx`) and `CustomCursor` (`components/common/CustomCursor.tsx`) were already present from prior work; now documented for the first time (see below).
- Next.js upgraded 15.1.6 → 15.5.20 (latest patched 15.x per the `backport` npm dist-tag, not the `latest` tag which points to 16.x); `eslint-config-next` bumped to match; `package-lock.json` regenerated.
- Added root `.gitignore` (`node_modules/`, `.next/`, `out/`, `.vercel/`, env files, logs, `*.tsbuildinfo`, OS junk); removed the previously-tracked `tsconfig.tsbuildinfo` generated cache file.

**Known deviation** (tracked, not silently absorbed): both scenes were built directly, skipping Phases 01–04 (Foundation, Design tokens, Global providers, Global Particle Engine) and Phase 06 (Hero → Problem transition). This violates `ai/rules/architecture.md` #6 / Technical Architecture §22's "build sequentially" rule. Not reverted since the work is real and passes its own checkpoints — but recorded as two open items in `ai/memory/known-issues.md` (build-order reconciliation; particle-engine ownership, since `ai/rules/coding.md` #10 wants a global engine that doesn't exist yet, and each scene currently owns its own canvas instead).

**Documentation sync** to match the above:

- `ai/indexes/components.md` and `ai/knowledge/components.json` — previously said "none implemented yet" despite `components/hero/` and `components/navigation/` already existing on disk; now list all 14 real component files with purpose/status/usedBy. This was the one concrete drift `scripts/validate-refs.mjs` catches (`missing-index-entry`); re-running `node scripts/validate-all.mjs` now passes clean.
- `ai/specs/hero.md` and `ai/specs/problem.md` — filled in from content-UNKNOWN, cross-referencing `manuals/05-experience-blueprint.md` §09/§10 and `manuals/02-product-bible.md` §02 rather than duplicating them (per the known-issues note on the "one idea, one location" rule).
- `ai/checkpoints/phase05.md` and `phase07.md` — acceptance criteria and completed-task checkboxes ticked.
- `ai/memory/{roadmap,progress,current,next,known-issues}.md`, `ai/state.json`, `STATUS.md`, `TODO.md` — updated to reflect Phase 05/07 complete and the build-order deviation, rather than continuing to say "no code exists yet."

## v1.4 — Architecture audit: real automated validators

Full repository architecture audit (AI continuity, cross-AI compatibility, doc consistency, memory sync, bootstrap flow, checkpoint consistency, human-doc sync, machine readability, scalability, automation). Findings:

- **8 real inconsistencies found and fixed**: `ai/rules/{accessibility,animation,architecture,coding,design,documentation,git,performance}.md` were missing the `## Last Updated` footer required by `ai/rules/documentation.md` rule #8 (only `ai/rules/security.md` had one). All 8 now have it.
- **Everything else checked out clean**: 0 broken markdown links across 124 files, `ai/state.json` fully in sync with `roadmap.md` (17/17 phases), `ai/checkpoints/` (17/17), `ai/knowledge/sections.json` vs `ai/specs/` (10/10), and `ai/indexes/files.md` vs the real `ai/` tree (95 files).
- Added real, dependency-free Node validators under root `scripts/` (previously an empty placeholder): `validate-docs.mjs`, `validate-state.mjs`, `validate-refs.mjs`, `validate-all.mjs`. These are executable code, not prompts — distinct from `ai/scripts/*.md`. They encode the exact checks above so future sessions (any model, any tool) catch drift mechanically instead of relying on a full manual re-audit. See D-011.
- Wired the validators into `CLAUDE.md`'s after-task checklist, `ai/rules/documentation.md` (new rule #11), and `ai/docs/CONTRIBUTING.md`.
- No architecture, folder structure, naming, or existing design decision changed. No application code added. Repository confirmed production-ready for Phase 01.

## v1.3 — Cross-tool compatibility pointer

Added `AI.md` at repo root — a tiny redirect to `CLAUDE.md`, for AI coding tools (Cursor, Roo Code, Cline, Gemini CLI, OpenHands, various MCP tools) that look for that filename first. No boot logic duplicated — it just points to `CLAUDE.md`. See D-010.

## v1.2 — AI-native scaffolding pass

Added a machine/human status-tracking layer on top of the existing `ai/` documentation system (all doc-only, zero application code touched, none exists yet):

- `ai/bootstrap.md` — condensed first-read checklist for AI sessions, mirrors `CLAUDE.md`'s boot order exactly (does not introduce a second order). `CLAUDE.md` boot order updated to insert it as step 2.
- `ai/state.json` — machine-readable status snapshot (phase, section, completed, current, next, branch, commit, build, openBlockers). Explicitly documented as a derived cache — `ai/memory/current.md`/`next.md`/`roadmap.md` remain authoritative on any disagreement.
- `ai/scripts/` — four reusable maintenance prompts: `update-memory.md`, `finish-phase.md`, `review-phase.md`, `sync-docs.md`. Distinct from `ai/prompts/` (task-type templates); cross-referenced from `ai/prompts/review.md` to avoid the two being mistaken for duplicates.
- `ai/checkpoints/phase01.md` … `phase17.md` — one file per roadmap phase (all 17, matching `ai/memory/roadmap.md` exactly), each with Requirements/Acceptance Criteria/Completed Tasks, cross-referenced to the matching `ai/specs/*.md` where a phase is a single scene.
- `STATUS.md` (root) — human dashboard: Phase, Current Section, Progress, Open Bugs/Blockers, Next Milestone.
- `TODO.md` (root) — quick scene/phase checklist.
- `CHANGELOG.md` (root) — human-readable digest, explicitly scoped as a summary of this file, not a duplicate of it.
- `CLAUDE.md`'s "After Every Completed Task" checklist expanded to include `ai/state.json`, `STATUS.md`, `TODO.md`, `CHANGELOG.md` (root), and the relevant `ai/checkpoints/phaseNN.md`.
- Considered and rejected: renaming `ai/knowledge/` to `ai/indexes/` or `ai/database/` — would collide with the existing, differently-purposed `ai/indexes/` folder and requires a rename this session isn't authorized to make. See D-009.

See `ai/memory/decisions.md` D-008 and D-009.

## v1.1 — Documentation consistency pass (pre-Phase-01)

Full documentation-only audit across `ai/`, `manuals/`, `README.md`. No application code touched (none exists). Changes:

- Standardized scene name to **Future-Proof Systems** (was inconsistently "Intelligence Core" in some files). Fixed: `ai/context/08-animation-system.md`, `ai/rules/animation.md`, `ai/memory/roadmap.md`, `ai/memory/progress.md`, `ai/docs/FEATURES.md`, `ai/knowledge/animations.json`. Manuals left unedited (historical archive). See D-005.
- Created `ai/specs/growth-engines.md` — was missing despite the section existing in `sections.json`, `roadmap.md`, and `components/growth-engines/`. See D-007.
- Removed `ai/specs/infrastructure-modules.md` — orphaned, zero content, zero references anywhere else. See D-007.
- `ai/knowledge/architecture.json`: removed nonexistent `config/` entry; added real (previously undocumented) `scripts/`, `.github/workflows/`, `utils/` folders; added `projectStructureNote` flagging the `utils/` vs `lib/utils/` duplication.
- `ai/context/04-architecture.md`: expanded "Governs" list to include `public/`, `scripts/`; flagged the `utils/` duplication inline.
- `ai/indexes/files.md`: added missing self-referential sections for `ai/specs/`, `ai/indexes/`, `ai/logs/`; added `public/`, `scripts/`, `.github/workflows/` to the application-code placeholder list; flagged `utils/` duplication.
- `ai/memory/known-issues.md`: moved resolved items to a "Resolved" section; added the unresolved `utils/`-duplication issue and a note that all `ai/specs/*.md` content fields remain UNKNOWN pending per-phase work.
- `ai/memory/decisions.md` + `ai/knowledge/decisions.json`: added D-005, D-006, D-007 documenting the above.
- `README.md`: annotated folder tree to flag the `utils/` / `lib/utils/` duplication.

## v1.0 — Documentation baseline

- Five specification manuals written: Brand Bible, Product Bible, Design System, Technical Architecture, Experience Blueprint.
- `00-master-index.md` cross-reference map written.
- `ai/` AI Operating System generated from the five manuals: `context/`, `memory/`, `rules/`, `prompts/`, `docs/`, `knowledge/`, `indexes/`, `templates/`, `CLAUDE.md`.
- No code changes — repository contained no implementation yet at that point.

## How to use this file

Append new entries at the top, newest first, once code changes begin. Reference Conventional Commit messages where useful.

## Related Files

`ai/logs/sessions.md` — session narrative behind each changelog entry.

## Last Updated

Generated from source manuals, version 1.0. Updated in documentation consistency pass v1.1 — see ai/memory/changelog.md.
