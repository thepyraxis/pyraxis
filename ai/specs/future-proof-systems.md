# Future-Proof Systems

## Purpose
The cinematic climax (Blueprint §16 "Intelligence Core" — see D-005: this file uses the standardized `ai/` name, not the manual's). Show PYRAXIS as living infrastructure at scale, at the highest intensity beat in the whole page, immediately after Why-PYRAXIS/Portfolio/Process have earned it.

## Narrative
Before entering: visitor has proof (Portfolio) and a clear engagement model (Process, accelerating handoff per §15). They believe PYRAXIS *works*.
After leaving: visitor has watched that work implied at civilization scale — a living network, an Earth, signals routing themselves — and now feels the spectacle is inevitable, not decorative. That feeling converges (network → Earth shape) directly into CTA's rising-Earth opening, per §16 "Leaving" and §17 "Layout."

## Emotional Goal
Wonder, Spectacle — **Very High** intensity, the single highest point on the Visual Rhythm Map (§19). It only lands because Why-PYRAXIS (Low) and Process (Medium) came first. Do not soften it to protect earlier sections; the contrast is the point.

## Technical Constraint
The Future-Proof Systems visuals described in Manual §16 are implemented as cinematic 2D approximations using the existing Canvas2D particle engine (`components/three/ParticleEngine.tsx`). There is no Three.js/WebGL renderer in this codebase — `three` is not in `package.json`, and this is a logged, open item (`ai/memory/known-issues.md`, D-012), not an oversight to silently fix here. This limitation is architectural, not conceptual: the choreography defined in this specification is independent of the rendering backend.

The current implementation creates the illusion of a digital Earth, orbital paths, neural systems, a rotating globe, and depth using particle targets (`ParticleInstruction.targets`, normalized 0–1 viewport coordinates), motion choreography (`stepParticle` physics), and layered animation — never a real 3D mesh, sphere geometry, or depth buffer. `ParticleShape` is one of `scatter | circle | nodes | none`; there is no `globe` or `sphere` shape variant, and this spec does not invent one.

This is the scene D-012's known-issue note flags as "the likely forcing function" for revisiting Three.js — revisiting it is out of scope for this spec (see Future Upgrade Path).

## Layout

### Desktop
Massive open environment, full-viewport — no cards, no columns, no grid (§16 "Layout: Massive open environment. No cards."). Minimal or no persistent copy competing with the particle spectacle itself; if a headline exists it is brief and recedes once the network/Earth illusion is established, consistent with `ai/rules/design.md`'s "glow directs attention, doesn't decorate" principle applied to text as well as light.

### Tablet
Reduced particle count and simplified "camera" (parallax/depth-layer count), per §20's device table. Network/Earth illusion still reads, at lower density — no cards introduced as a tablet fallback; this section is never card-based at any breakpoint.

### Mobile
Lower particle density, simplified transitions, touch replaces hover (§20). No horizontal scroll if usability suffers (§20's general rule, applied here since this section has no rail/track to begin with — it's a full-viewport ambient scene, not a scroll-driven list like Portfolio/Process).

### Height
`130vh` per `ai/knowledge/sections.json`'s `future-proof-systems` entry — the tallest scene alongside CTA-adjacent scale, giving the climax room to breathe before CTA's rising Earth.

### Spacing
No card/grid spacing system applies (no cards exist). Any copy present follows the semantic type scale (`display-*`/`heading-*`) per `ai/rules/design.md` §9 — no hardcoded font sizes.

### Composition
Full-bleed particle field is the composition; text, if present, is secondary and minimal. No boxed/contained layout — this is the one scene explicitly described as "massive open environment," in contrast to every prior section's `max-w-[1240px]` centered column (Portfolio, Why-PYRAXIS, Process).

### Scroll behavior
Entry: network/Earth illusion builds as the section enters viewport (construct/assemble language per `ai/rules/animation.md` #1 — never a fade-in). Exit: network converges, particles begin forming the Earth shape that CTA opens with (§16 "Leaving," §17 "Layout" — Earth ~30% visible rising from bottom). This is a physical hand-off between scenes, not a crossfade (`ai/rules/animation.md` #3).

## Visual Direction

### Colors
`styles/tokens/colors.ts` exclusively, same restraint as every prior scene. Purple weight cap (`PURPLE_WEIGHT_CAP = 0.05`, per Portfolio/Process precedent) still applies even here — §16/§21 call this the scene with "maximum lighting complexity" and "Earth is brightest element," but brightness comes from glow/light intensity on existing tokens, not from breaking the purple-weight budget or introducing new hex values.

### Lighting
Per §21: maximum lighting complexity for the whole page, Earth is the brightest single element. Lighting breathes, it does not flicker (§21) — no strobing, no flashing thresholds that could trip `prefers-reduced-motion`/photosensitivity concerns (see Accessibility).

### Depth
Layered-depth *illusion* only (2D parallax/z-ordering of particle groups, opacity/scale layering) — never a real depth buffer or z-axis camera. This is the section where the Canvas2D-vs-Three.js gap is most visible, so depth cues (size, opacity, layered motion speed) have to carry more weight than in calmer scenes like Process.

### Composition
Network fills the frame; Earth silhouette forms as a distinct, denser particle cluster within it, not a separate rendered object. Signals (particleType `signal`) route between network nodes, reusing the same visual language Process established for its traveling signal, but now many-at-once rather than one traveling point.

### Motion language
The busiest, most alive motion on the page — nodes responding to hover, signals rerouting, the globe illusion slowly rotating (§16 "Mouse interaction"). Still governed by `ai/rules/animation.md`: construct/flow/morph, never random pop/spin; camera-equivalent motion (parallax, rotation-illusion) stays in the "slow zoom, gentle orbit, soft parallax" register (#4), even at this section's higher density — "most interactive" (§16) is not license to violate the "should go unnoticed consciously" camera-subtlety rule.

### Forbidden visuals
Per the Phase 13 brief's "Do Not Lie" constraint, this spec and any resulting build copy/comments must not describe the implementation using: **true 3D globe, sphere renderer, volumetric rendering, orbital simulation, globe mesh**. Use instead: **globe illusion, 2.5D Earth silhouette, orbital motion illusion, particle target choreography, layered depth illusion.** No cards. No grid layout. No literal line-drawn network diagram (the network must read as particles/signals, not an infographic).

## Scene Specification
- **Earth illusion**: A denser, roughly-circular cluster of particles (shape `circle`, `targets` distributed around a normalized-coordinate ring per the existing `resolveTarget` node-jitter pattern in `ParticleEngine.tsx`) reads as a globe silhouette. "Rotation" is illusion-only — achieved by cycling which targets are active/brightest over time or by slow angular offset of the target ring, not a mesh transform.
- **Network**: Surrounding particles (shape `nodes`, `particleType: "network"`) form persistent anchor points across the viewport, analogous to Growth System's node ecosystem but denser and full-viewport rather than a bounded circle.
- **Orbital illusion**: A subset of particles traces slow, roughly-elliptical paths around the Earth cluster by cycling `targets` over time — genuine orbital *motion*, not an orbital physics simulation; paths are choreographed, not calculated from gravitational mechanics.
- **Particle choreography**: Signals (`particleType: "signal"`) travel node-to-node across the network, reusing Process's single-traveling-signal visual language but instantiated as many concurrent signals, consistent with §16 describing this as infrastructure operating "at scale."
- **Interaction**: Per §16, this is explicitly "the most interactive section" — see Animation/Interaction below for the mouse-reactive network, hover-responsive nodes, and dynamic signal rerouting this implies.

## Animation

### Entry
Network and Earth-illusion particles construct into place (assemble/build language, `ai/rules/animation.md` #1) as the section enters viewport — not a fade, not a slide.

### Idle
Continuous ambient motion at rest: orbital-illusion particles keep tracing their paths, signals keep routing between nodes, Earth-illusion "rotates" slowly (target-ring cycling) — this section is never static at idle, unlike Process's discrete stage-to-stage travel.

### Scroll
Scroll progress can bias overall density/prominence of the network build-in and, at exit, drives the converge-into-Earth transition (see Exit below). Unlike Portfolio/Process, this section's core motion is not itself scroll-scrubbed frame-by-frame — it's a living ambient scene, scroll mainly gates entry/exit.

### Hover
Per §16: nodes respond to hover, and the network reacts to cursor position generally — nearby particles are pushed/redirected toward or away from the cursor (reusing the existing `stepParticle` mouse-repulsion physics already shared by every scene through `MouseProvider`), and hovering a node can bias signal routing toward it, the same `focusIndex`-redirect pattern Growth Engines/Process already use.

### Exit
Network converges; particles begin physically re-forming into the Earth shape CTA opens with (§16 "Leaving," §17). This is the second explicit non-generic scene transition in the roadmap (after Process's accelerating-signal handoff) — build it as a real, named transition, not the default provider hand-off every earlier scene between Hero and Process used.

### Particle behavior
Routes through the shared `ParticleProvider`/global `ParticleEngine` — no section-owned canvas, consistent with every scene since Phase 08 (Growth System). Mixes `particleType`s `network`, `signal`, and `earth` (already defined in `components/three/particleTypes.ts`'s `PARTICLE_TYPE` map, unused by any scene so far). Density is this page's highest allocation given §19's "Very High" intensity rating — exact value TBD at build time within the existing 0–1 density-share range (`ParticleInstruction.density`), scaled against `densityBudget` per device tier (`styles/tokens/particles.ts`); do not invent a new budget tier.

### Transition into CTA
Converging network → Earth shape (see Exit) hands directly into CTA's opening state, where Blueprint §17 describes "Massive Earth (~30% visible, rising from bottom)" already in place. The Earth-illusion cluster this section builds should be the same visual object CTA continues, not a separate Earth reconstructed from scratch — continuity of particle identity across the scene boundary, per `ai/rules/animation.md` #3 ("scene transitions... preserving particle continuity").

## Interaction

### Mouse
Continuous cursor-reactive network per §16 — this is the single most cursor-responsive section on the page. Particles are pushed by cursor proximity and return naturally after (reusing existing repulsion/return physics in `stepParticle`), same underlying mechanism as every other scene's cursor interaction, just with more particles and node-hover-triggered rerouting layered on top.

### Keyboard
No content in this section requires keyboard interaction to access — it is an ambient/decorative spectacle (`aria-hidden` on the canvas, matching `ParticleEngine.tsx`'s existing `aria-hidden="true"`). If a headline/copy element exists, it follows normal heading-hierarchy and focus-order rules (see Accessibility) independent of the particle layer.

### Touch
Touch replaces hover per §20 — on tablet/mobile, tap or touch-drag on/near a node can trigger the same focus-redirect hover would on desktop, at reduced particle density. No gesture is required to experience the section; it must read correctly with zero touch input too, same "interaction enhances, never gates" principle as every prior scene.

### Reduced motion
Per `ai/rules/animation.md` #10: replace morphing/orbital-illusion motion with reduced-motion equivalents (lower density, static or near-static Earth-illusion cluster, no cursor-repulsion physics) while preserving the narrative beat — the visitor should still perceive "network converging toward an Earth shape," just without the full continuous motion. Never simply disable the section's visuals outright.

### Accessibility
Canvas is `aria-hidden`, decorative only — see Accessibility section below for the full heading/focus/ARIA treatment of any non-canvas content.

## Performance Rules
- 60 FPS sustained even at this section's peak particle density — the highest density budget on the page must not be the section that breaks the frame budget; `PerformanceProvider`'s `degradeFactor` (already wired into `ParticleEngine.tsx`) governs graceful degradation, not a bespoke mechanism for this scene.
- Zero CLS — no layout shift from any copy/heading elements entering.
- GPU-friendly transforms only (`transform`/`opacity`) for anything outside the canvas itself; the canvas's own particle rendering is already `requestAnimationFrame`-driven, not CSS-animated.
- No unnecessary allocations — struct-of-arrays pool reuse (`ParticlePool`) already forbids per-frame object allocation (`ai/rules/coding.md` #11); this section must not introduce a second allocation pattern for its denser particle mix.
- No React state updates per animation frame — mouse position and particle state live in refs/the pool (`MouseProvider`, `ParticlePool`), matching the existing architecture; React only re-renders on genuine discrete state changes (e.g., a hovered node's label, if any).

## Accessibility
- Heading hierarchy: if a headline exists, it is `h2` at this section, consistent with every prior scene's pattern (Portfolio/Growth Engines/Process) — no skipped levels.
- Keyboard support: no keyboard interaction is required to perceive this section's core content (it's ambient/decorative); any focusable element introduced (e.g., a headline link) gets standard visible focus states.
- Focus: canvas itself is never a focus target (`aria-hidden`, `pointer-events-none`, matching `ParticleEngine.tsx`'s existing props).
- ARIA: canvas stays `aria-hidden="true"`; any real content (headline/copy) uses semantic HTML, not ARIA overrides, per the existing project pattern.
- Reduced motion: full `prefers-reduced-motion` path per Animation → Reduced motion above — narrative beat (network → Earth convergence) preserved, motion/density reduced, never fully disabled (`ai/rules/animation.md` #10).

## Future Upgrade Path
This spec's narrative, choreography, interaction, and layout are rendering-implementation-agnostic by design, so a future migration to Three.js/WebGPU with an actual 3D-rendered Earth changes only the **Scene Specification**'s rendering mechanics, not:
- the Purpose/Narrative/Emotional Goal,
- the Layout (full-viewport, no cards, 130vh),
- the Animation beats (entry-construct, idle-orbit, hover-reroute, exit-converge-to-Earth),
- the Interaction model (cursor-reactive network, touch-replaces-hover, most-interactive-section status),
- or the transition contract into CTA (converged Earth shape continues, not resets).

If/when that migration happens, it resolves the open `ai/memory/known-issues.md` item ("Particle engine is Canvas2D, not Three.js... revisit if a scene needs true 3D — the manual's globe/Earth scene in Future-Proof Systems/CTA is the likely forcing function") and should be logged as a new numbered decision in `ai/memory/decisions.md`, not folded silently into this spec. This spec does not attempt that migration and does not pretend the current build already has it.

## Dependencies
`process` (previous scene, per `ai/knowledge/sections.json` `dependencies: ["process"]`) — reuses `ParticleProvider`/`AnimationProvider`/`MouseProvider`/`PerformanceProvider` directly, same integration pattern every scene has used since Phase 08. `cta` (next scene) depends on this section per the same file — the Earth-convergence hand-off is a hard contract between the two specs, not an implementation detail either section owns alone.

## Open Questions (flag, don't guess)
- Exact particle density value and per-`particleType` split (`network`/`signal`/`earth`) for this section — UNKNOWN, pick real numbers at build time within the existing budget/token system, per Process's precedent of flagging rather than inventing exact figures.
- Whether any headline/copy exists at all in this section, or whether it is 100% wordless spectacle — §16 doesn't specify copy; UNKNOWN, implementation's call at build time.
- Exact mechanism for the "rotating globe" illusion (target-ring angular cycling vs. per-particle orbit offset) — UNKNOWN, either is consistent with this spec's Technical Constraint; pick one at build time and document it in `components/future-proof-systems/motion.ts`, don't leave it undocumented in code.
- Whether orbital-illusion particles and network particles are the same pool/instruction or separate `ParticleInstruction`s with different `sourceId`s — UNKNOWN, build-time architecture decision within the existing instruction API.

## Acceptance Criteria
✓ Build passes
✓ Lint passes
✓ No console errors or warnings
✓ No `three`/WebGL dependency introduced — Canvas2D only, per Technical Constraint
✓ No forbidden-vocabulary terms (true 3D globe, sphere renderer, volumetric rendering, orbital simulation, globe mesh) appear in code comments, copy, or docs for this section
✓ No cards, no grid layout, at any breakpoint
✓ Mobile layout complete (reduced density, touch replaces hover, no horizontal-scroll usability regression)
✓ Tablet and desktop verified at correct scale and particle density per §20
✓ 60 FPS sustained at this section's peak (highest) particle density on mid-tier hardware
✓ Zero layout shift (CLS = 0)
✓ Mouse-reactive network verified: cursor proximity redirects nearby particles; they return naturally after
✓ Hover-triggered signal rerouting verified on at least one node
✓ Exit transition physically converges network into the Earth shape CTA continues (no crossfade, no reset between scenes)
✓ Reduced-motion path verified (lower density, reduced/no orbital motion, narrative beat still legible)
✓ Graceful degradation verified (JS disabled — section does not block surrounding content; canvas is decorative and `aria-hidden`)
✓ `.placeholder.md` deleted (feature is genuinely implemented)
✓ Production ready

## Status
Built. `components/future-proof-systems/{FutureProofSystems.tsx, motion.ts, content.ts, layout.ts}` implemented per this spec — spec was written and locked first (prior session), component code written after, per the discipline mirroring Phases 11–12. `tsc --noEmit`, `eslint` (`next lint`), and `next build` all verified clean. Runtime QA (real-browser check of scroll/hover/converge behavior) not yet performed — see `ai/state.json`.

## Notes
- Naming: this file follows `ai/knowledge/sections.json`'s `id: "future-proof-systems"` / `name: "Future-Proof Systems"`; the source manual section is `manuals/05-experience-blueprint.md` §16 "Scene 08 — Intelligence Core." This is the known, intentional naming divergence logged as D-005 — not an error to reconcile toward the manual.
- This spec deliberately does not resolve the Canvas2D-vs-Three.js question flagged in `ai/memory/known-issues.md` — it specifies the cinematic-2D-approximation approach the current engine actually supports (per the Phase 13 brief's Technical Constraint) and defers the real-3D question to Future Upgrade Path / a future decision entry.
- Several implementation details (exact density numbers, exact rotation mechanism, whether copy exists) are flagged as Open Questions rather than invented, matching Process's and Portfolio's established discipline for this project.
