# Index — Components

```
### ComponentName
- Location: components/.../ComponentName.tsx
- Purpose: ...
- Status: not-started | in-progress | complete
- Used by: ...
```

Keep this file and `ai/knowledge/components.json` in sync — this is the human-readable view, the JSON is the machine-readable one.

## Implemented

### Header
- Location: `components/navigation/Header.tsx`
- Purpose: Sticky site nav; adds a scrolled-state style once the page scrolls past 24px.
- Status: complete
- Used by: `components/hero/Hero.tsx`

### CustomCursor
- Location: `components/common/CustomCursor.tsx`
- Purpose: Custom cursor treatment (per `ai/rules/coding.md` #10, owned globally rather than per-section).
- Status: complete
- Used by: root layout

### Hero
- Location: `components/hero/Hero.tsx`
- Purpose: Phase 05 scene. Section shell — layered lighting (ambient fog / core glow / bloom / reflection), noise texture, mounts `HeroAmbientParticles`, `HeroLogo`, `HeroText`, `HeroButtons`, `Header`.
- Status: complete
- Used by: `app/page.tsx`

### HeroAmbientParticles
- Location: `components/hero/HeroAmbientParticles.tsx`
- Purpose: Full-hero canvas of drifting purple/white dust; a minority of particles have directional intent (`carry` toward the logo, `leak` away from it, looping between the two roles) rather than pure random drift, per `ai/rules/coding.md` #10's "particles always carry meaning."
- Status: complete
- Used by: `components/hero/Hero.tsx`

### HeroLogo
- Location: `components/hero/HeroLogo.tsx`
- Purpose: Sizes/positions the logo mark, applies the `hero-logo-mark` breathing-glow class (`app/globals.css`).
- Status: complete
- Used by: `components/hero/Hero.tsx`

### HeroLogoCanvas
- Location: `components/hero/HeroLogoCanvas.tsx`
- Purpose: Logo mark rendering + story arc — scatter → assemble (center-out staggered convergence from sampled logo pixels) → settle flash → hold, then continuous low-rate ambient erosion/return trickle plus a stronger hover-driven version of the same effect.
- Status: complete
- Used by: `components/hero/HeroLogo.tsx`

### HeroText
- Location: `components/hero/HeroText.tsx`
- Purpose: Headline (two-tier typography: context lines vs. bold payoff lines), founder line, subtext, trust indicator. GSAP entrance reveal only — no continuous motion (motion hierarchy).
- Status: complete
- Used by: `components/hero/Hero.tsx`

### HeroButtons
- Location: `components/hero/HeroButtons.tsx`
- Purpose: Primary/secondary CTA pair.
- Status: complete
- Used by: `components/hero/Hero.tsx`

### HeroScrollIndicator
- Location: `components/hero/HeroScrollIndicator.tsx`
- Purpose: Scroll-cue affordance. Currently unused (not mounted by `Hero.tsx` — the original reference markup/CSS this hero restores from has no scroll indicator).
- Status: complete, not wired in
- Used by: none currently

### Problem
- Location: `components/problem/Problem.tsx`
- Purpose: Phase 07 scene (Experience Blueprint §10). 70vh, cooler/harsher lighting than Hero (tension), mounts `ProblemHeadline` + `ProblemIcons`.
- Status: complete
- Used by: `app/page.tsx`

### ProblemHeadline
- Location: `components/problem/ProblemHeadline.tsx`
- Purpose: Eyebrow + headline + subline (subline reused verbatim from Product Bible §02). GSAP entrance reveal only.
- Status: complete
- Used by: `components/problem/Problem.tsx`

### ProblemIcons
- Location: `components/problem/ProblemIcons.tsx`
- Purpose: Server-side data + layout for the four symptom cards (Ghosted Leads / Manual Chaos / Slow Response / Lost Revenue per Experience Blueprint §10); passes serializable icon ids (not functions) across the server/client boundary to `ProblemIconCanvas`.
- Status: complete
- Used by: `components/problem/Problem.tsx`

### ProblemIconCanvas
- Location: `components/problem/ProblemIconCanvas.tsx`
- Purpose: Generic scroll-driven assemble/disassemble particle canvas (IntersectionObserver-gated) — icons construct on scroll-in, disassemble on scroll-out, per Experience Blueprint §10; sparse "lost/interrupted" flicker while settled (Design System §Signal state for this scene).
- Status: complete
- Used by: `components/problem/ProblemIcons.tsx`

### icons (module, not a component)
- Location: `components/problem/icons.tsx`
- Purpose: Four manufactured (stroke-only, no fill, no emoji) icon draw functions consumed by `ProblemIconCanvas`.
- Status: complete
- Used by: `components/problem/ProblemIconCanvas.tsx`

### ProblemTransitionParticles
- Location: `components/problem/ProblemTransitionParticles.tsx`
- Purpose: Stopgap visual continuity for the Hero → Problem cut — a sparse field in Hero's palette, confined to Problem's top band, drifting down and fading out. Not the real Phase 06 hand-off (that needs the Phase 04 global particle engine); see `ai/memory/known-issues.md`.
- Status: complete (stopgap)
- Used by: `components/problem/Problem.tsx`

### GrowthSystem
- Location: `components/growth-system/GrowthSystem.tsx`
- Purpose: Scene 03 — reveals the PYRAXIS ecosystem as one connected whole; eight engines laid out on a circle, ambient particles continuously travel between them via the global `ParticleProvider`, hover/focus on a node redirects nearby particles toward it.
- Status: complete
- Used by: `app/page.tsx`

### GrowthNode
- Location: `components/growth-system/GrowthNode.tsx`
- Purpose: One node button in the circular layout; hover/focus toggles the section's `focusedIndex`, which is fed back into the particle engine instruction.
- Status: complete
- Used by: `components/growth-system/GrowthSystem.tsx`

### MarqueeTicker
- Location: `components/marquee/MarqueeTicker.tsx`
- Purpose: Scrolling service ticker between Growth System and Growth Engines — ported from the original HTML site's `.marquee-section`; pure CSS `marquee-scroll` keyframe animation (app/globals.css), reuses GrowthEngines' own titles as content, no client component needed.
- Status: complete
- Used by: `app/page.tsx`

### GrowthEngines
- Location: `components/growth-engines/GrowthEngines.tsx`
- Purpose: Scene 04 — six reusable engine cards (Website, Lead, Booking, WhatsApp, Review, AI Assistant — six, not the spec's original seven, see `ai/memory/decisions.md` D-014); horizontal row on desktop, vertical two-column stack on mobile; wires hover/focus into the global `ParticleProvider` the same way `GrowthSystem` does.
- Status: complete
- Used by: `app/page.tsx`

### GrowthEnginesHeadline
- Location: `components/growth-engines/GrowthEnginesHeadline.tsx`
- Purpose: Section headline/subline with a genuine scroll-triggered (`IntersectionObserver`) reveal, unlike Hero/Problem's mount-triggered reveal (this section sits well below the fold).
- Status: complete
- Used by: `components/growth-engines/GrowthEngines.tsx`

### GrowthEngineCard
- Location: `components/growth-engines/GrowthEngineCard.tsx`
- Purpose: The one reusable card used for all six engines (`ai/rules/coding.md` #5/#6) — local cursor-tracked hover glow, keyboard-focusable (`role="group"`, `aria-label`), lifts and lights on hover/focus.
- Status: complete
- Used by: `components/growth-engines/GrowthEngines.tsx`

### GrowthEngineIconCanvas
- Location: `components/growth-engines/GrowthEngineIconCanvas.tsx`
- Purpose: Per-engine particle-assembly icon canvas, generalized from `ProblemIconCanvas` — icon constructs from scattered particles on scroll-in, disassembles on scroll-out; local micro-canvas by design, not routed through the global ambient engine (see `ai/memory/known-issues.md`).
- Status: complete
- Used by: `components/growth-engines/GrowthEngineCard.tsx`

### icons (module, not a component)
- Location: `components/growth-engines/icons.tsx`
- Purpose: Six manufactured (stroke-only, no fill, no icon-library glyphs) icon draw functions consumed by `GrowthEngineIconCanvas`.
- Status: complete
- Used by: `components/growth-engines/GrowthEngineIconCanvas.tsx`

### WhyPyraxis
- Location: `components/why-pyraxis/WhyPyraxis.tsx`
- Purpose: Scene 05 — the visual rest beat after Growth Engines. Editorial, no cards, minimal UI; answers three belief questions (why not an agency, why one system, why trust PYRAXIS) rather than repeating service content; two low-density particle circles flank the copy via `ParticleProvider` (density capped well below Growth Engines' to keep intensity Low per the Visual Rhythm Map).
- Status: complete
- Used by: `app/page.tsx`

### content (module, not a component)
- Location: `components/why-pyraxis/content.ts`
- Purpose: Headline and three-point copy data for `WhyPyraxis`, written to `ai/context/07-brand.md` voice rules.
- Status: complete
- Used by: `components/why-pyraxis/WhyPyraxis.tsx`

### HeroToProblemTransition
- Location: `components/transitions/HeroToProblemTransition.tsx`
- Purpose: The Hero → Problem scene hand-off (Phase 06).
- Status: complete
- Used by: `app/page.tsx`

### ParticleEngine
- Location: `components/three/ParticleEngine.tsx`
- Purpose: The global particle engine (Phase 04) — one fixed full-viewport canvas, one simulation, one renderer; reconciles per-section `ParticleInstruction`s from `ParticleProvider` into a single shared particle pool, Canvas2D rather than Three.js (see `ai/memory/decisions.md` D-012).
- Status: complete
- Used by: `providers/ParticleProvider.tsx`

### particlePool / particlePhysics / particleTypes (modules, not components)
- Location: `components/three/particlePool.ts`, `particlePhysics.ts`, `particleTypes.ts`
- Purpose: Struct-of-arrays particle pool (no per-frame allocation, `ai/rules/coding.md` #11), per-particle physics step, and the shared `ParticleInstruction`/`ParticlePhase`/`ParticleType` types.
- Status: complete
- Used by: `components/three/ParticleEngine.tsx`

### Portfolio
- Location: `components/portfolio/Portfolio.tsx`
- Purpose: Phase 11 scene (`ai/specs/portfolio.md`) — six real systems in a scroll-scrubbed horizontal rail, `ProjectCard` per project, ambient particles via `ParticleProvider`.
- Status: complete
- Used by: `app/page.tsx`

### ProjectCard
- Location: `components/portfolio/ProjectCard.tsx`
- Purpose: One portfolio card — pointer-tracked hover glow, keyboard/focus-activatable, no per-card canvas (ambient field comes from the shared engine).
- Status: complete
- Used by: `components/portfolio/Portfolio.tsx`

### FounderStory
- Location: `components/founder-story/FounderStory.tsx`
- Purpose: Founder-story scene between Portfolio and Process — responsive `grid-cols-1 lg:grid-cols-[1fr_260px]` layout, circular avatar image/placeholder.
- Status: complete
- Used by: `app/page.tsx`

### Process
- Location: `components/process/Process.tsx`
- Purpose: Phase 12 scene (`ai/specs/process.md`) — fixed five-stage vertical progression with a scroll-linked traveling signal dot; ambient particles bias toward the active stage via `focusIndex`.
- Status: complete
- Used by: `app/page.tsx`

### FutureProofSystems
- Location: `components/future-proof-systems/FutureProofSystems.tsx`
- Purpose: Phase 13 scene (`ai/specs/future-proof-systems.md`) — cinematic climax; scattered network converging into a rotating Earth-illusion ring plus a wider orbit ring, all on the shared Canvas2D engine. Exit beat converges the network into the Earth shape CTA continues.
- Status: complete
- Used by: `app/page.tsx`

### CTA
- Location: `components/cta/CTA.tsx`
- Purpose: Phase 14 scene (`ai/specs/cta.md`) — conversion moment. Continues Future-Proof Systems' Earth-illusion ring (bottom-anchored, ~30% visible), one primary WhatsApp link + one subordinate email link (both reused verbatim from `HeroButtons.tsx`), one-time particle-convergence-into-button entry beat after copy reveals.
- Status: complete
- Used by: `app/page.tsx`

### Footer
- Location: `components/footer/Footer.tsx`
- Purpose: Phase 15 scene — site footer, `min-h-[40vh]`, wordmark + links, now also Privacy/Terms legal links (no social — none exist for this business).
- Status: complete
- Used by: `app/page.tsx`

### LegalPage
- Location: `components/legal/LegalPage.tsx`
- Purpose: Shared static layout for `/privacy` and `/terms` routes — no particle engine/GSAP, dark theme matching the rest of the site, content ported verbatim from the original HTML site's `privacy.html`/`terms.html`.
- Status: complete
- Used by: `app/privacy/page.tsx`, `app/terms/page.tsx`

## Related

`ai/prompts/build-component.md`, `ai/knowledge/components.json`

