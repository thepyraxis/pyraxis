# CLAUDE.md — AI Session Bootloader

Every AI session on this repository (Claude, ChatGPT, Gemini, Cursor, Roo Code, Windsurf, Copilot, or otherwise) starts here. Do not begin coding before completing this boot sequence.

## Boot Order

1. **Read `CLAUDE.md`** — this file, start to finish, every session.
2. **Read `ai/bootstrap.md`** — condensed checklist mirroring this boot order, plus pointers to `ai/state.json` (machine-readable status snapshot) and the maintenance prompts in `ai/scripts/`.
3. **Read `ai/context/`** — all ten files, in order (`01-project.md` → `10-deployment.md`). This is WHY the project exists and is built the way it is.
4. **Read `ai/memory/`** — `current.md`, `next.md`, `roadmap.md`, `known-issues.md` at minimum (`progress.md`, `completed.md`, `decisions.md`, `changelog.md` as needed for context).
5. **Read `ai/rules/`** — all nine files. These are permanent constraints. Do not violate them without logging a decision in `ai/memory/decisions.md`.
6. **Read `ai/specs/`** — the spec for whatever section/component is in scope for this session.
7. **Read `ai/docs/`** — reference docs (`API.md`, `COMPONENTS.md`, `DEPLOYMENT.md`, `FEATURES.md`, `CONTRIBUTING.md`) relevant to the task.
8. **Understand project status** — cross-check `ai/memory/current.md` against `ai/logs/development.md` and `ai/knowledge/progress.json`; resolve any mismatch before writing code, don't assume either is stale.
9. **Continue only from `ai/memory/current.md`** — that file is the single active task. Don't start unrelated work mid-session.

Only after all nine steps: begin coding.

## While Working

- Use the matching template in `ai/prompts/` for the task type: `build-section.md`, `build-component.md`, `animate.md`, `review.md`, `optimize.md`, `refactor.md`, `bugfix.md`, `release.md`.
- Search `ai/indexes/` and `ai/knowledge/*.json` before creating anything new — never duplicate a component, provider, token, or animation that already exists.
- Never invent information. If something cannot be determined from this repository, write `UNKNOWN` and, if it blocks work, add it to `ai/memory/known-issues.md`.
- Follow `ai/rules/documentation.md`: one idea, one location. Cross-reference, don't copy.
- Log session narrative (what was worked on, decisions made, blockers hit) in `ai/logs/sessions.md` as you go, not only at the end.

## After Every Completed Task

Update, without exception:

- [ ] `ai/memory/progress.md`
- [ ] `ai/memory/completed.md`
- [ ] `ai/memory/current.md`
- [ ] `ai/memory/next.md`
- [ ] `ai/logs/development.md`
- [ ] `ai/logs/sessions.md`
- [ ] `ai/memory/changelog.md`
- [ ] `ai/memory/decisions.md` — only if architecture changed
- [ ] Relevant `ai/knowledge/*.json`, `ai/indexes/*.md`, and `ai/specs/*.md` (Status field)
- [ ] `ai/state.json` — machine-readable snapshot, must stay in sync with `ai/memory/current.md`/`next.md`/`roadmap.md`
- [ ] `STATUS.md` (root) — human-facing snapshot, mirrors `ai/state.json`
- [ ] `TODO.md` (root) — check off the scene/phase if completed
- [ ] `CHANGELOG.md` (root) — human-readable digest entry; keep this a summary, not a copy of `ai/memory/changelog.md`'s full detail
- [ ] The relevant `ai/checkpoints/phaseNN.md` — check off completed tasks; only mark the phase done once its acceptance criteria all pass

Use `ai/scripts/update-memory.md` as a reusable prompt for this exact checklist. Then run `node scripts/validate-all.mjs` (root `scripts/`, not `ai/scripts/`) — it checks broken links, `ai/state.json`/roadmap/checkpoint/spec sync, and index/knowledge parity in seconds. Fix anything it flags before ending the session.

**Never leave documentation outdated.** The next AI session — possibly a different model entirely — depends on these files being accurate, not on this conversation's history.

## The Standard

This repository must be understandable to a new AI assistant in under five minutes, using only these files. If you find yourself needing information that isn't here, that's a documentation gap — fix it as part of your work, not after.

## Related

`README.md`, `00-master-index.md`-equivalent governance in `ai/rules/documentation.md`, `scripts/` (automated consistency validators)
