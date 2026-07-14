# AI Bootstrap — Read This Second

You reached this file because `CLAUDE.md` told you to. If you did not read `CLAUDE.md` first, stop and go read it — it is the single authoritative bootloader and this file never overrides it.

This file exists as a fast, condensed checklist for an AI session with limited context budget. It mirrors `CLAUDE.md`'s boot order exactly — it does not define a second order.

## The order (identical to `CLAUDE.md`)

1. `CLAUDE.md` — full boot sequence, update obligations, the standard.
2. `ai/bootstrap.md` — this file.
3. `ai/context/` — all ten files, `01-project.md` → `10-deployment.md`. Why the project exists.
4. `ai/memory/` — `current.md`, `next.md`, `roadmap.md`, `known-issues.md` at minimum. What's happening now.
5. `ai/rules/` — all nine files. Permanent constraints.
6. `ai/specs/` — the spec for whatever section/component is in scope this session.
7. `ai/docs/` — reference docs relevant to the task.
8. Cross-check `ai/memory/current.md` against `ai/logs/development.md` and `ai/knowledge/progress.json`. Resolve mismatches before coding.
9. Continue only from `ai/memory/current.md`.

## Fast machine-readable snapshot

Before reading the prose files, an AI session can get an instant status snapshot from `ai/state.json` — parses faster than markdown, mirrors `ai/memory/current.md` / `next.md` / `roadmap.md`. If `ai/state.json` and the markdown memory files ever disagree, the markdown files win (they're hand/AI-updated per `CLAUDE.md`'s obligations; `state.json` is a derived convenience cache) — flag the mismatch in `ai/memory/known-issues.md` and fix `state.json` immediately.

Root `STATUS.md` is the human-facing equivalent of `ai/state.json` — same purpose, GitHub-readable, not for AI parsing.

## Reusable maintenance prompts

For end-of-task/end-of-phase bookkeeping, use `ai/scripts/`:
- `update-memory.md` — after any completed task (the `CLAUDE.md` checklist, as a prompt)
- `finish-phase.md` — after a roadmap phase passes its Section Completion Gate
- `review-phase.md` — reviewing a phase against its `ai/checkpoints/phaseNN.md` acceptance criteria
- `sync-docs.md` — reconciling `ai/state.json`, `STATUS.md`, `CHANGELOG.md`, `TODO.md` against `ai/memory/`

These are maintenance/bookkeeping prompts, distinct from `ai/prompts/` (task-type templates: build a section, build a component, animate, etc.). See each file's header for the distinction.

## Related

`CLAUDE.md` (authoritative), `ai/state.json`, `STATUS.md`, `ai/checkpoints/`, `ai/scripts/`

## Last Updated

Added in documentation consistency pass v1.1 — see `ai/memory/changelog.md`.
