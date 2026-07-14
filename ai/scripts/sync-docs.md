# Script: sync-docs

**Type:** maintenance prompt — reconciles the machine-readable/root-level convenience files against the authoritative `ai/memory/` files. Run this whenever `ai/state.json`, `STATUS.md`, `CHANGELOG.md`, or `TODO.md` might have drifted (e.g. picking up a session after a gap, or after manual edits that skipped `ai/scripts/update-memory.md`).

## When to run

Not after every task (that's `update-memory.md`) — run this as a periodic consistency check, or any time something in `ai/state.json`/`STATUS.md`/`TODO.md` looks like it might not match `ai/memory/current.md`/`roadmap.md`/`progress.md`.

## Prompt

```
Reconcile the derived/root docs against the authoritative ai/memory/ files.

Authoritative source, always: ai/memory/current.md, ai/memory/next.md,
ai/memory/roadmap.md, ai/memory/progress.md, ai/memory/known-issues.md.

For each of the following, diff against the authoritative source above and fix
any mismatch found (the derived file is wrong, not the memory file, unless the
memory file itself is stale — if unsure, say so and stop rather than guess):

1. ai/state.json — phase, phaseName, section, completed[], current, next,
   openBlockers[] must all match.
2. STATUS.md (root) — Phase, Current Section, Progress, Open Bugs, Next Milestone.
3. TODO.md (root) — checked boxes must match roadmap.md's "Complete" phases exactly.
4. CHANGELOG.md (root) — should be a strict subset/summary of ai/memory/changelog.md,
   never contain an entry that isn't also in ai/memory/changelog.md.

Report every mismatch found and the fix applied. If zero mismatches, say so
explicitly — don't rewrite files that are already correct.
```

## Related

`ai/state.json`, `STATUS.md`, `CHANGELOG.md`, `TODO.md`, `ai/memory/`
