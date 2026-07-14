# Script: finish-phase

**Type:** maintenance prompt (run once per roadmap phase, not per task). Complements `ai/scripts/update-memory.md`, which runs more often (every task).

## When to run

Only when a full roadmap phase (`ai/memory/roadmap.md`) has passed every item in its `ai/checkpoints/phaseNN.md` acceptance criteria — for section phases, that means the full Section Completion Gate in `ai/rules/architecture.md` #7.

## Prompt

```
Phase <NN> — <phase name> is claimed complete. Verify before marking it done:

1. Open ai/checkpoints/phaseNN.md — confirm every acceptance criterion is checked,
   not assumed. If any are unchecked, stop; the phase is not finished.
2. Run ai/scripts/update-memory.md for the final task of the phase.
3. ai/memory/roadmap.md — flip this phase's Status to "Complete".
4. ai/knowledge/progress.json + ai/memory/progress.md — set this phase's area to 100%.
5. ai/knowledge/sections.json (if a scene phase) — set status: "complete", progress: 100.
6. ai/state.json — increment "phase", update "completed" array, set "current" to null
   or the next phase name, update "next" to the following phase per roadmap.md.
7. STATUS.md (root) — sync.
8. TODO.md (root) — check the box for this scene/phase.
9. CHANGELOG.md (root) + ai/memory/changelog.md — log the phase completion.
10. ai/memory/current.md — set to the next phase's first task, per ai/rules/architecture.md
    #6 (never start the next phase's work before this checklist is done).

Never mark a phase complete to unblock the next one prematurely — Technical Architecture
§22 requires perfecting one phase before starting the next.
```

## Related

`ai/checkpoints/`, `ai/rules/architecture.md`, `ai/memory/roadmap.md`
