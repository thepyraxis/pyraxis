# Script: update-memory

**Type:** maintenance prompt (run after any completed task). Not a task-type template — see `ai/prompts/` for those (build-section, build-component, etc.).

## When to run

After finishing any unit of work, before ending the session, per `CLAUDE.md`'s "After Every Completed Task" checklist.

## Prompt

```
Update project memory for the task just completed: <one-line description>.

Update, in this order:
1. ai/memory/progress.md — adjust the percentage for the affected area(s)
2. ai/memory/completed.md — append the completed item, don't delete history
3. ai/memory/current.md — overwrite with the next single active task
4. ai/memory/next.md — reorder/update the priority list
5. ai/logs/development.md — Active Task / Latest Completed Work / Blocking Issues
6. ai/logs/sessions.md — append a session entry (Worked on / Completed / Decisions / Blockers / Handoff)
7. ai/memory/changelog.md — append a chronological entry
8. ai/memory/decisions.md — only if an ai/rules/ constraint was overridden or a new
   provider/manager/token category/phase deviation happened
9. Relevant ai/knowledge/*.json, ai/indexes/*.md, ai/specs/*.md (Status field)
10. ai/state.json — sync phase/section/completed/current/next to match steps 1-4
11. STATUS.md (root) — sync to match ai/state.json
12. TODO.md (root) — check off if a scene/phase completed
13. CHANGELOG.md (root) — append a short human-readable digest line (not the full
    ai/memory/changelog.md detail — cross-reference it instead)
14. The relevant ai/checkpoints/phaseNN.md — check off completed sub-tasks

Do not skip steps. Do not invent status — if something is genuinely unknown, write UNKNOWN.
```

## Related

`CLAUDE.md`, `ai/memory/`, `ai/state.json`
