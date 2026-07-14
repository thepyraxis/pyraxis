# Contributing

## For any contributor — human or AI

1. Read `CLAUDE.md` first, every session, in the order it specifies.
2. Never start work without checking `ai/memory/current.md` and `ai/memory/next.md`.
3. Follow the rules in `ai/rules/` — they are permanent constraints, not suggestions. If a rule seems wrong, raise it as a decision in `ai/memory/decisions.md` rather than silently deviating.
4. Use the relevant prompt template in `ai/prompts/` for the kind of work you're doing (build a section, build a component, animate, review, optimize, refactor, bugfix, release).
5. Follow Conventional Commits (`ai/rules/git.md`).
6. Never finish a work session without updating `ai/memory/` per `CLAUDE.md`'s update rules, then running `node scripts/validate-all.mjs` — fix anything it flags before ending the session.
7. One idea, one location — see `ai/rules/documentation.md`. Don't duplicate documentation; cross-reference it.
8. Never invent information to fill a gap — write `UNKNOWN` and flag it in `ai/memory/known-issues.md`.

## Related

`CLAUDE.md`, `ai/rules/documentation.md`, `ai/rules/git.md`, `scripts/`
