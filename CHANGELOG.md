# CHANGELOG

Human-readable digest. This is a summary — every entry here also exists, in full technical detail, in [`ai/memory/changelog.md`](ai/memory/changelog.md), which is the canonical/detailed log. Don't duplicate full detail here; link back instead.

## v1.9 — CTA polish: hover feedback + Future-Proof→CTA pacing (post-QA fixes)

Two real issues user found in personal manual QA of Phase 13/14, after both were marked Complete:

1. **CTA button hover feedback too subtle** — rest and hover states read as nearly identical. Fixed in `components/cta/CTA.tsx`: added a 3px hover lift (`BUTTON_HOVER_LIFT_PX`, `components/cta/motion.ts`), a border that brightens on hover (transparent → `purple-300/60`), a stronger box-shadow glow (`0.55` opacity/`64px` blur → `0.65`/`72px`), and a slightly stronger inner bloom (`opacity-40` → `opacity-[0.48]`). All still inside the existing 300ms hover transition scale — nothing structurally new.
2. **Perceived dead time between Future-Proof Systems and CTA** — CTA's `IntersectionObserver` used `threshold: 0.2` with no `rootMargin`, so its Earth ring and entry reveal didn't start until the section was already 20% into the viewport, leaving a beat of empty scroll after Future-Proof Systems' exit convergence finished. Fixed by expanding the observer's root bottom margin (`EARLY_ENTER_ROOT_MARGIN = "0px 0px 350px 0px"`, `threshold: 0`, both in `components/cta/motion.ts`) so the ring/reveal begin while CTA is still scrolling into view. No content added — same reveal timeline, just triggered earlier.

`tsc --noEmit`, `next lint`, `next build` all verified clean this session (dependencies installed fresh; prior sessions' clean-build claims for these files could not be independently re-verified since `node_modules` wasn't present until now). Full detail: `ai/memory/changelog.md`.

## v1.8 — Phase 13 + 14 marked Complete (manual QA)

Real-browser QA for Future-Proof Systems (Phase 13) and CTA (Phase 14) — desktop/tablet/mobile breakpoints, smoothness/60fps, CLS/jank — performed by the user directly (this sandbox still cannot run Playwright; `cdn.playwright.dev` is not in the network allowlist). User confirmed both OK. `ai/checkpoints/phase13.md` and `phase14.md` updated accordingly; `ai/memory/roadmap.md` and `ai/memory/progress.md` flipped to Complete/100% for both phases; `ai/state.json` advanced to Phase 15 (Footer). **Caveat carried forward:** these sign-offs are the user's own visual/manual review, not automated Lighthouse/CLS/FPS-trace numbers — flagged here in case a later automated pass surfaces something the manual review missed. Also backfilled `ai/checkpoints/phase11.md` and `phase12.md`, which had been left as unstarted-template stubs despite that work shipping (per `ai/state.json`'s completed-work log) — corrected to match.

## v1.7 — CTA scene implementation (Phase 14)

CTA built against its already-locked spec (`ai/specs/cta.md`): `components/cta/{CTA.tsx, content.ts, motion.ts, layout.ts}`, wired into `app/page.tsx` after Future-Proof Systems. Directly continues Future-Proof Systems' Earth-illusion ring (same geometry functions, new sourceId, bottom-anchored) rather than rebuilding it; one-time particle-convergence-into-button entry beat; primary/secondary links reused verbatim from `HeroButtons.tsx`. Also caught and fixed a real index-drift bug: `ai/indexes/components.md` was missing entries for Portfolio/ProjectCard, Process, and Future-Proof Systems (all built in earlier, unlogged sessions) alongside the new CTA entry. `tsc --noEmit`, `next lint`, `next build`, and `node scripts/validate-all.mjs` all clean. Full Section Completion Gate (real-browser breakpoints/60fps/Lighthouse) not run — no browser tool available this session; see `ai/checkpoints/phase14.md`. **Status: Implementation Complete, Runtime QA Pending** — not marked Complete in `ai/memory/roadmap.md` until a real-browser pass covers breakpoints/60fps/Lighthouse/CLS. Full detail: `ai/memory/changelog.md`.

## v1.6.4 — Future-Proof Systems scene (Phase 13)

Spec written first (`ai/specs/future-proof-systems.md`, with a mandatory Technical Constraint section and Future Upgrade Path) and locked before any component code, same discipline as Phases 11-12. Built `components/future-proof-systems/{FutureProofSystems.tsx, motion.ts, content.ts, layout.ts}`. Cinematic climax rendered as three concurrent shared-engine instructions — scattered network (golden-angle-spiral targets, particleType "network"), a rotating earth-illusion ring, and a wider orbital ring (both particleType "signal", reusing the glow→signal precedent from Why PYRAXIS) — all Canvas2D target-choreography, no Three.js/WebGL added (`three` still not in package.json). Rotation illusion is angular-offset cycling of each ring via a dedicated rAF loop writing directly to the external instruction store (no React state per frame). Cursor-nearest-node hover redirects nearby particles via focusIndex. Exit beat: network positions lerp toward the earth-ring center over a real eased duration before the instruction phase flips to exiting — a physical convergence into the Earth shape CTA (Phase 14) continues, not a crossfade. Reduced-motion path sends one static instruction per layer, no rotation/convergence/cursor polling, per `ai/rules/animation.md` #10. `.placeholder.md` deleted, wired into `app/page.tsx` after Process. `tsc --noEmit`, `next lint`, and `next build` verified clean this session. **Status: Implementation Complete, Runtime QA Pending** — Full Section Completion Gate (real-browser breakpoints/60fps/Lighthouse/CLS) not run. Full detail: `ai/memory/changelog.md`.

## v1.6.3 — Process scene (Phase 12)

Spec written first (`ai/specs/process.md`, several genuine unknowns flagged as Open Questions rather than invented) and locked before any component code, per explicit user instruction mirroring Phase 11's discipline. Built: fixed five-stage vertical progression (Discovery/Strategy/Build/Launch/Scale, `content.ts`, never data-driven), scroll-linked traveling signal dot (no pin/horizontal rail, unlike Portfolio, since the stack is vertical at every breakpoint), ambient particles via shared `ParticleProvider` (shape: nodes, one target per stage, focusIndex biases toward activeStage), accelerating exit handoff on ScrollTrigger onLeave per Blueprint §15. Reduced-motion path renders a static list with no signal. `tsc`/`eslint`/`next build` all verified clean this session. Also found and fixed two doc-sync gaps unrelated to Process code itself: `components.json` was missing Portfolio/ProjectCard entries entirely (predates this session), and its top-level `note` field falsely claimed Phase 03/04 providers weren't built yet (they were, per D-012) — both corrected. Full detail: `ai/memory/changelog.md`.

## v1.6.2 — Portfolio scene (Phase 11)

Spec locked (`ai/specs/portfolio.md`) and synced to shipped code, `projects.ts` populated with 6 real systems, scroll-scrub rail built. Runtime QA (user screenshots) found and fixed two real bugs: (1) card hover glow/shadow clipped top+right because CSS forces `overflow-y` to compute `auto` whenever `overflow-x` is non-visible on the same box, and wrapper padding was too small to contain the 44px shadow blur + 10px hover lift — fixed by widening wrapper padding (px-11/pt-14/pb-12, mx matched to net zero offset); (2) that padding increase silently broke the scroll-scrub distance math (`wrapper.clientWidth` now included the new padding, undershooting `scrollLength` so the last card's right edge never fully scrolled into view) — fixed by subtracting the wrapper's own computed padding before calculating visible track width. Keyboard nav, mobile snap, and cleanup/unmount logic eyeballed clean against spec. Full detail: `ai/memory/changelog.md`.

## v1.6.1 — Why PYRAXIS scene (Phase 10)

Three-question belief section built, Low-intensity rest beat per Visual Rhythm Map — particle density (0.05 / 0.02 reduced-motion) kept below Growth Engines' 0.12, no card grid, no hover interaction. Review pass found and fixed two real bugs: `particleType` "glow" gets no special rendering in `ParticleEngine.tsx` (switched to "signal"), and heading hierarchy (point labels promoted `span` → `h3` to match Problem/Growth Engines pattern). `tsc --noEmit`, `eslint`, `next build` all clean; see `ai/checkpoints/phase10.md`. Full detail: `ai/memory/changelog.md`.

**Note on this backfill (v1.6.1–v1.6.4):** this changelog and `STATUS.md` were left at Phase 09 while Phases 10–13 shipped in the interim without matching entries; the four entries above were reconstructed from `ai/state.json`'s completed-work log and the corresponding checkpoint/spec files as the source of truth, and describe only work already on record there — no new work is claimed. `ai/memory/roadmap.md` and `ai/memory/progress.md` still show Phases 11–13 as "not started"/"Built" (inconsistent with `ai/state.json`) and were intentionally left untouched by this pass; that drift is separate from this changelog/STATUS.md sync.

## v1.6 — Growth Engines scene (Phase 09)

Growth Engines built: six reusable engine cards (Website, Lead, Booking, WhatsApp, Review, AI Assistant), particle-built icons, hover/keyboard focus with ambient-particle redirect, vertical stack on mobile / horizontal row on desktop. Also caught and fixed several memory-tracking files (`current.md`, `next.md`, `progress.md`, `completed.md`, `STATUS.md`, `ai/state.json`) that had drifted out of sync with the actual codebase. `tsc --noEmit`, `eslint`, `next build` all clean. Full detail: `ai/memory/changelog.md`.

## v1.5 — Hero + Problem scenes, doc sync

Hero (Phase 05) and Problem (Phase 07) scenes implemented as real, checkpoint-passing code — built directly, skipping Phases 01–04 and 06 (a tracked deviation, not a correction, from "build sequentially"; see `ai/memory/known-issues.md`). Synced the documentation system to match: `ai/indexes/components.md` + `ai/knowledge/components.json` now list every real component, `ai/specs/hero.md` + `problem.md` filled in, `ai/checkpoints/phase05.md` + `phase07.md` marked complete, roadmap/state.json/progress/current/next/STATUS/TODO updated. `node scripts/validate-all.mjs` passes. Full detail: `ai/memory/changelog.md`.

## v1.4 — Architecture audit + automated validators

Full repo architecture audit. Found and fixed one real gap (8 `ai/rules/*.md` files missing a required footer); everything else — 124 files' worth of links, state sync, and indexes — checked out clean. Added real automated checker scripts at `scripts/` (previously an empty placeholder) so future sessions can verify documentation consistency in seconds instead of a manual re-audit. Full detail: `ai/memory/changelog.md`.

## v1.3 — Cross-tool compatibility pointer

Added `AI.md` (root) — tiny redirect to `CLAUDE.md` for non-Claude AI tools that look for that filename first. Full detail: `ai/memory/changelog.md`.

## v1.2 — AI-native scaffolding pass

Added the machine/human status-tracking layer on top of the existing documentation system: `ai/bootstrap.md`, `ai/state.json`, `ai/scripts/` (reusable maintenance prompts), `ai/checkpoints/` (one file per roadmap phase, 17 total), and this file, `STATUS.md`, and `TODO.md` at the repo root. No application code changed — none exists yet. Full detail: `ai/memory/changelog.md`.

## v1.1 — Documentation consistency pass

Resolved naming drift ("Intelligence Core" → "Future-Proof Systems"), one orphaned spec removed, one missing spec (`growth-engines`) created, and several small structural doc gaps closed. Full detail: `ai/memory/changelog.md`.

## v1.0 — Documentation baseline

Five specification manuals + master index authored. `ai/` AI Operating System generated from them. No application code — documentation only. Full detail: `ai/memory/changelog.md`.
