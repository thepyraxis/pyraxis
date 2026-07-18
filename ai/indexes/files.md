# Index — Files

Every important file in the repository, one line each. Update whenever a file is added, moved, or removed.

## Root

| File | Purpose |
|---|---|
| `AI.md` | Compatibility pointer for tools that look for this filename before `CLAUDE.md` — redirects to it, adds nothing |
| `CLAUDE.md` | AI session bootloader — read first, every session |
| `README.md` | Human-facing project overview |
| `STATUS.md` | Human dashboard: phase, section, progress, blockers, next milestone |
| `CHANGELOG.md` | Human-readable digest changelog — summary of `ai/memory/changelog.md` |
| `TODO.md` | Quick scene/phase checklist |

## `ai/bootstrap.md` — condensed session checklist

Read second, right after `CLAUDE.md`. Mirrors `CLAUDE.md`'s boot order; does not define a competing one.

## `ai/state.json` — machine-readable status snapshot

Derived cache of `ai/memory/current.md`/`next.md`/`roadmap.md`. Those files win on any disagreement.

## `ai/context/` — why things are the way they are

| File | Covers |
|---|---|
| `01-project.md` | What this repo is, current status |
| `02-philosophy.md` | Mission, vision, "Less. But better." |
| `03-website.md` | Product/business logic behind the site |
| `04-architecture.md` | Why the codebase is one living system |
| `05-design-system.md` | Why tokens-only, why constrained palettes |
| `06-tech-stack.md` | Technology choices and rationale |
| `07-brand.md` | Voice, messaging, copy rules |
| `08-animation-system.md` | Motion philosophy |
| `09-particle-engine.md` | Why one global particle engine |
| `10-deployment.md` | Release requirements |

## `ai/memory/` — living state

`current.md` · `completed.md` · `next.md` · `roadmap.md` · `progress.md` · `decisions.md` · `known-issues.md` · `changelog.md`

## `ai/rules/` — permanent constraints

`coding.md` · `architecture.md` · `design.md` · `animation.md` · `performance.md` · `accessibility.md` · `security.md` · `git.md` · `documentation.md`

## `ai/prompts/` — task templates

`build-section.md` · `build-component.md` · `animate.md` · `review.md` · `optimize.md` · `refactor.md` · `bugfix.md` · `release.md`

## `ai/scripts/` — reusable maintenance prompts (distinct from `ai/prompts/` above)

`update-memory.md` · `finish-phase.md` · `review-phase.md` · `sync-docs.md`

## `ai/checkpoints/` — one file per roadmap phase (17 total)

`phase01.md` … `phase17.md`, matching `ai/memory/roadmap.md` exactly. Requirements/Acceptance Criteria/Completed Tasks per phase.

## `ai/docs/` — reference docs

`API.md` · `COMPONENTS.md` · `FEATURES.md` · `DEPLOYMENT.md` · `CONTRIBUTING.md`

## `ai/knowledge/` — machine-readable database

`project.json` · `architecture.json` · `website.json` · `components.json` · `routes.json` · `animations.json` · `sections.json` · `decisions.json` · `dependencies.json` · `progress.json`

## `ai/templates/` — file templates for new entries

`component-template.md` · `section-template.md` · `feature-template.md` · `decision-template.md`

## `ai/specs/` — one spec per section/scene

`hero.md` · `problem.md` · `growth-system.md` · `growth-engines.md` · `why-pyraxis.md` · `portfolio.md` · `process.md` · `future-proof-systems.md` · `cta.md` · `footer.md`. All content currently UNKNOWN pending Phase 01+; see each file's `## Notes` for source pointers.

`ai/specs/architecture/` — cross-cutting specs not tied to one section/scene, kept in a subfolder so `validate-state.mjs`'s section:spec 1:1 check doesn't treat them as orphaned. Currently: `responsive-layout-system.md` (fluid layout/typography/spacing token architecture refactor spanning all sections — see `ai/state.json` for status).

## `ai/indexes/` — human-readable "what exists and where" (this folder)

`animations.md` · `assets.md` · `components.md` · `dependencies.md` · `files.md` (this file) · `pages.md`

## `scripts/` — repository validators (root, not `ai/scripts/`)

Real, runnable Node scripts (no dependencies) — distinct from `ai/scripts/*.md`, which are reusable *prompts*. These are executable code that checks the documentation system stays true as the repo scales past 500+ components / 1000+ commits: `validate-docs.mjs` (broken links, missing "Last Updated" footers), `validate-state.mjs` (`ai/state.json` vs `roadmap.md`/checkpoints/specs sync), `validate-refs.mjs` (index/knowledge parity), `validate-all.mjs` (runs all three). See `ai/docs/CONTRIBUTING.md` and `CLAUDE.md`'s after-task checklist.

## `ai/logs/` — narrative session/dev history

`development.md` · `sessions.md`

## Application code

UNKNOWN — no files exist yet under `app/`, `components/`, `hooks/`, `lib/`, `providers/`, `styles/`, `types/`, `utils/`, `public/`, `scripts/`, `.github/workflows/`. These folders are scaffolded as placeholders pending Phase 01 (`ai/memory/roadmap.md`). Note: `utils/` and `lib/utils/` both exist — unresolved duplication, see `ai/memory/known-issues.md`.

## Related

`ai/rules/documentation.md`, `ai/indexes/components.md`, `scripts/` (automated version of this file's freshness claim)
