# Problem

## Purpose
Surface broken business systems. Make the visitor feel recognized. (Experience Blueprint §10)

## User Experience
Urgency · Recognition. Cooler and harsher than Hero — this scene is meant to create tension, not calm.

## Visual Direction
Huge typography, minimal copy, four large icons, no clutter. Lighting: a single thin, tight, blue-shifted wash (`rgba(99,102,241,...)`) rather than Hero's layered bloom — the icons themselves should read as the light source, not the background.

## Layout
Centered column: eyebrow → two-line headline (context line + bold accent payoff line) → subline → 2×2 (mobile) / 1×4 (`lg`+) icon grid.

## Components
`Problem.tsx` (shell), `ProblemHeadline.tsx`, `ProblemIcons.tsx` (server-side data/layout), `ProblemIconCanvas.tsx` (client canvas engine), `icons.tsx` (four manufactured icon draw functions).

## Animation
Icons are never faded in. Each is sampled into particle points and, gated by `IntersectionObserver`, assembles (scatter → converge, center-out stagger) when scrolled into view and disassembles back to scatter when scrolled out (Experience Blueprint §10: "Icons physically construct themselves... Leaving: icons disassemble"). While settled, a sparse (~5% of points, briefly) flicker represents the Design System §Signal "lost / interrupted" state for this scene — not a glow, an interruption. Headline: single entrance reveal only, no continuous motion.

## Interactions
None beyond scroll-triggered assembly/disassembly — this scene has no hover/cursor interaction by design (contrast with Hero's cursor-reactive logo).

## Responsive Rules
2-column icon grid below `lg`, 4-column at `lg`+. Headline type is fluid (`clamp()`).

## Accessibility
`prefers-reduced-motion` skips scatter/assemble/flicker entirely and holds the finished icon. Canvases are `aria-hidden`; icon meaning is carried by the adjacent `<h3>` title, not the canvas.

## Performance Requirements
Each icon's particle points are sampled once per mount (offscreen canvas, not per-frame); assembly/disassembly only runs while the section is in view.

## Dependencies
None beyond React/Canvas 2D/GSAP — no global particle engine or Hero→Problem transition yet (Phase 03/04/06 not built; see `ai/memory/known-issues.md`).

## Status
Complete — built directly, out of sequential roadmap order (Phases 01–04 and 06 skipped). See `ai/memory/known-issues.md`.

## Notes
Subline copy ("These aren't separate problems. They're one broken infrastructure.") is reused verbatim from `manuals/02-product-bible.md` §02. Headline and icon captions are new copy written to this scene's stated purpose/emotion — no exact sentence existed in the manuals to restore. The four icon names (Ghosted Leads, Manual Chaos, Slow Response, Lost Revenue) and their captions' cost framing come from Experience Blueprint §10 and Product Bible §02's symptom/cost table, respectively. Cross-reference those manuals for anything not covered above rather than duplicating it here.
