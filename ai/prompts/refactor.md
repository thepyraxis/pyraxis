# Prompt: Refactor

Use when restructuring existing code without changing behavior.

## Before starting

1. Confirm this is genuinely a refactor (no behavior change) — if behavior changes, this is a feature/fix, use `build-component.md` or `bugfix.md` instead.
2. Check `ai/knowledge/components.json` / `ai/knowledge/dependencies.json` for everything that depends on the code being refactored ("Used By" field) — nothing may break for consumers.
3. Read `ai/rules/architecture.md` and `ai/rules/coding.md` to confirm the refactor target rule (e.g. splitting a component over 250 lines, extracting a duplicated particle system into the global engine, removing a parallel state system in favor of the decision tree in `ai/rules/coding.md` #8).

## Checklist

- [ ] No new global state introduced for convenience
- [ ] No parallel systems created — extend existing providers/managers
- [ ] Component still under 250 lines after refactor, or split further
- [ ] All consumers still function identically
- [ ] Tokens/naming conventions preserved
- [ ] Tests (if any) still pass

## After finishing

Update `ai/knowledge/components.json` and `ai/indexes/files.md` if file locations changed. Record the reasoning in `ai/memory/decisions.md` if the refactor reflects an architectural change, and log it in `ai/memory/changelog.md`.

## Related

`ai/rules/architecture.md`, `ai/rules/coding.md`
