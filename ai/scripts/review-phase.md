# Script: review-phase

**Type:** maintenance prompt — audits a phase's acceptance criteria before `finish-phase.md` is run. Distinct from `ai/prompts/review.md`, which is a generic code-review template for any component or feature; this is specifically a phase-level gate check against `ai/checkpoints/phaseNN.md`.

## When to run

Before claiming a phase is done, or when picking up someone else's (human or AI) in-progress phase and needing to know what's actually finished vs. claimed finished.

## Prompt

```
Review Phase <NN> — <phase name> against ai/checkpoints/phaseNN.md.

For each acceptance criterion listed:
1. State whether it is actually met — inspect the real code/config, don't trust
   ai/memory/progress.md's percentage at face value.
2. If met, cite the file/line/component that proves it.
3. If not met, add it to ai/memory/known-issues.md with severity and affected file.
4. Cross-check against ai/rules/architecture.md #7 (Section Completion Gate) if this
   is a scene phase: desktop/tablet/mobile layout, animations, mouse interactions,
   accessibility, responsive typography, 60fps performance, Lighthouse, transition
   into next section.
5. Cross-check against ai/rules/coding.md, design.md, animation.md, performance.md,
   accessibility.md for rule violations, not just checkpoint items.

Do not run ai/scripts/finish-phase.md until every criterion is genuinely met.
Output a pass/fail per criterion, not a single overall verdict.
```

## Related

`ai/checkpoints/`, `ai/prompts/review.md`, `ai/rules/architecture.md`
