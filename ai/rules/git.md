# Git Rules

Follow Conventional Commits. (Technical Architecture §21)

```
feat(hero): add interactive logo
feat(particles): implement global particle engine
refactor(motion): extract scroll controller
perf(hero): reduce particle allocations
fix(gsap): kill scroll triggers on unmount
```

- Meaningful commits only — no "wip", "fix stuff", "final", "final2".
- Version names belong in Git history, not filenames (`hero_v2`, `finalFinal.tsx` are forbidden — see `ai/rules/coding.md`). (Technical Architecture §20)
- Every completed feature must be accompanied by updates to `ai/memory/progress.md`, `ai/memory/completed.md`, `ai/memory/current.md`, `ai/memory/next.md`, and `ai/memory/decisions.md` (if architecture changed) — see `CLAUDE.md`.

## Related

`CLAUDE.md`, `ai/memory/changelog.md`

## Last Updated

Generated from source manuals, version 1.0.
