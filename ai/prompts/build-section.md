# Prompt: Build a Section (Scene)

Use when implementing one of the ten scenes from `05-experience-blueprint.md`.

## Before starting

1. Read `CLAUDE.md` boot order if not already done this session.
2. Read the scene's spec in `ai/knowledge/sections.json` and cross-check against `05-experience-blueprint.md` for the corresponding Scene section.
3. Confirm current phase in `ai/memory/roadmap.md` — do not start a scene out of order.
4. Confirm the previous scene is fully complete per the Section Completion Gate (`ai/rules/architecture.md` #7).

## Build checklist for this scene

- [ ] Copy written per `07-brand.md` voice rules and the `Problem → Cost → Solution → Result` formula
- [ ] Emotion target matches `ai/knowledge/sections.json` entry for this scene
- [ ] Particle instructions sent to the global engine only (never a local particle system) — see `ai/rules/coding.md` #10
- [ ] Motion obeys `ai/rules/animation.md` (no fade/pop/slide/zoom/bounce)
- [ ] Transition in and transition out both defined, no opacity crossfade
- [ ] Design tokens only, no hardcoded values
- [ ] Desktop, tablet, mobile layouts each intentionally designed (not scaled)
- [ ] Mouse interactions implemented per `05-experience-blueprint.md` §06
- [ ] Accessibility: reduced-motion fallback, ARIA, keyboard, contrast
- [ ] 60 FPS verified
- [ ] Component under 250 lines, split if needed

## After finishing

Update `ai/memory/progress.md`, `ai/memory/completed.md`, `ai/memory/current.md`, `ai/memory/next.md`, and `ai/knowledge/sections.json` status field. Add a changelog entry.

## Related

`05-experience-blueprint.md`, `ai/rules/animation.md`, `ai/rules/design.md`, `ai/prompts/build-component.md`
