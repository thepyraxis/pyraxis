# Why PYRAXIS

## Purpose
Build trust through authenticity, not claims (manuals/05-experience-blueprint.md §13). Answers three belief questions in under 20 seconds: why not an agency, why one connected system, why trust PYRAXIS specifically — without repeating the services the visitor already saw in Growth Engines.

## User Experience
Visitor scrolls from Growth Engines into a slower, quieter moment: eyebrow label, two-line headline, then three short labeled statements stacked vertically. No cards, no icons, no interaction beyond scroll. Reads in well under 20 seconds.

## Visual Direction
Editorial. Large serif/display headline, minimal UI, generous whitespace. Two soft particle-built circles flank the copy at low opacity — geometric, not decorative (`ai/context/09-particle-engine.md` material identity rules apply: no snow/dust/stars). Lighting softer than Growth Engines. Same dark/purple system (`styles/tokens/colors.ts`).

## Layout
`max-w-[880px]` centered column, `min-h-[80vh]`, eyebrow → headline → three stacked answer blocks (`max-w-[560px]` each), all centered text.

## Components
`WhyPyraxis.tsx` (section), `content.ts` (headline + three-point copy data).

## Animation
GSAP fade+rise reveal (`opacity`/`y`, staggered) triggered by `IntersectionObserver`, replaying each time the section re-enters view (matches this scene's slower "rest beat" pacing rather than a one-shot mount animation). Particle circles enter/exit via the same observer, phase `living`/`exiting`.

## Interactions
None beyond scroll-triggered reveal — deliberately minimal per "very little UI."

## Responsive Rules
Single centered column at all breakpoints; type scales via `clamp()`; no layout mode switch needed (no grid, no cards).

## Accessibility
Semantic `<section aria-label="Why PYRAXIS">`, standard heading/paragraph elements (no decorative ARIA needed since there's no interactive UI), full reduced-motion path (headline/points render fully visible, particle density drops to 0.02).

## Performance Requirements
Particle density capped at 0.05 (0.02 reduced-motion) — intentionally below Growth Engines' 0.12, since this section is the rest beat, not a showcase. No new dependencies added.

## Dependencies
`growth-engines` (previous scene) — reuses `ParticleProvider`/`AnimationProvider` integration pattern.

## Status
Built — see `ai/checkpoints/phase10.md` for acceptance criteria status.

## Notes
Copy follows `ai/context/07-brand.md` voice rules (short lines, one idea per line, no banned words, no fake stats/testimonials) and leans on Product Bible §09 ("quality communicated through engineering and thinking alone") for the trust answer, since no case studies exist yet.
