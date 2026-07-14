# Prompt: Bug Fix

## Before starting

1. Check `ai/memory/known-issues.md` — is this already logged? If not, add it first with description, repro steps, severity, affected file/component.
2. Reproduce the bug and identify root cause before writing a fix — do not patch symptoms.
3. Check whether the bug stems from a rule violation (e.g. a local particle system instead of the global engine, a memory leak from an unkilled GSAP timeline, a hardcoded value instead of a token) — if so, the fix should also bring the code into compliance with the relevant `ai/rules/*.md` file, not just silence the symptom.

## Checklist

- [ ] Root cause identified and stated
- [ ] Fix addresses root cause
- [ ] No new rule violations introduced by the fix
- [ ] Regression check: does this fix break any other section per `ai/knowledge/dependencies.json`?
- [ ] Reduced-motion / accessibility paths re-verified if the bug touched animation

## After finishing

Move the issue from `ai/memory/known-issues.md` to `ai/memory/completed.md` (keep history, don't delete), and log the fix in `ai/memory/changelog.md` using a `fix(scope): ...` commit message per `ai/rules/git.md`.

## Related

`ai/memory/known-issues.md`, `ai/rules/git.md`
