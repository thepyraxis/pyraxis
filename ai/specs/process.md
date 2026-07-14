# Process

## Purpose
Reduce uncertainty about *how* engagement actually works. Visitor has just seen real proof (Phase 11 — Portfolio); this section answers the next honest objection: "okay, but what happens if I actually hire them?" No pitch, no upsell — just the shape of the engagement made visible.

## Narrative
Before entering: visitor believes PYRAXIS ships real systems (Phase 11), but has no mental model of the *engagement* itself — unclear how work starts, how it's scoped, what happens after launch.
After leaving: visitor has watched a single signal travel Discovery → Strategy → Build → Launch → Scale, and now holds a concrete, ordered mental model of the relationship's lifecycle. They carry that clarity into Future-Proof Systems (Phase 13), ready for the cinematic "this is what scale looks like" beat — per `ai/knowledge/sections.json`, standardized there as **Future-Proof Systems** (manuals call it "Intelligence Core"; see D-005 in `ai/memory/decisions.md` — this spec uses the `ai/` name, not the manual's).

## Emotional Goal
Clarity. Medium intensity — a breath after Portfolio's evidence and before Future-Proof Systems' spectacle. The visitor should feel *oriented*, not impressed.

## Non-Goals
This section is NOT:
- A timeline graphic with dates/durations.
- A project-management/Gantt visualization.
- A pricing or package-tier breakdown.
- A testimonials or case-study section.
- A form or lead-capture moment (that's CTA, Phase 14).

Its only purpose is to make the five-stage engagement shape legible at a glance.

## Layout

### Desktop
`max-w-[1240px]` centered column, matching Portfolio/Why-PYRAXIS. Headline + subline top, then a single **vertical progression** below — five stage labels (Discovery, Strategy, Build, Launch, Scale) stacked top-to-bottom. No arrows, no connecting lines-as-decoration, no boring timeline bar. Per Blueprint §15: "the signal physically travels through each stage. The visitor follows it" — the traveling particle *is* the connective element, not a drawn line.

### Tablet
Same vertical stack, same order, reduced label/type scale. No layout-shape change — this section is vertical at every breakpoint (unlike Growth Engines' D-014 desktop-row/mobile-stack split), since Blueprint §15 specifies vertical progression as the core idea, not a mobile fallback.

### Mobile
Same vertical stack. Scroll-linked signal travel becomes a simpler/lighter transform if needed for performance (see Animation → Reduced motion / mobile), but the stage order and vertical shape do not change.

### Height
`90vh` per `ai/knowledge/sections.json`. Shorter than Portfolio/Future-Proof Systems — this is a breath beat, not a showcase.

### Spacing
Five stages distributed evenly across the section's vertical run. Stage label spacing follows `section` motion-scale rhythm, not ad hoc values — reuse `styles/tokens/motion.ts` scale steps already established in Portfolio/Growth Engines.

### Stage arrangement
Fixed order, never reordered, never data-driven from an external file — the five stages (Discovery → Strategy → Build → Launch → Scale) are the content, per Blueprint §15's literal sequence. Unlike Portfolio's `projects.ts`, there is no expectation this list grows or shrinks.

## Visual Direction

### Colors
`styles/tokens/colors.ts` exclusively. Same restraint as Portfolio — purple weight cap (`PURPLE_WEIGHT_CAP = 0.05`) applies; purple reserved for the traveling signal itself and the currently-active stage label, never as a fill or background.

### Lighting
No per-stage card lighting (there are no cards). The only light source is the traveling signal particle itself — it should read as the section's sole point of brightness moving through otherwise calm, dark composition.

### Depth
Flat plane, no stacked/layered illusion — consistent with Portfolio's "cards sit on one plane" precedent, applied here to stage labels instead of cards.

### Composition
Left-aligned headline, stage labels likely center or left-aligned beneath it (exact alignment is an implementation decision at build time, not a locked spec constraint — Blueprint §15 doesn't dictate horizontal alignment, only "no arrows, no boring timeline").

### Motion language
Calm, continuous, deliberate — the signal's travel should feel inevitable and smooth, not stepped or bouncy. Matches Portfolio's "well-oiled rail, not a bouncy spring" precedent, applied to a traveling point instead of a horizontal rail.

### Forbidden
No arrows. No connecting-line timeline graphic. No Gantt/roadmap imagery. No dates or durations. No pricing. No progress-bar percentage UI. No confetti/celebration effects.

## Stage Specification

Five fixed stages, in order, per Blueprint §15 (`Discovery → Strategy → Build → Launch → Scale`):

1. **Discovery** — understanding the business before building anything.
2. **Strategy** — deciding what to build and why, before code.
3. **Build** — the actual engineering work (this is where Phases 01–11 of this very roadmap live, narratively).
4. **Launch** — shipping to production.
5. **Scale** — the ongoing growth-engine phase (ties back thematically to Growth System/Growth Engines, Phases 08–09).

Each stage needs: a short label (the stage name) and one short supporting line (what happens during that stage) — no metrics, no fabricated outcomes, matching Portfolio's "no outcome claims" rule.

## Animation

### Initial viewport state
On fresh load/refresh/deep link: signal sits at Discovery (stage 0), nothing pre-traveled, no partial animation already played — same determinism rule as Portfolio's Phase-11 fix (card 0 / here, stage 0, active by default).

### Entry
Section and its five stage labels render calmly into view as the section enters viewport — no per-stage icon-construction technique (no icon glyph in this spec's Stage Specification, same reasoning Portfolio used to skip per-card canvases).

### Idle
Signal is not static — Blueprint §15 specifies continuous travel, not a fixed marker. Exact idle-vs-scroll-driven behavior (does the signal drift on its own at rest, or only advance on scroll?) is UNKNOWN — flag as an open question for build time, do not invent an answer here.

### Scroll
Vertical scroll progress drives the signal's position along the five stages (analogous to Portfolio's scroll-driven `activeIndex`, but the signal *moves*, not the viewport). Whichever stage the signal currently occupies is tracked as `activeIndex`/`activeStage` and passed to the shared particle engine as `focusIndex`, same pattern Portfolio already established.

### Exit / Leaving
Per Blueprint §15: "Signal accelerates. Carries energy into Scene 08 [Future-Proof Systems]." The exit transition is not a generic fade — the signal should visibly speed up as the section ends, handing momentum to the next scene's opening. This is the one scene-to-scene transition in the roadmap so far with an explicit acceleration beat; note it in `components/process/motion.ts` as a real constant, not an ad hoc tween.

### Particle behavior
Routes through the shared `ParticleProvider` (no per-stage canvas), `particleType: "signal"` (this section's core visual metaphor literally is "a signal," more than any other scene). Density: follow the same 0.03–0.12 range other scenes use; exact value TBD at build time, default to something below Portfolio's 0.08 since this section is calmer — pick a real number in `motion.ts` at build time, don't leave a placeholder in shipped code.

### Transition into Future-Proof Systems
Accelerating-signal handoff per Blueprint §15 (see Exit/Leaving above) — the one scene transition in this roadmap that's explicitly *not* just "same provider handoff every prior scene already does." Build this deliberately, don't default to the generic pattern without accounting for the acceleration beat.

## Loading States
- **Slow network / images unavailable**: N/A — no images in this section (text + traveling particle only), same as Portfolio.
- **JS disabled**: Five stages render as a static, fully-visible vertical list in DOM order — no scroll-linked signal, content remains readable as plain markup. Matches Portfolio's graceful-degradation precedent.
- **General rule**: no empty boxes, no layout shift, same as every other scene.

## Interaction

### Hover
Not required for core comprehension — Blueprint §15 describes a passive, scroll-driven reading experience, not a hover-dependent one. If per-stage hover states are added at build time, they must follow Portfolio's "hover never gates functionality" rule.

### Keyboard / Focus
If stages become focusable elements (e.g., for screen-reader stage-by-stage navigation), each needs the same `tabIndex`/`aria-label` treatment Portfolio's cards use. Exact focusable-element structure TBD at build time — no click-to-navigate requirement here (no "View Project" equivalent).

### Touch
Native vertical scroll only — no horizontal swipe mechanic (unlike Portfolio's rail), since the progression is vertical at every breakpoint.

### Reduced motion
Signal does not animate/travel — stages render as a static list, matching every other scene's reduced-motion pattern. Particle density drops to the reduced-motion tier used elsewhere (0.03 in Portfolio; reuse unless a stronger reason emerges at build time).

## Performance Rules
- 60 FPS sustained during scroll-linked signal travel on mid-tier hardware.
- Zero CLS — stage label positions reserved before content paint.
- GPU-accelerated transforms only (`transform`, `opacity`) — no animating `top`/`left` for the traveling signal.
- No re-renders inside the scroll handler — `ScrollTrigger` (if used, via the shared `lib/gsap.ts` helper per Portfolio's precedent) reads refs; React state only updates when the computed active stage actually changes.
- No magic numbers — all animation constants (density, ease, acceleration curve for the exit beat) centralized in `components/process/motion.ts`, reusing `styles/tokens/motion.ts` where a scale step applies.

## Accessibility
- Heading hierarchy: section `h2` (headline), stage labels `h3` — no skipped levels, matching Portfolio/Growth Engines pattern.
- Full keyboard navigation if stages are made focusable (see Interaction → Keyboard/Focus above).
- Visible focus states on any interactive element added.
- Stage order must be correct and readable in plain DOM order with CSS disabled — this is the accessibility baseline for a "no arrows, no timeline graphic" section: the underlying markup order *is* the timeline.
- Full `prefers-reduced-motion` path per Animation section above.

## Dependencies
`portfolio` (previous scene, per `ai/knowledge/sections.json` `dependencies: ["portfolio"]`) — reuses its `ParticleProvider`/`AnimationProvider` integration pattern directly, same as every scene since Phase 08. GSAP `ScrollTrigger` (if the scroll-driven signal needs it) registers via the shared `lib/gsap.ts` helper, not a fresh direct import — per the pattern corrected during Portfolio's build (see `ai/specs/portfolio.md` Notes).

## Open Questions (flag, don't guess)
- Exact idle behavior of the signal at rest (does it drift, or hold still until scroll input?) — UNKNOWN, see Animation → Idle above.
- Exact particle density value for this section — UNKNOWN, pick a real number at build time (see Animation → Particle behavior).
- Whether stages are individually focusable/interactive elements or purely presentational text — UNKNOWN, see Interaction section.
- Horizontal alignment of stage labels beneath the headline — not dictated by Blueprint §15, implementation's call at build time.

## Acceptance Criteria
✓ Build passes
✓ Lint passes
✓ No console errors or warnings
✓ Mobile layout complete (vertical stack, native scroll, no horizontal swipe mechanic)
✓ Tablet and desktop verified at correct scale
✓ 60 FPS sustained during scroll-linked signal travel on mid-tier device
✓ Zero layout shift (CLS = 0)
✓ Deterministic initial viewport state on fresh load (signal at Discovery, nothing pre-traveled)
✓ Exit/leaving transition includes the explicit acceleration beat (Blueprint §15), not a generic fade
✓ Reduced-motion path verified (static vertical list, no signal travel)
✓ Graceful degradation verified (JS disabled — plain readable stage list in DOM order)
✓ Five stages in the exact order: Discovery, Strategy, Build, Launch, Scale — no reordering, no additions, no omissions
✓ No arrows, no timeline-bar graphic, no dates/durations/pricing anywhere in the section
✓ No magic numbers — all animation constants centralized in `components/process/motion.ts`
✓ No duplicated component logic vs. Portfolio's established patterns
✓ `.placeholder.md` deleted (feature is genuinely implemented)
✓ Production ready

## Status
Built. `components/process/Process.tsx`, `motion.ts`, `content.ts` implemented per this spec — spec was written and locked first (this session), component code written after, per user instruction mirroring Phase 11's discipline. `tsc --noEmit`, `eslint` (`next lint`), and `next build` all verified clean.

## Notes
- This spec intentionally leaves several implementation details as flagged Open Questions rather than inventing plausible-sounding answers — `manuals/05-experience-blueprint.md` §15 is short and doesn't specify everything (e.g. exact idle motion, exact density number). Unresolved items get flagged, not silently decided and buried in code.
- Naming: this file follows `ai/knowledge/sections.json`'s `id: "process"` / `name: "Process"`; the source manual section is `manuals/05-experience-blueprint.md` §15 "Scene 07 — Process." No naming drift here (unlike the Future-Proof-Systems/Intelligence-Core case, D-005).
