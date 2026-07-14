# Known Issues

## Open — unresolved, requires a decision

- **`state.json.note` growing unbounded**: each phase's session narrative gets appended to a single long-lived string. Fine now (useful trail while building), but post-ship this should move to `changelog.md`/`completed.md` and `note` should shrink to current-phase-only, for both human and tooling readability. Not done now — flagged per user request (session, post-Phase-13), deliberately deferred to a post-ship pass rather than done mid-build.

- **Particle engine is Canvas2D, not Three.js**: `components/three/ParticleEngine.tsx` implements the single-canvas/single-simulation/single-renderer requirement, but as a 2D canvas rather than Three.js/WebGL — matching the existing pattern in `HeroLogoCanvas`/`ProblemIconCanvas` rather than introducing a new dependency. `three` is still not in `package.json`. Revisit if a scene needs true 3D (the manual's globe/Earth scene in Future-Proof Systems/CTA is the likely forcing function).
- **Hero/Problem canvases not yet migrated into the global engine**: `HeroAmbientParticles`, `HeroLogoCanvas`, and `ProblemIconCanvas` are still self-contained per-component canvases, coexisting with the new global `ParticleProvider`/`ParticleEngine`. This is the second half of the parallel-systems issue below — the global engine now exists (Phase 04 shipped, see `ai/memory/decisions.md` D-012), but folding the two existing scene-owned canvases into it was deliberately left out of that pass so two already-shipped, already-passing scenes weren't rewritten in the same change as new infrastructure.
- `ai/specs/growth-system.md` remains UNKNOWN/unfilled even though the scene now exists — built directly from `manuals/05-experience-blueprint.md` §11 per this file's own guidance to cross-reference manuals rather than duplicate them into specs. Needs someone to actually fill the spec file in as a follow-up.
- Security/auth/data-handling policy is entirely UNKNOWN (see `ai/rules/security.md`).
- Hosting provider, CI/CD pipeline, environment variables: UNKNOWN (see `10-deployment.md`).
- ~~Horizontal scroll for Growth Engines scene (Experience Blueprint §12) is conditional: "only if usability is not compromised on mobile" — no concrete decision criteria given.~~ Resolved: vertical two-column stack below `md`, horizontal row at `md`+. See D-014.
- Exact logo asset (real file, not the placeholder `/logo.svg`) is still not resolved — brand hex and typeface were formalized into `styles/tokens/` in the D-012 pass since those values were already live in production use, but no new logo asset appeared to formalize.
- 2 of 10 `ai/specs/*.md` files remain content-UNKNOWN as of this session (checked directly, not assumed): `growth-system.md` and `footer.md`. The other 8 (`hero`, `problem`, `growth-engines`, `why-pyraxis`, `portfolio`, `process`, `future-proof-systems`, `cta`) are filled — this count was previously logged as "7 of 10 unfilled" and had gone stale as specs got filled in across sessions without updating this line; corrected here. Manuals contain real per-scene detail for the remaining two that hasn't been distributed into specs yet — flagged, not filled, to avoid duplicating manual content against the "one idea, one location" rule.
- **`ai/indexes/components.md` had drifted from reality** (found during CTA/Phase 14 session): Portfolio/ProjectCard, Process, and FutureProofSystems were built in earlier sessions and already had entries in `ai/knowledge/components.json`, but were never added to `ai/indexes/components.md` — `scripts/validate-refs.mjs` caught this (it hadn't been run in a while). All 3 backfilled alongside the new CTA entry in this session. Also note: `validate-refs.mjs`'s "missing-knowledge-entry" check silently no-ops today because it expects `ai/knowledge/components.json` to parse as a top-level array, but the real file is `{components, note, schema, exampleDecomposition}` — `Array.isArray()` on it is `false`, so that half of the check never actually runs. Not fixed this session (out of scope for a CTA/Phase-14 pass); either the validator or the JSON shape needs to change.
- **`STATUS.md`/`TODO.md` still describe the project as of roughly Phase 9** (Growth Engines) even though `ai/state.json`/`ai/knowledge/sections.json`/`ai/knowledge/components.json` all reflect Phases 10-14 (Why PYRAXIS through CTA) as built — a larger sync gap than this CTA session's scope. `TODO.md`'s per-scene checkboxes for Why PYRAXIS/Portfolio/Process/Future-Proof Systems/CTA are left unchecked, which is *correct* per this project's own convention (a box only gets checked once the full Section Completion Gate has run in a real browser, `ai/rules/architecture.md` #7 — none of those scenes have had that gate run yet either), but `STATUS.md`'s phase-9 dashboard number and progress table are genuinely stale and need a real sync pass, not just a CTA-scoped touch-up.
- **CTA (Phase 14) implementation shipped this session** (`components/cta/`) — build/lint/typecheck/`validate-all.mjs` all clean, but the full Section Completion Gate (`ai/rules/architecture.md` #7: real-browser breakpoints, 60fps incl. the convergence beat, Lighthouse, measured CLS) was not run — no browser tool was available in this session. See `ai/checkpoints/phase14.md` for the itemized pass/fail. Same outstanding-QA class already on record for Phase 13.

## Resolved — Phases 01–04, 06 backfilled; Phase 08 built

- ~~Build order deviation: Hero (Phase 05) and Problem (Phase 07) were implemented directly, skipping Phases 01–04 and Phase 06~~ — Phases 01–04 and 06 have now been built (D-012), closing the gap. Phase 08 (Growth System) was then built on top of a complete prerequisite chain, so it does not repeat the deviation. Hero/Problem themselves were not retroactively rewritten to use the new global engine — see the open item above.
- ~~Duplicate utility folder: both root `utils/` and `lib/utils/` exist~~ — root `utils/` did not exist in this repository snapshot; only `lib/utils/` does, and it's the one already imported (`components/navigation/Header.tsx`). D-006 closed as already-resolved.
- ~~Package manager mismatch: checkpoints required pnpm, repo has npm~~ — decided: standardize on npm, since the project's already stable on it. See D-013.

## Resolved in visual-polish pass (post-Phase 07)

- ~~Logo oversized (~44vw/980px, forced into a square container)~~ — an earlier pass sized the Hero logo against generic "make the hero object bigger" design feedback with no real reference to check against. A live reference screenshot (thepyraxis.github.io/pyraxis-website) showed the actual target is ~28–30vw, and that `public/logo.svg`'s viewBox (5986×3384) is a wide mark+wordmark+underline lockup, not a square mark — the square container was adding dead top/bottom padding. Both corrected in `Hero.tsx`/`HeroLogo.tsx`/`HeroLogoCanvas.tsx`; see `ai/specs/hero.md`. If a future request says "make the logo bigger" again, check it against a real reference first — this has now been wrong in both directions.

## Resolved in the documentation consistency pass (post-v1.0)

- ~~Scene naming drift: "Intelligence Core" (manuals) vs "Future-Proof Systems" (`ai/` system)~~ — standardized on **Future-Proof Systems** everywhere in `ai/`. See D-005.
- ~~Missing spec for `growth-engines`~~ — created `ai/specs/growth-engines.md`. See D-007.
- ~~Orphaned, unreferenced `ai/specs/infrastructure-modules.md`~~ — removed. See D-007.
- ~~`ai/indexes/files.md` didn't list `ai/specs/`, `ai/indexes/`, or `ai/logs/`~~ — added.
- ~~`ai/knowledge/architecture.json` listed a `config/` folder that was never scaffolded and doesn't appear anywhere else in the docs~~ — removed; also added the real (previously undocumented) `scripts/` and `.github/workflows/` placeholder folders.

## How to use this file

Log every open bug here with: description, reproduction steps if known, severity, and the file/component affected. Move to `completed.md` history (not deleted) once resolved, and note the fix in `changelog.md`.

## Related Files

`ai/logs/development.md` — Blocking Issues section mirrors the currently active subset of this file.

## Last Updated

Generated from source manuals, version 1.0. Updated in documentation consistency pass v1.1 — see ai/memory/changelog.md.
