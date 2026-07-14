# Growth Engines

## Purpose
Explain each Growth Engine in depth via one reusable Engine component. See `ai/context/03-website.md` (Product Bible §04) for the full engine table and `ai/knowledge/sections.json` id `growth-engines` for scene metadata.

## User Experience
Visitor scrolls down from Growth System into a row (desktop) / two-column stack (mobile) of six engine cards. Each card assembles itself from particles as it enters view — never fades in. Hovering or focusing a card lifts it slightly, lights its border, and pulls nearby ambient signal particles toward it.

## Visual Direction
Same dark/purple system as the rest of the site (`styles/tokens/colors.ts`). No dashboard screenshots, no generic icon-library glyphs — every icon is a hand-drawn stroke path (`icons.tsx`) sampled into particles, same technique as `components/problem/icons.tsx`.

## Layout
`max-w-[1240px]` centered column, headline + subline, then a grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Six engines, not seven — see `ai/memory/decisions.md` D-014 for why this diverges from the engine list below.

## Components
`GrowthEngines.tsx` (section), `GrowthEnginesHeadline.tsx`, `GrowthEngineCard.tsx` (the one reusable card, `ai/rules/coding.md` #5/#6), `GrowthEngineIconCanvas.tsx`, `icons.tsx`, `engines.ts` (data), `layout.ts` (normalized node positions for the particle engine).

## Animation
Icon construction: Edges → scattered particles → assembled outline (`ai/rules/animation.md` #6), reverses on exit. Headline: scroll-triggered (`IntersectionObserver`) fade+rise, not mount-triggered. Ambient particles: global `ParticleProvider`, shape `"nodes"`, `particleType: "signal"`, redirected toward the focused card. Scene intensity = High per `08-animation-system.md`.

## Interactions
Hover/focus a card → local cursor-tracked radial glow on that card + global particle focus redirect (mirrors `growth-system`'s node-hover behavior). Full keyboard support: cards are focusable (`tabIndex=0`, `role="group"`, descriptive `aria-label`), visible focus ring.

## Responsive Rules
`md`+ = horizontal single row. Below `md` = vertical two-column stack. Resolved per `ai/memory/decisions.md` D-014 (was an open item in `known-issues.md`).

## Accessibility
Semantic `<section aria-label="Growth engines">`, `role="group"` + `aria-label` per card, visible `focus-visible` ring, decorative canvases marked `aria-hidden`/`role="presentation"`, full reduced-motion path (icons render fully assembled with no particle build).

## Performance Requirements
Ambient particle density capped at 0.12 (0.04 reduced-motion) of the device tier budget, shared with other sections via the same pool. Icon-construction canvases pause when off-screen (`IntersectionObserver`). No new dependencies added.

## Dependencies
`growth-system` (previous scene, per `ai/knowledge/sections.json`) — also reuses its `ParticleProvider`/`AnimationProvider` integration pattern directly.

## Status
Built — see `ai/checkpoints/phase09.md` for acceptance criteria status.

## Notes
Built with six engines (Website, Lead, Booking, WhatsApp, Review, AI Assistant) per the milestone brief, rather than this file's original seven-engine list (Lead, Booking, Follow-up, Retention, Review, Referral, Intelligence) inherited from the Product Bible. See `ai/memory/decisions.md` D-014.
