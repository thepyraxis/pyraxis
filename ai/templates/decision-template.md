# Decision Template

Copy into `ai/memory/decisions.md` (human-readable) and `ai/knowledge/decisions.json` (machine-readable) for every architectural decision.

```md
## D-00X — <short title>

**Date:** <date>
**Decision:** <what was decided, stated plainly>
**Reasoning:** <why this and not the alternatives>
**Alternatives considered:** <what else was on the table, if relevant>
**Source:** <manual/section, discussion, or "team decision" with date>
```

```json
{
  "id": "D-00X",
  "title": "",
  "reasoning": "",
  "source": ""
}
```

A decision entry is required any time: an `ai/rules/*.md` constraint is deliberately overridden, a new global provider/manager is introduced, a new surface/material/token category is added, or the build phase order in `ai/memory/roadmap.md` is deviated from.

## Related

`ai/memory/decisions.md`, `ai/rules/documentation.md`
