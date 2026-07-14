# 08 · Animation System

## Purpose

Explain the motion philosophy that all GSAP timelines, Three.js objects, and CSS transitions must obey.

## Responsibilities

Governs `components/animations/`, GSAP timeline setup, and camera/scroll choreography.

## Core Principles

**Nothing appears. Everything transforms.**

| Prohibited | Preferred |
|---|---|
| Fade | Construct |
| Pop | Manufacture |
| Slide | Flow |
| Zoom | Morph |
| Bounce | Merge / Split |
| Spin randomly | Assemble / Disassemble |

Every object has mass, momentum, weight, friction, inertia. Nothing teleports or suddenly appears. (Experience Blueprint §02)

**The story test.** Motion must answer: "Does this help tell the story of digital infrastructure?" If not, remove it. (Experience Blueprint §02)

**Transitions never use opacity.** Each scene physically evolves into the next; particle continuity is preserved — matter is transformed, never created or destroyed. Concrete transition chain:
```
Hero → Problem → Growth System → Growth Engines → Why PYRAXIS(rest)
→ Portfolio → Process → Future-Proof Systems → CTA → Footer
```
(Experience Blueprint §08 — see `ai/knowledge/sections.json` for the specific transformation at each junction)

**Camera language.** Cinematic only: slow zoom, gentle orbit, perspective shifts, soft parallax, depth changes. Never: shake, fast rotation, whip pan, extreme zoom, random movement. Movement should be subtle enough the visitor doesn't consciously notice it. (Experience Blueprint §05)

**Timing reference:**

| Interaction | Duration |
|---|---|
| Micro (buttons, links) | 120–250ms |
| Hover states | 250–400ms |
| Section animations | 800–1,400ms |
| Major transformations | 1,500–3,000ms |

(Experience Blueprint §07 — mirrors Design System §10 Motion Tokens)

**Typography animation.** Never slides upward. Characters build from particles, light sweeps across headlines, mask reveals, tracking expands, weight changes. (Experience Blueprint §22)

**Icon animation.** Fixed sequence: Edges → Outline → Material → Glow → Final object. Dissolves back to particles on scene exit. (Experience Blueprint §23, Design System §19)

**Loading states.** Never spinners. Particles assemble, skeleton states, signal animation, construction animation. (Experience Blueprint §24)

**Visual rhythm — intensity must alternate, not stay uniformly high:**

| Scene | Intensity |
|---|---|
| Hero | Medium |
| Problem | High |
| Growth System | High |
| Growth Engines | High |
| Why PYRAXIS | Low (rest) |
| Portfolio | Medium |
| Process | Medium |
| Future-Proof Systems | Very High (climax) |
| CTA | Medium |
| Footer | Very Low (closure) |

The high/low contrast is what makes the Future-Proof Systems climax feel earned. (Experience Blueprint §19; renamed from "Intelligence Core" — see `ai/memory/decisions.md` D-005.)

## Dependencies

- `09-particle-engine.md` — the substrate all this motion is built from
- `05-design-system.md` — motion/easing tokens

## Related Files

- `ai/rules/animation.md`
- `ai/knowledge/animations.json`
- `ai/indexes/animations.md`

## Future Expansion

Reduced-motion mode must replace morphing with opacity, reduce density, and disable camera motion while preserving the story (Experience Blueprint §22 cross-ref, Design System §22, Technical Architecture §18).

## Last Updated

Generated from source manuals, version 1.0. Updated in documentation consistency pass v1.1 — see ai/memory/changelog.md.
