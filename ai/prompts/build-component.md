# Prompt: Build a Component

Use when adding any new component under `components/`.

## Before starting

1. Search `ai/indexes/components.md` and `ai/knowledge/components.json` — does something similar already exist? If yes, extend or compose it rather than duplicate (`ai/rules/documentation.md` #2, `ai/rules/coding.md` #13).
2. Identify which layer of the hierarchy this belongs to: Page → Section → Layout → Component → Subcomponent → Primitive (Design System §15). Never skip or merge layers.
3. Confirm which surface/material type applies: Flat, Glass, Metal, or Signal (`ai/rules/design.md` #3–4).

## Build checklist

- [ ] Single responsibility, one clear name (no `component1`, no version suffixes)
- [ ] TypeScript strict, fully typed, no `any`
- [ ] Server Component unless it needs animation/interaction/canvas/tracking, in which case Client Component
- [ ] All values from design tokens
- [ ] States covered as applicable: Default, Hover, Pressed, Focus, Disabled, Loading (Design System §16)
- [ ] Global motion + particle language used, not a local reimplementation
- [ ] Responsive at all breakpoints (`ai/context/05-design-system.md`, Breakpoint Tokens)
- [ ] Reduced-motion fallback
- [ ] ARIA/keyboard/contrast
- [ ] Under 250 lines — split into subcomponents if not
- [ ] Passes full Component Quality Checklist (Design System §25)

## After finishing

Add entry to `ai/indexes/components.md` and `ai/knowledge/components.json` (location, purpose, dependencies, status, used by, related sections).

## Related

`ai/rules/coding.md`, `ai/rules/design.md`, `03-design-system.md`
