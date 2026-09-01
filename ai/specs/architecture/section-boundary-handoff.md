# Spec: Section-Boundary Transition (Shared Particle Handoff)

Status: LOCKED (implemented and verified this session — see ai/memory/decisions.md D-016)
Scope: Infrastructure + a thin per-section integration hook. Applies to all 11
section boundaries in `app/page.tsx`. No section's core content, layout, or
primary animation is redesigned — this adds a boundary-only handoff layer on
top of what already exists.

## Problem

Verified against the live repo (not memory, which was stale/inaccurate on this
point): 11 sections sit directly adjacent in `app/page.tsx` with zero dedicated
transition mechanism between them. Each section's own particles/canvas/DOM
content simply starts and stops at its own boundary. This violates the spirit
of `ai/rules/architecture.md` #1 ("one continuous application, never a
collection of independent pages") and #7 (Section Completion Gate requires
"transition into the next section" — currently unmet everywhere) and
`ai/rules/animation.md` #3 (scene transitions must physically transform, not
crossfade — currently there is no transition at all, so nothing to crossfade,
but also nothing bridging the cut).

## Why one shared motif, not 11 bespoke ones

Sections are visually heterogeneous (Canvas2D ambient particles, a Three.js/
canvas globe, pure-DOM cards, a CSS marquee — confirmed via `components/`
inventory). Building 11 different bespoke bridge animations would each be a
one-off, violate architecture.md #3 (never duplicate/localize what should be
global), and take 11x the surface area to maintain.

**Corrected finding (this session, verified against live code, not
assumption):** the global particle engine (`providers/ParticleProvider.tsx`)
is mounted at the app root but currently has **zero consumers** — every
section (`Hero`, `Problem`, `GrowthEngines`, `WhyPyraxis`'s globe, etc.) uses
its own self-contained local Canvas2D/WebGL canvas instead, per prior
intentional decisions (`ai/memory/known-issues.md`'s "particle engine
ownership split" entry). The original draft of this spec assumed sections
already sent instructions to the shared engine and that this hook would only
need to modulate existing calls — that assumption was wrong and is corrected
here before implementation.

**Revised approach:** local canvases are left untouched (no risk to any
section's existing, already-shipped visual). Each of the 10 applicable
sections *additionally* sends a new, separate, lightweight instruction to the
shared engine — used for nothing except the boundary-handoff dust itself.
The shared engine becomes the one thing every boundary bridges through,
without requiring any section to migrate its primary particle system off its
local canvas (that migration remains its own separate, larger, out-of-scope
decision per the existing known-issue).

## Goals

1. A new hook, `useSectionHandoff(sectionId, ref)`, built on top of the
   existing `useScrollStore()` (Lenis-backed, from the Lenis integration
   session) and `useParticles()`. Called once per section component. This
   is the FIRST real consumer of `useParticles()` in the codebase — verified
   via grep, zero prior usages.
2. As a section's own bottom edge approaches the viewport bottom (last ~20%
   of its scroll-through), the hook sends a dedicated instruction under its
   own `sourceId` (e.g. `"handoff-hero-exit"`) with `phase: "exiting"` and a
   density that ramps from a small peak down to 0 — a brief burst of dust
   drifting away, independent of and in addition to whatever that section's
   own local canvas is already drawing.
3. Simultaneously, the *next* section's hook instance sends its own
   `"handoff-<id>-enter"` instruction with `phase: "entering"` and density
   ramping 0 to a small peak as its own top edge approaches the viewport
   top. The two run concurrently during the overlap window, so exiting-
   section handoff dust and entering-section handoff dust are visible
   together for that brief span: a physical bridge, not a cut or crossfade
   (animation.md #3).
4. Handoff instructions use a restrained shared visual vocabulary (small
   density budget, `particleType: "ambient"` or `"signal"`, `shape:
   "scatter"`) so they read as connective tissue between sections, not as a
   competing effect against whichever section's own local canvas is more
   visually dominant at that moment.
5. `prefers-reduced-motion`: hook does not send handoff instructions at all
   (no `sendInstruction` call), consistent with every other reduced-motion
   path in this codebase (animation.md #10) — simpler than sending-then-
   suppressing, and there is no correctness reason (unlike `phase` on a
   section's real content) to send it under reduced motion.

## Non-goals

- No new canvas, no new Three.js scene, no per-boundary custom component —
  the shared engine's existing canvas renders the handoff dust.
- No migration of any section's existing local canvas onto the shared
  engine — that is a separate, larger, already-tracked decision
  (`ai/memory/known-issues.md` "particle engine ownership split") and stays
  out of scope here.
- No change to any section's primary content, copy, layout, or core
  animation — this only adds a small additional instruction near the
  last/first ~20% of scroll-through at each boundary.
- No change to `ParticleEngine.tsx`'s rendering itself — `phase`/`density`
  are already-consumed fields; this only adds new callers of the existing
  `sendInstruction` API.
- Marquee (pure CSS, no particle system) and Footer (terminal, nothing after
  it) are excluded from the "handoff to next" side of this pattern — Footer
  still gets an "entering" handoff from whatever precedes it (CTA).
- The pre-existing Hero→Problem opacity crossfade (`useEdgeFadeOpacity`) is
  left as-is for now — see `ai/memory/known-issues.md` for the flagged
  conflict with animation.md #3. This spec's handoff instructions are
  layered in ADDITION to it at that one boundary, not a replacement, pending
  a separate decision on whether to remove the crossfade.

## Where it lives

- New file: `hooks/useSectionHandoff.ts` — the shared hook. Depends on
  `useScrollStore` (`@/providers/ScrollProvider`) and `useParticles`
  (`@/providers/ParticleProvider`); no new provider needed, this is the
  first real consumer of the already-mounted `ParticleProvider`.
- Each of the 10 applicable section components (`Hero.tsx` through
  `Footer.tsx`, excluding `MarqueeTicker.tsx`) adds one hook call with its
  own section ref, alongside whatever local-canvas code it already has —
  additive, not a replacement for any existing per-section animation.

## Acceptance criteria

- [ ] `npm run build` — zero TS/lint errors
- [ ] All 10 applicable boundaries show a brief (per animation.md #5 timing
      scale — treat as a "section animation," 800-1400ms equivalent
      scroll-distance) overlap where outgoing and incoming section particles
      are both visible, no hard cut
- [ ] No section's own primary animation/content is altered outside its own
      boundary window
- [ ] `prefers-reduced-motion` → phase still switches (for correctness) but
      no density ramp/visual choreography
- [ ] No new console errors, no layout shift, no FPS regression
      (`ai/rules/performance.md`)
- [ ] `validate-all.mjs` clean (new hook indexed)

## Related

`ai/rules/architecture.md` #1, #3, #7 · `ai/rules/animation.md` #3, #5, #10 ·
`providers/ParticleProvider.tsx` · `providers/ScrollProvider.tsx` ·
`components/three/particleTypes.ts` (`ParticleInstruction.phase`) ·
`ai/specs/architecture/lenis-smooth-scroll.md` (scroll-progress source this
hook consumes)
