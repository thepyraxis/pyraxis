# PYRAXIS — Visual Engine Architecture
**Four reusable rendering systems. Every future section composes these — none reinvent rendering.**

> This document designs architecture, not code. No implementation exists yet. Any future build session implements against this file section-by-section; if an implementation detail isn't decided here, it gets decided here first, then built — not improvised inline.

Built on top of what already exists and works: `ParticlePool` (struct-of-arrays, fixed capacity, zero per-frame allocation), `particleTypes.ts`'s DNA model, `MouseProvider`, `PerformanceProvider`'s tier system, and `styles/tokens/particles.ts`'s density budgets. These four systems are the *composition layer* above that substrate — sections talk to these, these talk to the pool.

---

## 00 · Why Four, and Why These Four

Every visual moment in the Creative Direction Bible and Master Motion Bible reduces to one of four jobs:

1. **Something needs to look like it's being manufactured** → `ParticleIcon`
2. **Something needs ambient atmosphere/depth behind content** → `EnergyField`
3. **Something needs to travel from A to B carrying meaning** → `ParticleFlow`
4. **Something needs to represent scale/infrastructure as a rotating whole** → `NetworkGlobe`

No fifth category exists yet. If a future section seems to need something none of these four cover, that's a signal to extend one of the four (most likely `ParticleFlow`, the most general) rather than inventing a fifth system — four is a deliberate ceiling, not a current count.

---

## 01 · ParticleIcon

### Purpose
Renders a single icon, glyph, or small compositional shape as if it were manufactured from matter — particles assemble into the icon's outline, hold, then disassemble. Replaces the current three-way split (raster PNGs in Problem, bespoke `GrowthEngineIconCanvas`, unused `ProblemIconCanvas`, static `LineIcons` SVGs) with one system every icon in the site runs through.

### Visual Language
Edges → Outline → Material → Glow → Final object (Design System §19). Metallic-shard/crystal-fragment material only (Blueprint §03). No color fills — particles carry the color, the assembled shape reads as line/silhouette.

### Inputs
- `shape`: a path definition — an array of normalized 2D points (0–1 space) describing the icon's outline, OR a reference to a pre-sampled shape from an SVG path (sampled once at build/design time, not at runtime)
- `size`: render dimensions (px)
- `density`: particle count for this icon (small integer, not a device-tier number — icons are cheap, tens to low hundreds of particles, not thousands)
- `state`: `"idle" | "constructing" | "assembled" | "disassembling"`
- `color`: single accent color (usually white/silver, purple only if this icon is a signal/CTA-adjacent icon)
- `trigger`: what causes construction — `"onVisible"` (IntersectionObserver-driven) or `"manual"` (parent calls an imperative method)

### Outputs
- A rendered icon at `assembled` state that visually matches what a static SVG icon would show, so it degrades gracefully
- Emits lifecycle events (`onConstructStart`, `onConstructComplete`, `onDisassembleComplete`) so parent components can sequence follow-up animation (e.g., headline reveal waits for icon completion)

### Public API (shape only, no implementation)
```
<ParticleIcon
  shape={SHAPE_TARGET_ICON}      // pre-defined shape constant, one per icon needed sitewide
  size={64}
  density="sm" | "md"             // maps to an internal small/medium particle-count preset, not a raw number
  color="silver" | "purple"
  trigger="onVisible"
  onConstructComplete={() => {}}
/>
```
Sections never pass raw particle counts or raw coordinates — only a named shape constant from a shared `iconShapes.ts` registry (analogous to how `LineIcons.tsx` centralizes icon components today). This keeps every icon's shape defined in exactly one place.

### Internal Architecture
- Owns a small dedicated `ParticlePool` slice (not the global pool) — icons are numerous, small, and short-lived; borrowing capacity from a shared global pool for a 64px icon is unnecessary coordination overhead
- Shape sampling happens once, at module load (build time in practice, since shapes are static constants) — never re-sampled per mount
- Construction assigns each particle a `(startPos, targetPos, delay)` triple computed from shape sample order; disassembly reverses target/start
- Uses the existing `stepParticle` physics function conceptually (same DNA model: position/velocity/life), scoped to this instance's tiny pool rather than the shared one

### Rendering Method
Canvas2D, one `<canvas>` per `ParticleIcon` instance, sized exactly to the icon's bounding box (not full-viewport). This keeps each icon's draw calls trivial and independently pausable via its own `IntersectionObserver`.

### Canvas2D vs WebGL Decision
**Canvas2D.** Icon particle counts are small (tens–low hundreds), and per-icon canvases sized to a 48–96px box are cheap regardless of renderer. WebGL's setup overhead (context, shader compile) isn't worth it for something this size, and it would reintroduce the multi-context management complexity that isn't needed at icon scale.

### Performance Budget
- Per icon: ≤150 particles, ≤2ms frame budget when active
- Only icons currently in viewport (or within one screen of it) run their rAF loop; icons scrolled fully out of view pause construction/idle animation entirely
- Sitewide ceiling: no more than 6 `ParticleIcon` instances animating simultaneously (matches Master Motion Bible §29's 3-Tier-1/2-animations rule with headroom, since icons are Tier 2 structural, not Tier 1)

### Mobile Scaling
- `density="sm"` becomes the default on mobile regardless of what was requested (auto-downgrade, not a manual per-instance override sections have to remember to set)
- On `reducedMotion`, skip construction entirely — render the assembled state as a static shape from frame one

### Accessibility
- Every `ParticleIcon` requires an `alt`-equivalent semantic label passed through to an `aria-label` on the wrapping element, exactly like an `<img>` would need — the canvas itself is `aria-hidden`
- Reduced motion: static final frame only, no construct/disassemble animation, matches Master Motion Bible §21

### Reuse Strategy
Every icon currently rendered via PNG, `LineIcons`, or a bespoke per-section canvas migrates to `ParticleIcon` with a shape entry in `iconShapes.ts`. One new icon need = one new shape constant, never a new component.

---

## 02 · EnergyField

### Purpose
Ambient background atmosphere — the "is this canvas alive" layer sitting behind section content. This is what Hero's `HeroAmbientParticles` does today, generalized so every section can have the same living-background quality Hero has, instead of Hero being the only section with real atmosphere.

### Visual Language
Slow drift, low glow, ambient (Blueprint particle type table). Never the focal point — content in front of an `EnergyField` should always read clearly; the field supports depth, it doesn't compete.

### Inputs
- `density`: device-tier-aware particle count (this is where the existing `densityBudget` tokens plug in directly)
- `palette`: which of the sitewide purple/silver ratios to use (default 95/5, can shift per-scene mood per Master Motion Bible §16's lighting intent — e.g., slightly warmer palette on Growth System)
- `intensity`: `"low" | "medium" | "high"` — maps to glow strength and drift speed, ties to the per-scene intensity table in Creative Direction Bible §02 (Why PYRAXIS = low, Future-Proof = high)
- `interactive`: boolean — whether cursor-gravity response is enabled for this instance (true for Hero/Future-Proof/CTA, false for Why PYRAXIS/Footer)
- `bounds`: the DOM element this field should fill (for sizing/positioning, not full-viewport by default — unlike the old global engine, each `EnergyField` is scoped to its own section)

### Outputs
A continuously-rendering ambient canvas layer behind the section's content, responding to scroll-visibility (pauses off-screen) and optionally to cursor position.

### Public API
```
<EnergyField
  density="tier"                  // reads from PerformanceProvider automatically, no manual override
  intensity="low" | "medium" | "high"
  interactive={true}
  palette="default" | "warm" | "cool"
/>
```

### Internal Architecture
- Each `EnergyField` instance owns its own scoped slice of a pool, sized per `intensity` × device tier — not one giant shared pool across every section anymore (this is the direct fix for the lag/hang: bounded, independent pools per section instead of one global simulation carrying every section's instructions at once)
- Only the field(s) currently in viewport (plus one screen of buffer) run their physics step; everything else is fully paused (rAF cancelled, not just "not drawing") — this is the enforcement mechanism behind Master Motion Bible §28's "no more than one section at Tier-1 density simultaneously" rule
- Cursor-reactive fields subscribe to `MouseProvider` only while `interactive` and in-viewport; unsubscribe otherwise

### Rendering Method
Canvas2D, one canvas per `EnergyField` instance, sized to its section's bounding box (not viewport-sized with `inset(-5%)` overscan the way Hero does today — that pattern is Hero-specific and doesn't need to generalize).

### Canvas2D vs WebGL Decision
**Canvas2D**, same reasoning as the existing engine — the project's entire particle material language (metallic shards, micro-polygons) was designed for and validated in Canvas2D, and WebGL's benefit (better raw throughput at very high counts) isn't needed at the density budgets in §12 of the Motion Bible. Revisit only if a specific section needs particle counts that exceed what Canvas2D can hold at 60fps on mid-tier hardware — no evidence of that need yet.

### Performance Budget
- Directly inherits `densityBudget` tiers (desktop 3,000–8,000 / tablet 1,200–2,500 / mobile 400–1,200) — but per-instance, and only one instance may run at Tier-1 (desktop-max) density at a time sitewide, enforced by a lightweight registry (see Reuse Strategy)
- Sections at `intensity="low"` (Why PYRAXIS, Footer) should request well below their tier's max, not the ceiling — intensity should actually gate the requested count, not just a visual glow parameter

### Mobile Scaling
Automatic via `densityBudget` tier lookup — sections don't set device-specific numbers themselves, ever.

### Accessibility
`aria-hidden`, fully decorative. On `prefers-reduced-motion`: render zero particles or a single static low-opacity gradient in place of the field — do not attempt a "slowed down" version, per Motion Bible §21's instruction that reduced motion disables camera/parallax-adjacent effects outright.

### Reuse Strategy
A lightweight `EnergyFieldRegistry` (a simple counter, not a full provider) tracks how many instances currently want Tier-1 density and refuses a second simultaneous grant, downgrading the second requester to Tier-2 until the first exits viewport. This is the concrete mechanism that prevents the original global-engine incident from recurring once every section has its own field.

---

## 03 · ParticleFlow

### Purpose
Directed particle travel from a defined origin to a defined destination, carrying meaning (a signal, a piece of data, a connection being made). This is Process's traveling signal dot generalized into a reusable primitive, and it's also the mechanism for real section-to-section transitions (Motion Bible §18) — the most structurally important of the four systems, since it's the one directly responsible for fixing "ten pages, not one journey."

### Visual Language
Travel and Transform (Motion Bible §05). A `ParticleFlow` instance should always be describable as "X is becoming/reaching Y" — never decorative motion without a named origin and destination.

### Inputs
- `path`: either a straight/curved line between two points, or an array of waypoints (for multi-stage journeys like Process's five stages)
- `progress`: 0–1, either scroll-linked (external, section passes in scroll fraction) or time-driven (internal rAF-based loop for continuous flows like Growth System's node connections)
- `particleCount`: small-to-medium (tens, not thousands — a flow is a few dozen particles at most, it's a line, not a field)
- `carrying`: semantic tag for what this flow represents (`"signal" | "network" | "energy"`) — purely for the glow-color/material lookup, not functional, but keeps every flow's meaning explicit at the call site
- `onArrive`: callback fired when progress reaches 1 (used to trigger the destination's construction, e.g., a `ParticleIcon` beginning to assemble exactly when the flow arrives — this is the literal mechanism for matter-conserved transitions)

### Outputs
A moving stream of particles between two points, plus the `onArrive` event that lets the destination component react in sync — this event is what makes a `ParticleFlow` + a `ParticleIcon`/`EnergyField` pair into a real transition rather than two unrelated animations that happen to be near each other.

### Public API
```
<ParticleFlow
  path={[originPoint, waypoint?, destinationPoint]}
  progress={scrollFraction}       // or omit for a self-driving continuous loop
  particleCount={24}
  carrying="signal"
  onArrive={() => triggerNextConstruction()}
/>
```

### Internal Architecture
- Owns a small scoped pool, same struct-of-arrays pattern as the rest
- Position along `path` computed via simple parametric interpolation (linear or quadratic-bezier through waypoints) driven by `progress`, not physics simulation — flows are choreographed, not simulated, which is cheaper and more predictable than letting flocking/attraction logic decide where a "signal" goes when it needs to land at a specific icon
- If `progress` is externally supplied (scroll-linked), the component is a pure function of that prop each frame — no internal rAF loop needed for scroll-driven flows, only for the self-driving continuous case (e.g., Growth System's always-flowing connections)

### Rendering Method
Canvas2D, scoped canvas sized to the bounding box of `path`'s extent (e.g., Process's full vertical stage list, or the width of one section-to-section transition zone) — not viewport-sized.

### Canvas2D vs WebGL Decision
**Canvas2D.** Same reasoning as the other two — low particle counts, and a parametric-interpolation-driven flow has no need for GPU-side physics. This is the cheapest of the four systems to run.

### Performance Budget
- ≤50 particles per flow instance, ≤1ms frame budget
- Multiple flows may run simultaneously (e.g., Growth System's several node-to-node connections) since each is individually cheap — the sitewide animation-count ceiling (Motion Bible §29, 3 Tier-1/2 items) governs total count, not this system's per-instance cost

### Mobile Scaling
`particleCount` reduced by roughly half on mobile tier (flows are already small, further reduction has diminishing visual cost) — the flow should still read clearly as directional motion at 10-15 particles.

### Accessibility
Decorative, `aria-hidden`. Reduced motion: skip the traveling animation, jump directly to firing `onArrive` so dependent components (icons waiting to construct) aren't blocked waiting for motion that will never play.

### Reuse Strategy
This is the system every future "real transition" (Motion Bible §18's top action item) is built from: outgoing scene's last visual element feeds a `ParticleFlow`, which fires `onArrive` on the incoming scene's first `ParticleIcon`/`EnergyField`. One shared primitive powers Hero→Problem, Problem→GrowthSystem, and Process's own internal stage-to-stage signal — no per-transition bespoke code.

---

## 04 · NetworkGlobe

### Purpose
Represents scale and infrastructure as a rotating, connected whole — the Earth/globe motif used at CTA and Footer today (currently static SVG + CSS rotation), generalized into a proper reusable system rather than two separate hand-tuned SVG components with duplicated `seededPoints` logic.

### Visual Language
Orbital, structured (Blueprint's `particle-earth`/`network` tokens). The one system on the page allowed to feel genuinely large-scale and climactic — this is the closest thing to Future-Proof Systems' missing "Digital Earth" spectacle, and should be built with enough range to cover both a subtle horizon-line decoration (current CTA/Footer use) and a full-viewport centerpiece (Future-Proof Systems' restoration target from the roadmap).

### Inputs
- `variant`: `"horizon" | "corner" | "centerpiece"` — the existing two variants plus a new third for a full-scene climax use
- `nodeCount`: how many connection points on the sphere's visible surface
- `rotationSpeed`: slow, in the Motion Bible's "camera" range — never fast enough to be consciously noticed as spinning (§14)
- `connectionDensity`: how many node-to-node arcs are drawn (visual complexity dial)
- `interactive`: whether nearest-node-to-cursor highlighting is enabled (only sensible for `centerpiece`, since `horizon`/`corner` are partially off-screen decoration)
- `glowIntensity`: ties into the sitewide glow budget (Motion Bible §17)

### Outputs
A rendered sphere-projection with connected nodes, rotating continuously at a near-imperceptible rate, with optional cursor-nearest-node response.

### Public API
```
<NetworkGlobe
  variant="horizon" | "corner" | "centerpiece"
  nodeCount={26}
  rotationSpeed="slow"
  interactive={false}
  glowIntensity="soft" | "signal"
/>
```

### Internal Architecture
- `horizon`/`corner` variants: stay exactly as cheap as today's implementation — static SVG geometry computed once (seeded pseudo-random node placement, same `seededPoints`-style approach, but centralized in one shared utility instead of duplicated per-variant), rotation via a single compositor-only CSS transform, zero JS per frame
- `centerpiece` variant (new, needed for Future-Proof Systems restoration): this is the one case in the whole engine where a lightweight Canvas2D or even a scoped Three.js sphere might be justified — see decision below — because it needs cursor interactivity and rotation-with-parallax that a pure CSS transform can't provide
- Regardless of variant, node/connection layout logic (sphere-to-2D projection, seeded placement) lives in one shared module — today it's copy-pasted between `horizon` and `corner` in a single file, which is fine at two variants but should be a real shared function before a third is added

### Rendering Method
- `horizon`/`corner`: SVG, static geometry + CSS animation only (current approach, keep as-is — it's correctly the cheapest option for a partially-offscreen decorative element)
- `centerpiece`: Canvas2D initially (draw projected nodes/arcs per frame, still cheap — a sphere's worth of nodes is a few dozen points, not a particle field)

### Canvas2D vs WebGL Decision
**Canvas2D for all three variants, including `centerpiece`, at least for the first implementation.** A "globe" here is a projection of a few dozen nodes onto an ellipse — this is well within Canvas2D's comfort zone and matches every other system in this document. WebGL/Three.js should only be considered later, and only if `centerpiece` needs true 3D depth (parallax-correct occlusion as it rotates) that a 2D projection can't fake convincingly — that's a real possibility worth flagging for Future-Proof Systems specifically, but it should be evaluated after a Canvas2D version ships and is judged insufficient, not assumed upfront. This keeps the project from repeating its one prior WebGL-adjacent risk (the original lag/hang) on a system that's supposed to be the site's climax.

### Performance Budget
- `horizon`/`corner`: effectively free (no JS per frame, already proven in production)
- `centerpiece`: ≤500 rendered points/arcs, ≤3ms frame budget — the most expensive of the four systems per-instance, which is appropriate since it's reserved for exactly one scene (Future-Proof Systems) and never runs two `centerpiece` instances simultaneously

### Mobile Scaling
- `nodeCount` and `connectionDensity` drop by roughly half on mobile/tablet tiers
- `centerpiece` variant on mobile may fall back to a static single-frame render (rotation disabled) if frame-budget testing shows it doesn't hold 60fps on mid-tier mobile — this must be verified with real measurement (per the standing performance-measurement gap) before shipping, not assumed safe

### Accessibility
Decorative, `aria-hidden`, with a text-equivalent heading/copy nearby (already the pattern — CTA/Footer both have real copy alongside the globe). Reduced motion: freeze rotation entirely, keep node/connection geometry static.

### Reuse Strategy
One shared `sphereProjection.ts` utility (seeded node placement + 3D-to-2D projection math) backs all three variants. CTA and Footer migrate to `variant="horizon"`/`"corner"` against the shared utility instead of each maintaining its own copy of `seededPoints`. Future-Proof Systems becomes the first and only consumer of `variant="centerpiece"`.

---

## 05 · Cross-System Rules

- All four systems are **section-scoped**, not viewport-global — this is the deliberate architectural correction from the original single-global-engine design that caused the lag/hang. Coordination between sections (like `EnergyFieldRegistry`'s Tier-1 slot) happens through small shared registries, not through routing everything into one shared simulation.
- All four read particle DNA concepts (position/velocity/life/glow/depth) from the same model already defined in `particleTypes.ts` — no system invents its own particle data shape.
- All four honor `PerformanceProvider`'s tier system and `usePrefersReducedMotion()` — no system implements its own device-detection or motion-preference logic.
- All four are Canvas2D-first. WebGL is not adopted anywhere in this design; the one place it's flagged as worth reconsidering (`NetworkGlobe`'s `centerpiece` variant) is explicitly deferred pending a Canvas2D attempt first.
- Every future section built after this architecture exists should be composed from these four (plus static SVG/CSS for genuinely non-particle decoration like `DustWave`) — a new bespoke canvas component for a new section is a sign this document needs to be extended, not a sign the section needs its own one-off system.

---

*Cross-references: emotional/brand judgment → `creative/CREATIVE_DIRECTION_BIBLE.md`. Concrete motion numbers/rules → `creative/MASTER_MOTION_BIBLE.md`. This document is the rendering-layer architecture beneath both — implementation of any of these four systems should be checked against all three documents before merging.*
