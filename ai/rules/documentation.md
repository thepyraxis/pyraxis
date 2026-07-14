# Documentation Rules

Governance carried over from `00-master-index.md` and extended for the `ai/` system.

1. **One idea, one location.** Every concept exists exactly once across all documentation. Other documents cross-reference rather than repeat.
2. Before adding content anywhere: search first (`ai/indexes/files.md`, this repo's `ai/context/`) — does the concept already exist? If yes, add a cross-reference, not a copy. If no, add it to the correct file, then update relevant indexes.
3. Never invent information. If something cannot be determined from the source manuals or the codebase, write `UNKNOWN` rather than guessing.
4. Context files (`ai/context/`) explain WHY and are treated as stable — update rarely, and only with a corresponding `ai/memory/decisions.md` entry if the change reflects a real decision.
5. Memory files (`ai/memory/`) are living documents — update immediately after every completed feature, per `CLAUDE.md`.
6. Use relative markdown links between documents so the documentation behaves like a wiki.
7. Knowledge files (`ai/knowledge/*.json`) must stay in sync with the human-readable docs — treat them as a database, not a copy.
8. "Last Updated" line at the bottom of every context/rules file must be updated whenever content changes.
9. `ai/state.json`, root `STATUS.md`, root `TODO.md`, and root `CHANGELOG.md` are derived convenience caches, not sources of truth. `ai/memory/current.md`, `next.md`, `roadmap.md`, and `progress.md` are authoritative — if a derived file disagrees, fix the derived file (or flag the mismatch in `ai/memory/known-issues.md` if genuinely unclear which is stale). Use `ai/scripts/sync-docs.md` to reconcile them.
10. Root `CHANGELOG.md` is a human-readable digest of `ai/memory/changelog.md`, never a duplicate of its full detail — every root entry must summarize, and link back to, a corresponding `ai/memory/changelog.md` entry.
11. Run `node scripts/validate-all.mjs` before ending any session that touched documentation. It enforces rules #1 (via index/knowledge parity), #6/#8 (broken links, missing footers), and #9 (state.json sync) mechanically — don't rely on manual review alone once the repo grows past a size a human can eyeball.

## Related

`00-master-index.md` (original governance model), `CLAUDE.md`, `scripts/`

## Last Updated

Generated from source manuals, version 1.0.
