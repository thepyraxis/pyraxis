# Hero

## Purpose
Create curiosity, establish premium positioning, introduce the living particle system. (Experience Blueprint §09)

## User Experience
Wonder · Confidence · Calm. The visitor's first read is the logo assembling itself out of scattered light — not a static image, not a fade-in.

## Visual Direction
Layered lighting for depth (ambient fog wash → core glow sited on the logo → tight feathered bloom → faint ground reflection), not one flat radial. Dark base (`#020205`), warm violet accent.

## Layout
Cinematic/movie-poster composition: copy left, one large object (the logo) right, sized to read as ~28–30% of the frame at `lg`+ (matches the live reference screenshot — an earlier generic pass had oversized this to ~45vw, corrected). Below `lg` the logo drops back as a faint centered watermark behind the copy rather than disappearing.

## Components
`Hero.tsx` (shell + lighting), `HeroAmbientParticles.tsx`, `HeroLogo.tsx` + `HeroLogoCanvas.tsx`, `HeroText.tsx`, `HeroButtons.tsx`. `HeroScrollIndicator.tsx` exists but is not currently mounted.

## Animation
Logo: scatter (chaos) → assemble (center-out staggered convergence from sampled logo pixels, easeOutCubic) → settle flash → hold, then a continuous slow breathing glow (`hero-logo-mark`, `app/globals.css`) plus a low-rate ambient erosion/return particle trickle — stronger and cursor-anchored on hover. Ambient particles: a minority drift with directional intent toward/away from the logo (carry/leak roles) rather than pure random walk (Experience Blueprint §09 particle behavior; `ai/rules/coding.md` #10). Motion hierarchy: headline/buttons get one entrance reveal only, logo breathes continuously, particles drift slowly, background barely moves (46s ambient drift).

## Interactions
Mouse-proximity glow + erosion-particle burst on the logo canvas; ambient particles repel softly from the cursor.

## Responsive Rules
Logo: translucent centered watermark (opacity 25–35%) below `lg`; full right-side object with hover interaction from `lg` up. Headline uses two-tier fluid type (`clamp()`), not fixed breakpoint jumps.

## Accessibility
`prefers-reduced-motion` disables the logo assembly/breathing/trickle animations (holds the finished mark) and the background drift. Canvases are `aria-hidden`.

## Performance Requirements
Canvases pause via `IntersectionObserver` when off-screen. No per-frame allocation in the hot particle loops (object pooling via in-place `Object.assign` reuse where practical).

## Dependencies
None beyond React/Canvas 2D — no global particle engine yet (Phase 03/04 not built; see `ai/memory/known-issues.md` — this is a tracked deviation from `ai/rules/coding.md` #10).

## Status
Complete — built directly, out of sequential roadmap order (Phases 01–04 skipped). See `ai/memory/known-issues.md`.

## Notes
No exact legacy copy/markup was available to restore for this pass; button/headline copy already existed in the codebase from prior work. Cross-reference `manuals/05-experience-blueprint.md` §09 and `manuals/03-design-system.md` for anything not covered above rather than duplicating it here.
