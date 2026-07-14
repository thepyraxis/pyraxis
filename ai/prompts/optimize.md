# Prompt: Performance Optimization Pass

Use during Phase 16 (`ai/memory/roadmap.md`) or anytime FPS/Lighthouse targets are missed.

## Checklist — walk in this order

1. Measure first: current FPS (desktop/mobile), current Lighthouse scores, current particle counts per device.
2. Particle budget check against `ai/rules/performance.md` #1 — reduce density before removing visual richness elsewhere.
3. Confirm object pooling is in place — no allocation inside animation loops (`ai/rules/performance.md` #2).
4. Confirm geometry/material reuse and `InstancedMesh` usage for particles (`ai/rules/performance.md` #3).
5. Confirm LOD tiers are implemented (far=points, medium=triangles, near=detailed).
6. Confirm Three.js is dynamically imported and not blocking initial load.
7. Confirm expensive per-frame work (mouse, physics) is throttled.
8. Confirm offscreen sections pause their calculations.
9. Confirm image formats/lazy-loading per `ai/rules/performance.md` #10.
10. Re-measure. Compare against Lighthouse targets in `10-deployment.md`.

## Never

Never solve a performance problem by disabling the design system's motion/particle language for everyone — that's a reduced-motion accessibility fallback, not a default. Fix the implementation instead.

## After finishing

Update `ai/memory/progress.md` and note the optimization in `ai/memory/changelog.md`. If a real architectural change was made, add an entry to `ai/memory/decisions.md`.

## Related

`ai/rules/performance.md`, `09-particle-engine.md`, `10-deployment.md`
