# Prompt: Add or Modify an Animation

Use for any GSAP timeline, Three.js motion, particle behavior, or CSS transition work.

## Before starting

1. Read `ai/rules/animation.md` in full.
2. Identify which prohibited pattern you might be reaching for (fade/pop/slide/zoom/bounce/random-spin) and its required replacement (construct/manufacture/flow/morph/merge-split/assemble-disassemble).
3. Check `ai/knowledge/animations.json` for an existing timeline covering this trigger/section — extend, don't duplicate.
4. Confirm the particle instructions this animation needs go through the global engine (`09-particle-engine.md`), never a local particle system.

## Build checklist

- [ ] Duration pulled from the shared timing scale (micro/hover/section/cinematic — `ai/rules/animation.md` #5)
- [ ] Camera motion (if any) is slow/gentle/subtle only
- [ ] Transition preserves particle continuity — nothing is created or destroyed, only transformed
- [ ] GSAP timeline owned by the section, killed on unmount
- [ ] Reduced-motion fallback defined (opacity-based, reduced density, no camera motion)
- [ ] Passes the story test: does this help explain digital infrastructure?

## After finishing

Add/update entry in `ai/knowledge/animations.json` (trigger, dependencies, performance notes) and `ai/indexes/animations.md`.

## Related

`08-animation-system.md`, `09-particle-engine.md`, `ai/rules/performance.md`
