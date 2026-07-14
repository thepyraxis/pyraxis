# Decisions

Architectural decisions with reasoning, chronological.

## D-001 — Adopt centralized global engines (Particle, Scroll, Mouse) instead of per-section systems

**Date:** Source manuals, v1.0 (pre-code)
**Decision:** Sections never own particles, scroll logic, or cursor tracking. One global `ParticleProvider`, `ScrollManager`, `MouseManager` receive instructions from sections and do the work.
**Reasoning:** Prevents duplicate/inconsistent implementations across ten scenes; makes the site behave as "one living system" rather than a page collection.
**Source:** Technical Architecture §06, §08, §09.

## D-002 — Token-only design system, no hardcoded visual values

**Decision:** All color, spacing, radius, shadow, glow, blur, motion, and z-index values live in `styles/tokens/`. Components reference tokens only.
**Reasoning:** Allows changing the entire site's personality by editing token files alone; enforces the "Less. But better." philosophy at the code level.
**Source:** Design System §01, §26.

## D-003 — Sequential, single-phase build order

**Decision:** Build the 17 phases in `roadmap.md` strictly in order; never build multiple major sections simultaneously.
**Reasoning:** Parallel section development tends to reinvent particle/scroll/mouse systems independently, breaking D-001.
**Source:** Technical Architecture §22.

## D-004 — No fake social proof

**Decision:** Never use fabricated statistics, awards, testimonials, clients, or case studies anywhere in copy or portfolio.
**Reasoning:** Brand trust is built on visible engineering/craft, not claims; fabrication would also be a durable reputational risk once discovered.
**Source:** Brand Bible §08, Product Bible §09.

## D-005 — Standardize scene name on "Future-Proof Systems" (not "Intelligence Core")

**Date:** Documentation consistency pass, post-v1.0
**Decision:** The tenth-scene climax is canonically named **Future-Proof Systems** (id `future-proof-systems`) across all `ai/` files. The original five manuals use "Intelligence Core" throughout — this is a known, intentional divergence from the manuals, not an error to re-sync.
**Reasoning:** By the time this was audited, `components/future-proof-systems/` was already scaffolded, `ai/specs/future-proof-systems.md` already existed, and `ai/knowledge/sections.json`, `ai/knowledge/architecture.json`, `ai/docs/COMPONENTS.md`, and `ai/indexes/animations.md` already used the new name consistently. Reverting to match the manuals would require renaming a real folder and a real file, which is out of scope for a documentation-only pass and violates the frozen-architecture constraint. The cheaper, lower-risk fix was to correct the six remaining stray "Intelligence Core" mentions (`ai/context/08-animation-system.md`, `ai/rules/animation.md`, `ai/memory/roadmap.md`, `ai/memory/progress.md`, `ai/docs/FEATURES.md`, `ai/knowledge/animations.json`) to match the majority/physical reality.
**Alternatives considered:** Reverting the newer files back to "Intelligence Core" to match the manuals exactly — rejected because it would require renaming the already-scaffolded folder/spec file, which this session is not authorized to do.
**Source:** Manuals `01-brand-bible.md`, `03-design-system.md`, `04-technical-architecture.md`, `05-experience-blueprint.md`, `00-master-index.md` (all say "Intelligence Core") vs. `ai/knowledge/sections.json`, `ai/knowledge/architecture.json`, `ai/specs/future-proof-systems.md`, `components/future-proof-systems/` (all say "Future-Proof Systems"). Manuals are kept as an unedited historical archive; this decision applies to `ai/` and the codebase going forward only.

## D-006 — Flag (not resolve) the duplicate `utils/` vs `lib/utils/` folders

**Date:** Documentation consistency pass, post-v1.0
**Decision:** Both `utils/` (root) and `lib/utils/` exist as scaffolded placeholders. No source manual specifies two utility locations; `ai/knowledge/architecture.json` only ever documented `lib/utils/`. This is left unresolved and flagged in `ai/memory/known-issues.md` rather than fixed, because fixing it means deleting or merging a real folder, which is a structural/architecture change outside a documentation-only session.
**Reasoning:** Consistent with the instruction not to reorganize folders or remove existing systems without explicit approval. Recording the ambiguity is the correct documentation-only action; resolving it requires a human (or an explicitly authorized future session) to pick one location before any utility code is written in Phase 01.
**Recommendation (non-binding):** Consolidate on `lib/utils/` since it's the one already reflected in `ai/knowledge/architecture.json` and `ai/context/04-architecture.md`, and remove the root `utils/` placeholder at that time.
**Source:** `ai/context/04-architecture.md`, `ai/knowledge/architecture.json`, `README.md` folder tree (shows both), repository filesystem.

## D-007 — Removed orphaned `ai/specs/infrastructure-modules.md`; created `ai/specs/growth-engines.md`

**Date:** Documentation consistency pass, post-v1.0
**Decision:** Deleted `ai/specs/infrastructure-modules.md` (fully UNKNOWN skeleton, referenced nowhere else in the repository, and not a match for any id in `ai/knowledge/sections.json` or `ai/memory/roadmap.md`). Created `ai/specs/growth-engines.md` (fully UNKNOWN skeleton, matching the existing spec template), since the `growth-engines` section already existed in `sections.json`, `roadmap.md`, and `components/growth-engines/` but had no spec file.
**Reasoning:** `infrastructure-modules.md` had zero real content and zero inbound references — safe to remove per the "remove outdated or conflicting documentation" mandate with no information loss. `growth-engines` is an explicitly required spec per the boot order in `CLAUDE.md` step 5 ("the spec for whatever section/component is in scope") and was a genuine gap.
**Source:** `ai/knowledge/sections.json`, `ai/memory/roadmap.md` Phase 09, `components/growth-engines/`.

## D-008 — Add AI-native status-tracking layer (bootstrap, state.json, scripts, checkpoints, root status files)

**Date:** Documentation consistency pass v1.2
**Decision:** Added `ai/bootstrap.md`, `ai/state.json`, `ai/scripts/*.md`, `ai/checkpoints/phase01–17.md`, and root `STATUS.md`/`CHANGELOG.md`/`TODO.md`. `CLAUDE.md`'s boot order and after-task checklist updated to reference them.
**Reasoning:** User-requested improvements for a faster/machine-friendlier session bootstrap and clearer at-a-glance status. Kept additive only — no existing file renamed, no folder reorganized, `CLAUDE.md` remains the single authoritative boot order (`ai/bootstrap.md` mirrors it rather than defining a competing one), and `ai/state.json`/root files are explicitly documented as derived caches subordinate to `ai/memory/*.md`, to avoid creating a second source of truth.
**Alternatives considered:** Making `ai/state.json` or `STATUS.md` authoritative instead of `ai/memory/` — rejected, would fragment "single source of truth" and contradict `ai/rules/documentation.md` #1 ("one idea, one location").
**Source:** User request (session), `ai/rules/documentation.md`.

## D-009 — Rejected: renaming `ai/knowledge/` to `ai/indexes/` or `ai/database/`

**Date:** Documentation consistency pass v1.2
**Decision:** Not done. `ai/knowledge/` keeps its current name.
**Reasoning:** The repository already has an `ai/indexes/` folder with a distinct, established purpose (human-readable "what exists and where" lookup, per `ai/indexes/files.md`) — reusing that name for `ai/knowledge/` (machine-readable JSON database) would collide, not clarify. `ai/database/` was a viable alternative but the rename itself requires touching every cross-reference across `CLAUDE.md`, `ai/rules/documentation.md`, `ai/indexes/files.md`, and every context/rules file that links to `ai/knowledge/*.json` — a structural rename outside a documentation-only session's authorization (architecture/folder structure is frozen per session start).
**Alternatives considered:** `ai/database/` — left as a live option for a future session if explicitly authorized to perform the rename.
**Source:** User feedback (session, flagged as "not mandatory").

## D-010 — Add `AI.md` root pointer for non-Claude AI tools

**Date:** Documentation consistency pass v1.3
**Decision:** Added a one-paragraph `AI.md` at repo root that redirects to `CLAUDE.md`. Contains no boot logic of its own.
**Reasoning:** Several coding assistants (Cursor, Roo Code, Cline, Gemini CLI, OpenHands, various MCP tools) look for `AI.md` before `CLAUDE.md`. A pointer file costs nothing and can't drift out of sync since it has no content to keep current — it just says "go read `CLAUDE.md`."
**Alternatives considered:** Duplicating the boot order into `AI.md` directly — rejected, would create a third copy of the boot order alongside `CLAUDE.md` and `ai/bootstrap.md`, violating "one idea, one location."
**Source:** User request (session).

## D-011 — Add real automated validators under root `scripts/`

**Date:** Architecture audit pass v1.4
**Decision:** Populated the previously-placeholder root `scripts/` folder with three dependency-free Node scripts — `validate-docs.mjs` (broken links, missing "Last Updated" footers), `validate-state.mjs` (`ai/state.json` vs `roadmap.md`/checkpoints/`sections.json`/specs sync), `validate-refs.mjs` (index/knowledge parity, currently a no-op until real components exist) — plus `validate-all.mjs` to run all three. `CLAUDE.md`'s after-task checklist, `ai/rules/documentation.md` (new rule #11), and `ai/docs/CONTRIBUTING.md` now reference them.
**Reasoning:** The documentation-consistency rules in this repo (one idea one location, state.json/memory sync, index/knowledge parity) were previously enforced only by an AI or human reading everything and noticing drift. That doesn't scale to 500+ components / 1000+ commits / multiple developers and AI agents working in parallel — exactly the scale this repo is explicitly designed to reach. Running these scripts turns "did the docs drift?" from a judgment call into a pass/fail check, in seconds, with no new dependencies (plain Node `fs`/`path` only).
**Verification:** All three scripts were run against the repository as part of this pass. They found 8 real violations (missing `## Last Updated` footers in `ai/rules/{accessibility,animation,architecture,coding,design,documentation,git,performance}.md`, rule #8) — fixed. All other checks passed, confirming the existing documentation system was already correctly cross-linked.
**Alternatives considered:** A CI-only check (GitHub Action) — deferred, since `.github/workflows/` isn't scaffolded yet and no CI pipeline is chosen (`ai/docs/DEPLOYMENT.md` still UNKNOWN); the scripts are CI-ready and referenced there for when that lands. A TypeScript + ts-node setup — rejected for now, since it would require a `package.json`/dependency before Phase 01 exists, which is out of scope for a documentation-only session; plain `.mjs` with zero dependencies runs today under any Node 18+.
**Source:** User request (session) — automation audit criteria #10.

## D-012 — Phases 01–04, 06, 08 built; particle engine implemented as Canvas2D, not Three.js

**Date:** Infra + Growth System pass (session).
**Decision:** Resolved the build-order violation logged against Hero/Problem (open item in `ai/memory/known-issues.md`) by building the missing infrastructure first: Phase 01 (utils/lib duplication was already resolved — no root `utils/` existed in this snapshot), Phase 02 (`styles/tokens/` — colors, surfaces, motion scale, density budgets, all mirroring values already live in `tailwind.config.ts`/`layout.tsx` rather than inventing new brand values), Phase 03 (`providers/` — Theme, Animation, Performance, Mouse, Scroll, Particle, composed once in `GlobalProviders` and mounted in `app/layout.tsx`), Phase 04 (global particle engine: `components/three/ParticleEngine.tsx`, struct-of-arrays pool with object pooling and the full DNA field set, density budgets per device tier, instruction API sections call via `useParticles()`), Phase 06 (Hero → Problem transition, physical particle burst, no crossfade), and Phase 08 (Growth System scene — circular 8-node ecosystem per Experience Blueprint §11).
**Scope reductions, logged rather than silently shipped:**
- The particle engine is Canvas2D (`<canvas>` + 2D context), not Three.js/WebGL, matching the pattern `HeroLogoCanvas`/`ProblemIconCanvas` already use in production. `three` isn't in `package.json`. Migrating Hero/Problem's own canvases into this new global engine (the other open item under this same known-issue) was *not* done in this pass — left for a dedicated migration pass so two shipped, passing scenes aren't rewritten in the same change as new infrastructure.
- The particle behavior state machine (Idle → Searching → Travelling → Connecting → Building → Living → Breaking → Returning) is implemented as three phases — entering / living / exiting — not all eight named states. See the fuller note in `components/three/particleTypes.ts`.
- `ai/specs/growth-system.md` is still UNKNOWN/unfilled; the actual scene was built directly from `manuals/05-experience-blueprint.md` §11 per `ai/memory/known-issues.md`'s instruction to cross-reference rather than duplicate. Filling the spec file itself is still open.
- Package manager mismatch (checkpoint requires pnpm; repo has `package-lock.json`/npm) was left as-is — flagged, not converted, since it's orthogonal to this pass and converting a lockfile blind risks breaking a build nobody asked to touch.
**Reasoning:** Building Growth System (Phase 08) without its prerequisites would have been a third build-order violation on top of the two already logged. Resolving the actual blocking chain was cheaper and safer than working around it again.
**Verification:** `npx tsc --noEmit`, `npx eslint .`, and `npx next build` all pass clean (one pre-existing font-loading lint warning, unrelated to this change).
**Source:** User request (session) — see `ai/memory/known-issues.md` open item and `ai/memory/roadmap.md` Phase 08 dependency chain.

## D-013 — Package manager: npm (final); Section Completion Gate extended; remaining phases prioritized

**Date:** Team review pass (session).
**Decision:**
1. **Package manager:** npm, final. The pnpm requirement in the original checkpoints (`ai/checkpoints/phase01.md`) is superseded — the project has been stable on npm/`package-lock.json` throughout, no pnpm lockfile was ever generated, and switching this late has no upside over documenting reality.
2. **Section Completion Gate extended** (`ai/rules/architecture.md` #7, `ai/templates/section-template.md`): added "no console errors/warnings" and "no unexpected layout shift (CLS)" to the existing desktop/tablet/mobile/animations/mouse/accessibility/typography/60fps/Lighthouse/transition list. Applies to every section going forward, including retroactively verifying Hero/Problem/Growth System before calling them done.
3. **Remaining phase priority** (roadmap order unchanged, this is delivery sequencing within it): Tier 1 — Growth Engines, Why PYRAXIS, Portfolio (the sections that sell the service). Tier 2 — Process, Future-Proof Systems (credibility reinforcement). Tier 3 — CTA, Footer (depend on everything above being in place first).
**Reasoning:** Converting a stable npm project to pnpm this late has no upside and real risk (regenerating a lockfile blind). The gate was already right in spirit (`ai/rules/architecture.md` #7) but missing two checks that catch real regressions a renders-fine section can still have. Tiering matches which sections carry the sales/credibility weight of the site versus which are structurally dependent closers.
**Verification:** N/A — process/documentation decision, not a code change. Existing "Complete" sections (Hero, Problem, Growth System) have NOT yet been re-verified against the two new gate items; that's still open, not silently assumed passing.
**Source:** User review (session).

## D-014 — Growth Engines: six named engines (not seven); vertical stack on mobile

**Date:** Session (Phase 09 build).
**Decision:**
1. Built with six engines — Website, Lead, Booking, WhatsApp, Review, AI Assistant — per explicit user brief for this milestone, not the seven-engine list in `ai/specs/growth-engines.md`/`ai/knowledge/sections.json` (Lead, Booking, Follow-up, Retention, Review, Referral, Intelligence). One reusable `GrowthEngineCard` still used for all six (`ai/rules/coding.md` #5/#6 satisfied); the count mismatch is content, not architecture.
2. Horizontal-scroll-on-mobile question (`ai/memory/known-issues.md` open item) resolved: **vertical two-column stack below `md`**, horizontal single row at `md`+. Chosen for touch-target size and readability; the emotional beat (engines assembling in sequence) is preserved via each card's independent icon-construction animation regardless of grid shape (`ai/rules/performance.md` #9).
3. Reused the real global engines that already exist in the codebase (`ParticleProvider`, `AnimationProvider`) rather than a self-contained canvas for ambient/traveling particles — `ai/memory/current.md`/`next.md` were stale on this point (they describe Phases 01–04 as skipped) and were cross-checked against actual code (`components/growth-system/GrowthSystem.tsx` already consumes both) before writing new code, per the CLAUDE.md boot-order instruction to resolve such mismatches rather than assume either source stale. Per-icon particle *construction* (assembly/disassembly) stays a local Canvas2D micro-effect, matching the existing `ProblemIconCanvas` precedent — that's a fixed shared animation, not ambient traffic the global engine's shape vocabulary covers.
**Reasoning:** The user-supplied module list is the authoritative brief for this specific milestone; the spec/knowledge files predate it and were never reconciled. Vertical mobile avoids the usability compromise Blueprint §12 warns against. Using the real providers keeps this addition consistent with the most recently shipped section instead of the stale memory notes.
**Verification:** `tsc --noEmit`, `eslint`, `next build` all clean.
**Source:** User request (session, Growth Engines milestone brief).

## Template for new entries

```
## D-00X — <short title>
**Date:** <date>
**Decision:** <what was decided>
**Reasoning:** <why>
**Source:** <manual/section or discussion>
```

## Related

`ai/templates/decision-template.md`, `ai/logs/sessions.md` — session entry where the decision was made.

## Last Updated

Generated from source manuals, version 1.0. Updated in documentation consistency pass v1.1 and architecture audit pass v1.4 — see ai/memory/changelog.md.
