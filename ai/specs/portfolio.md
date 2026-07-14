# Portfolio

## Purpose
Prove PYRAXIS ships real, working systems — not case-study fiction. Section exists to convert skepticism ("another agency with a template") into trust, by showing actual built artifacts a visitor can inspect the logic of, not screenshots of someone else's brand.

## Narrative
Before entering: visitor has just absorbed *why* PYRAXIS is different (Phase 10). They're persuaded intellectually but not yet convinced practically — "sounds good, but has this actually been built for anyone real?"
After leaving: visitor has seen six concrete, named systems with real technology and real status, and now believes PYRAXIS builds production software, not slide decks. They carry that belief into Process (Phase 12), ready to see *how* it gets built.

## Emotional Goal
Quiet credibility through evidence. The section should feel like inspecting a production system, not reading a marketing brochure.

## Non-Goals
This section is NOT:
- A testimonials section.
- A client logo wall.
- A pricing section.
- A statistics section.
- A gallery of screenshots.
- A marketing carousel.
- A list of services.

Its only purpose is to demonstrate real engineering work through genuine PYRAXIS systems.

## Layout

### Desktop
`max-w-[1240px]` centered column. Headline + subline top, then horizontal-scroll card rail below. Cards visible depend on `projects.ts` length (rail is data-driven, not fixed to 6) — see Data-Driven Rendering below. Rail reveals remaining cards via scroll-linked horizontal translate (GSAP ScrollTrigger `scrub`, not native `overflow-x`).

### Tablet
Same rail mechanic, card width scales down (~78vw per card), 1.3 cards visible at rest.

### Mobile
Rail becomes swipeable native `overflow-x: scroll` with `scroll-snap-type: x mandatory` — no GSAP scrub (avoids scroll-jacking on touch, per `ai/rules/animation.md` mobile carve-out). One card per snap point, ~92vw wide.

### Height
`min-h-[100vh]` desktop/tablet (rail needs runway for scrub distance), `min-h-fit` mobile (native scroll doesn't need a pinned track).

### Spacing
Card gap `24px` desktop/tablet, `16px` mobile. Section vertical padding follows `section` motion-scale rhythm, not ad hoc values.

### Card arrangement
Single horizontal row, source order = array order in `projects.ts`. No masonry, no grid wrap.

### Scroll behavior
Desktop/tablet: vertical scroll drives horizontal card translate via pinned `ScrollTrigger` (scrub: true, no snap — continuous). Mobile: horizontal touch scroll only, vertical scroll unaffected, snap-to-card.

## Data-Driven Rendering
Card count is never hardcoded. Component maps over `projects.ts` at render time — adding, removing, or reordering a project requires editing that file only, no component changes. Rail width, scrub distance, and stagger timing all derive from `projects.length`, not a literal number.

## Visual Direction

### Colors
`styles/tokens/colors.ts` exclusively. Card surface = `card` (#08080f), border = `border` (#1a1a2e), active/hover border = `purple.500`. Purple weight cap (`PURPLE_WEIGHT_CAP = 0.05`) still applies — purple only on hover state and status badges, never as base card fill.

### Lighting
Single soft directional highlight top-left of each card, intensifies on hover/focus only. No ambient glow at rest — this section reads as more restrained than Growth Engines.

### Depth
Cards sit on one plane (`z-index` flat), no stacked/layered card illusion. Depth communicated through hover lift and shadow, not through 3D transforms.

### Composition
Left-aligned headline, rail starts flush with headline's left edge on desktop (visual anchor), bleeds full-width on mobile.

### Motion language
Deliberate, mechanical, precise — like a well-oiled rail, not a bouncy/playful spring. Easing = `power2.out` for entry, `power1.inOut` for scroll-scrub. All durations/easings pulled from `styles/tokens/motion.ts` / `components/portfolio/motion.ts` — no ad hoc numbers in component code.

### Forbidden
No fake client logos. No 3D card flips. No parallax background imagery. No auto-playing video. No purple as a card background. No confetti/celebration effects on hover.

## Card Specification

Schema (`ProjectData` in `components/portfolio/projects.ts`), one instance per real system:

- **name** — system's real name, e.g. "PYRAXIS Website" (spec originally said `title`; renamed to `name` to match the shipped data model — documentation follows the code here, not the reverse)
- **category** — one short label: Website / Automation / Booking / Support / Lead Gen
- **description** — one sentence, what it does and how, no outcome claims ("increases X by Y%" forbidden — no metrics exist)
- **technologies** — must exactly match the implementation at ship time. No fixed tech list belongs in this spec; the field is a live mirror of the actual stack, updated whenever the stack changes.
- **status** — `"Built" | "In Development" | "Prototype"`
- **stage** — one of: `Planning → Architecture → Prototype → Internal Testing → Production → Live`. More granular than `status`; must reflect the system's real position on ship day.
- **sourceId** *(optional)* — real DOM id to anchor "View Project" to, if one exists on this page. Only set when a live, inspectable target actually exists (currently just the site itself).
- **CTA** — "View Project" only when `status === "Built"` and `sourceId` exists, else "In Progress" (non-clickable)

Six real systems populate this data at time of writing (PYRAXIS Website, Smart Review System, WhatsApp Ordering System, Booking & Reservation System, Lead Collection System, AI Customer Support System) — but the component itself never assumes six. See Data-Driven Rendering.

## Animation

### Initial viewport state
When entering the page directly (fresh load, refresh, deep link): Card 1 (index 0) renders as the active card by default state, before any scroll/measurement has run. No card animation has already played. No partially-built cards. Section state is deterministic on first paint.

### Entry
Cards render fully formed as the rail scrolls into view — no per-card icon-construction technique (unlike Growth Engines' hand-drawn icon sampling), since this spec's Card Specification has no icon glyph. "Materialize" feeling comes from the shared ambient particle field converging near the section, not a per-card canvas.

### Idle
Static at rest. No ambient card motion (no floating/breathing) — this section is calm by design.

### Hover
Card lifts, border brightens to `purple.500`, local glow intensifies. Duration = `hover` motion scale (250–400ms), `power2.out`.

### Scroll
Horizontal translate driven by vertical scroll progress via pinned `ScrollTrigger` (desktop/tablet, `scrub: true`). The card nearest the rail's progress midpoint is tracked as `activeIndex` and passed to the shared particle engine as `focusIndex`, so ambient particles bias toward whichever card is centered — same idea Growth Engines already uses for hover-focus, applied here to scroll-focus instead.

### Exit
Ambient particle instruction transitions to `phase: "exiting"` when the section leaves the viewport (IntersectionObserver), same lifecycle every other scene already follows.

### Particle behavior
Ambient particles route through the shared `ParticleProvider` (no per-card canvas), `shape: "scatter"`, `particleType: "signal"`, density capped at 0.08 of device-tier budget (0.03 reduced-motion) — between Growth Engines (0.12) and Why PYRAXIS (0.05).

### Transition into Process
Section's exit particle phase hands off into Process's entry the same way every prior scene-to-scene transition already works via the shared provider — no bespoke handoff needed for this pair.

## Loading States
- **Slow network / images unavailable**: N/A at time of writing — cards contain no images (text, badges, and tech tags only). If images are added later, this section must be revisited per the original Image Rules below.
- **JS disabled**: cards render as a static, fully-visible horizontal list (no scrub, no pin) — content remains readable as plain markup.
- **General rule**: cards degrade gracefully in every failure mode. No empty boxes. No layout shift.

## Image Rules
(Reserved for when card imagery is introduced — no images ship in this pass.)
- WebP preferred.
- AVIF if available (with WebP fallback).
- No PNG unless transparency is required.
- No screenshots.
- No device mockups.
- No stock photos.

## Interaction

### Hover
Desktop only, and never required — everything hover does is also reachable via keyboard and touch. Lifts card, brightens border, shows CTA state.

### Mouse
Click anywhere on card activates "View Project" for cards with a live target; no-op for "In Progress" cards.

### Keyboard
Each card is focusable (`tabIndex=0`, `role="group"`, `aria-label` stating name/category/status/stage). Tab order follows card order. Full section usable start-to-finish with keyboard alone.

### Touch
Mobile: native horizontal swipe with scroll-snap. Tap = same as click.

### Focus
Visible `focus-visible` ring in `purple.400` — matches Growth Engines' focus treatment.

### Reduced motion
Rail becomes a static scrollable list (no scrub, no pin). Cards render fully formed immediately. Particle density drops to 0.03.

## Performance Rules
- 60 FPS sustained during scroll-scrub on mid-tier hardware.
- Zero CLS — card dimensions reserved before content paint.
- GPU-accelerated transforms only (`transform`, `opacity`) — no animating `width`/`top`/`left`.
- No re-renders inside the scroll handler — `ScrollTrigger` reads refs; React state (`activeIndex`) only updates when the computed index actually changes.
- No object/array allocation inside the animation loop or `onUpdate` callback.
- No magic numbers — all animation constants (density, ease, breakpoints, hover lift) centralized in `components/portfolio/motion.ts`, reusing `styles/tokens/motion.ts` where a scale step applies.

## Accessibility
- Heading hierarchy: section `h2` (headline), card titles are `h3` — no skipped levels.
- Full keyboard navigation: Tab through cards in DOM order.
- Visible focus states on every interactive element, no focus traps.
- Card `aria-label` states name, category, status, and stage together so screen-reader users get equivalent info to sighted hover.
- Full `prefers-reduced-motion` path per Animation section above.

## Dependencies
`why-pyraxis` (previous scene, per `ai/knowledge/sections.json` ordering) — reuses its `ParticleProvider`/`AnimationProvider` integration pattern directly. GSAP `ScrollTrigger` registered once via the shared `lib/gsap.ts` helper — components import `gsap`/`ScrollTrigger` from there, not from the `gsap` package directly.

## Acceptance Criteria
✓ Build passes
✓ Lint passes
✓ No console errors or warnings
✓ Mobile layout complete (native swipe, snap, no scrub)
✓ Tablet and desktop rail scrub verified
✓ 60 FPS sustained during scroll on mid-tier device
✓ Zero layout shift (CLS = 0)
✓ Keyboard navigation fully functional, hover never required
✓ Focus states visible on every interactive element
✓ Reduced-motion path verified (static rail, no scrub/pin)
✓ Deterministic initial viewport state on fresh load (card 0 active, nothing pre-animated)
✓ Graceful degradation verified (JS disabled; no images shipped this pass)
✓ Zero fabricated clients, testimonials, or metrics — all entries are real PYRAXIS systems
✓ `status` and `stage` per card truthful at ship time
✓ Data-driven: rendering derives entirely from `projects.ts`, no hardcoded card count
✓ No duplicated component logic
✓ No magic numbers — all animation constants centralized
✓ `.placeholder.md` deleted (feature is genuinely implemented)
✓ Production ready

## Status
Built — see `ai/checkpoints/phase11.md` once written. Spec updated post-implementation to match shipped code (`name` field, `stage` field, no per-card icon canvas) rather than the reverse — documentation was out of sync with the build until this pass; see Notes.

## Notes
- Field originally speced as `title` shipped as `name` in `projects.ts` — documentation corrected here to match the code, not the other way around.
- GSAP `ScrollTrigger` registration was moved into a shared `lib/gsap.ts` helper during this pass (originally registered directly in `Portfolio.tsx`) so future sections adopting ScrollTrigger import from one place instead of each registering the plugin independently.
