# Session Journal

Chronological log, one entry per AI/dev session. Newest entry on top. Append, never rewrite history.

## Format

### YYYY-MM-DD — Session N
- **Worked on:** ...
- **Completed:** ...
- **Decisions made:** ...
- **Blockers hit:** ...
- **Handoff notes:** ...

---

(No sessions logged yet.)

---

### 2026-07-05 — Session (Growth Engines, Phase 09)
- **Worked on:** Growth Engines section per user milestone brief (six engine cards, particle flow, scroll-triggered animation, mouse interaction, mobile layout, accessibility).
- **Completed:** `components/growth-engines/` (engines.ts, icons.tsx, GrowthEngineIconCanvas.tsx, layout.ts, GrowthEnginesHeadline.tsx, GrowthEngineCard.tsx, GrowthEngines.tsx), wired into `app/page.tsx`; `ai/specs/growth-engines.md` filled in; `ai/checkpoints/phase09.md` marked complete; `TODO.md`/`STATUS.md`/`CHANGELOG.md`/`ai/state.json`/`ai/memory/roadmap.md` updated.
- **Decisions made:** D-014 (six engines not seven; vertical-mobile/horizontal-desktop layout; reuse real global providers over a self-contained canvas).
- **Blockers hit:** Found `ai/memory/current.md`/`next.md`/`progress.md`/`completed.md`/`STATUS.md`/`ai/state.json` badly stale relative to the actual codebase (described Phases 01-04 and Growth System as not started when they already existed and passed their checks) — cross-checked against real code per `CLAUDE.md`'s boot-order instruction and corrected all of them.
- **Handoff notes:** `tsc --noEmit`, `eslint`, `next build` all clean. Next up: Phase 10, Why PYRAXIS.

---

### 2026-08-31 — Session (Lenis smooth scroll integration)
- **Worked on:** Adopting `lenis` as the app's scroll driver, replacing native `window.scrollY`, at explicit user request. Given repos `lenis` and `GSAP` as reference libraries.
- **Completed:** Spec written and locked first (`ai/specs/architecture/lenis-smooth-scroll.md`), per CLAUDE.md discipline. Added `lenis` (^1.3.26) dependency. Built `providers/LenisProvider.tsx` (single global instance, `gsap.ticker`-driven RAF, `ScrollTrigger.update()` wired to Lenis's `scroll` event, `prefers-reduced-motion` handled). Wired into `providers/GlobalProviders.tsx` between `MouseProvider` and `ScrollProvider`. Rewrote `providers/ScrollProvider.tsx` internals to read Lenis's `scroll`/`velocity`/`progress` directly instead of `window.scrollY` + manual RAF batching; public `ScrollState`/`useScrollStore()` API unchanged (grep-confirmed zero consumers exist yet). Updated `ai/memory/decisions.md` (D-015), `ai/state.json`, `STATUS.md`, `CHANGELOG.md`, `ai/memory/changelog.md`, `ai/memory/current.md`, `ai/logs/development.md`.
- **Decisions made:** D-015 — Lenis adopted, hand-rolled provider (not a React-wrapper package) to match existing provider pattern; RAF unified under `gsap.ticker` rather than two competing loops, per `ai/rules/architecture.md` #2.
- **Blockers hit:** Found `ai/memory/current.md` and `ai/logs/development.md` stale — both still described Phase 09/Growth Engines as active/next, when `ai/state.json` already showed Phase 16 with Phases 01-15 built and a responsive-refactor pass also complete. Cross-checked against `ai/state.json`'s `completed` array (treated as authoritative) and corrected both files. Also found `ai/memory/changelog.md` (canonical) had stalled at v1.7 while root `CHANGELOG.md` digest had advanced to v2.2 — pre-existing drift, logged to `ai/memory/known-issues.md` rather than force-aligning version numbers.
- **Handoff notes:** `tsc --noEmit`, `eslint .`, `next build` all clean; all 7 routes generate. Next: real-browser verification of Lenis scroll feel (momentum/no jitter) plus the still-pending responsive-refactor breakpoint sweep — both blocked on the same sandbox tooling gap (no Playwright/Lighthouse access here).

---

### 2026-09-01 — Session (section-boundary particle handoff)
- **Worked on:** Adding a scroll transition between sections, at explicit user request — clarified via question to mean a shared visual handoff at all 11 section boundaries, not a page-load intro or a progress indicator.
- **Completed:** Spec written and locked first (`ai/specs/architecture/section-boundary-handoff.md`), corrected mid-session, then implemented. Built `hooks/useSectionHandoff.ts` — first real consumer of `providers/ParticleProvider.tsx`. Sends a small additive density-ramped instruction per section edge (Lenis-scroll-driven), `phase: entering/exiting`, skipped under reduced motion. Wired into all 10 applicable sections covering all 11 boundaries (`Marquee` excluded; `Footer` entering-only). 3 sections needed a `sectionRef` added. Updated `ai/memory/decisions.md` (D-016), `ai/state.json`, `STATUS.md`, `CHANGELOG.md`, `ai/memory/changelog.md`, `ai/memory/current.md`, `ai/logs/development.md`, `ai/indexes/files.md`.
- **Decisions made:** D-016 — additive-not-modulated approach (new instructions layered on top of each section's existing local canvas, nothing migrated or replaced), first real use of the previously-dormant shared particle engine.
- **Blockers hit:** Spec's first draft assumed sections already routed their primary particle system through the shared engine (following memory's description of a prior architectural-cleanup pass) — verified against live code (grep + inspecting 4 section particle files) that this was false; every section uses its own local canvas. Corrected the spec before writing any code rather than building on the wrong premise. Also found the pre-existing `useEdgeFadeOpacity` (Hero→Problem) violates `ai/rules/animation.md` #3's no-crossfade rule — flagged to `ai/memory/known-issues.md`, left coexisting rather than silently fixed or silently replicated across the other 10 boundaries.
- **Handoff notes:** `tsc --noEmit`, `eslint .`, `next build`, `validate-all.mjs` all clean. First Load JS 310kB → 319kB. Next: real-browser visual verification of the handoff at all 11 seams (not yet actually seen rendered — build passing isn't the same as confirming it looks right), plus resolving the flagged crossfade conflict as a separate decision.
