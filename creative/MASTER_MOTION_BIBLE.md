# PYRAXIS — Master Motion Bible
**Permanent source of truth for motion, particles, camera, lighting, and performance.**

> Any future AI or developer building or touching an animation reads this file first. If a new animation can't be justified against this document, it doesn't ship. If this document and a component disagree, this document wins — then the component gets fixed, not the other way around.

Sits alongside `creative/CREATIVE_DIRECTION_BIBLE.md` (the *why*, emotional/brand judgment layer). This file is the *how* — concrete numbers, curves, budgets, and hard rules so two different sessions produce the same motion, not two different products.

---

## 01 · Motion Philosophy

Nothing appears. Everything transforms. Nothing disappears. Everything transforms into something else, or rests.

Every animated object has an implied physical origin and an implied physical destination. If you can't answer "where did this come from and where is it going," it shouldn't be animating.

Motion is a sentence, not a special effect. It has a subject (the object), a verb (what kind of change), and a reason (what it's telling the visitor). "The card slides in because slide-in is what cards do" is not a reason.

---

## 02 · Brand Personality Through Motion

PYRAXIS is: intelligent, precise, confident, quiet, sophisticated, intentional (Brand Bible §04). In motion terms:

- **Precise** → every animation ends exactly where it should, no overshoot bounce, no settle-jitter.
- **Confident** → motion doesn't rush to prove itself. It takes the time in §07's table and no less.
- **Quiet** → most of the page should be nearly still. Motion is rare enough that when it happens, it's noticed.
- **Intentional** → every animation traces back to a line in this document. "It looked nice in isolation" is not a justification.

If an animation would look at home in a mobile game or a marketing carousel, it's wrong for this brand regardless of how well-executed it is.

---

## 03 · Emotional Goals (motion's job per scene)

Motion's only measurable job is to move the visitor along the emotional score defined in the Creative Direction Bible §02. Concretely:

| Scene | Motion's job |
|---|---|
| Hero | Establish that this canvas is alive — prove the particle system exists before anything else does |
| Problem | Construct tension via assembly, not just static icons appearing |
| Growth System / Growth Engines | Show a system, not a list — motion should imply connection between nodes |
| Why PYRAXIS | Almost no motion. This is intentional silence, not an unfinished section |
| Portfolio | Motion proves craft (smooth scroll-scrub, real hover depth) |
| Process | One continuous traveling signal — the only place motion literally illustrates a journey |
| Future-Proof Systems | The climax. This is the one scene allowed genuine spectacle |
| CTA | Motion converges attention onto exactly one button |
| Footer | Motion nearly stops. The last impression is calm |

---

## 04 · Animation Hierarchy

Not every animation deserves the same investment. Four tiers:

1. **Tier 1 — Signature** (Hero particles, Future-Proof climax, CTA convergence): full physics, unique per-scene tuning, highest budget.
2. **Tier 2 — Structural** (section entrances, Process signal, Portfolio scroll-scrub): shared system (`useSectionReveal`), scene-specific parameters only.
3. **Tier 3 — Micro** (hover, focus, click feedback): fast, consistent, same curve sitewide.
4. **Tier 4 — Ambient** (DustWave, background gradients, idle drift): cheapest possible implementation, CSS/SVG only, never JS-driven per-frame unless free.

Rule: never spend Tier 1 budget on a Tier 3 job. A button hover does not need a particle system.

---

## 05 · Animation Vocabulary

Every animation must be describable with one of these verbs. If it needs a different verb, it's off-brand.

| Verb | Meaning | Use for |
|---|---|---|
| **Construct** | Object assembles from parts/particles | Icons, headlines, cards on first entrance |
| **Travel** | Something moves with a clear origin and destination | Signal dots, particle transitions, scroll-scrub |
| **Transform** | One shape/state becomes another, matter conserved | Section boundaries, icon state changes |
| **Respond** | Reacts to cursor/scroll/focus, returns to rest after | Hover, parallax, cursor gravity |
| **Settle** | Comes to rest after any of the above | The tail end of every animation, no exceptions |

**Banned verbs, permanently:** Fade (bare opacity with no construct), Pop, Slide (bare translate with no construct/travel framing), Zoom, Bounce, Spin (unless deliberately orbital and slow).

**Current violation on record:** the `data-reveal` pattern (`opacity:0, y:14 → opacity:1, y:0`) used in Process, Hero, WhyPyraxis, CTA, GrowthEngines, Problem is bare fade+slide. It must be replaced by `useSectionReveal()` (see §20) using a real construct (clip-path reveal, stagger-from-particle-origin, or mask-wipe) before any new section reuses it.

---

## 06 · Easing Curves

The Design System manual names easing *tokens* but ships no *values* and no file. This fixes that gap. Create `styles/tokens/easing.ts`:

```ts
export const easing = {
  standard:    "cubic-bezier(0.4, 0.0, 0.2, 1)",   // default UI motion
  emphasized:  "cubic-bezier(0.2, 0.0, 0.0, 1)",   // entrances, attention
  decelerate:  "cubic-bezier(0.05, 0.7, 0.1, 1)",  // objects arriving — hard stop, no overshoot
  accelerate:  "cubic-bezier(0.3, 0.0, 0.8, 0.15)",// objects leaving
  smooth:      "cubic-bezier(0.45, 0.0, 0.55, 1)", // particle physics, continuous motion
} as const;

// GSAP equivalents (named strings) for the same five roles — do not
// introduce a sixth GSAP ease anywhere without adding it here first.
export const gsapEasing = {
  standard: "power2.inOut",
  emphasized: "power3.out",
  decelerate: "power4.out",
  accelerate: "power2.in",
  smooth: "sine.inOut",
} as const;
```

**Hard rule:** no component may write a bare `"power3.out"` or any other literal ease string. Import from `gsapEasing`. Current violations: `Process.tsx`, `HeroText.tsx`, `WhyPyraxis.tsx`, `CTA.tsx`, `GrowthEnginesHeadline.tsx`, `ProblemHeadline.tsx` — all six hardcode the string directly and must be migrated.

---

## 07 · Timing System

`styles/tokens/motion.ts` already defines the correct scale — the rule that's missing is enforcement:

| Token | Range | Use |
|---|---|---|
| `micro` | 120–250ms | Button/link feedback |
| `hover` | 250–400ms | Hover state transitions |
| `section` | 800–1400ms | Section entrance animations |
| `transformation` | 1500–3000ms | Major scene-to-scene transformations |

**Hard rule:** every `gsap.to()` / `gsap.timeline()` duration must call `motionDuration('section')` etc., never a bare number. Current violations: every component listed in §06 also hardcodes `duration: 0.9` / `1.1` / `0.8` directly instead of calling the helper — same six files, same fix, do both migrations together.

---

## 08 · Hover Rules

Every hoverable element must define, at minimum: surface response (lift/border/glow) + cursor feedback. Cards additionally require depth + particle-or-light response per Design System §17.

**Standard card hover recipe** (apply to every card-shaped component):
1. Depth: `translateY(-4px to -8px)`, `250–400ms`, `decelerate` ease
2. Border/glow brightens
3. Optional: nearby ambient particles (if the scene has any) drift toward the card, return on leave
4. Leaving reverses all three simultaneously, same duration

**Current violation:** `GrowthEngineCard` has zero hover state — no lift, no glow change, nothing. Fix before any other hover polish, since it's a missing state, not a style disagreement. `ProblemIcons` cards also have no hover treatment despite sharing the card visual language.

---

## 09 · Click Rules

Click = small energy pulse (scale 0.97→1.02→1.0, or a radial glow burst from click point), duration in the `micro` range, `standard` ease. Never a bounce. Never a full-opacity flash.

**Currently unimplemented anywhere in the codebase** — buttons rely on `:active` browser default or nothing. This is a Tier 3 gap, cheap to fix, not yet built.

---

## 10 · Scroll Rules

- Section entrances trigger via `IntersectionObserver` at a **consistent threshold** (currently 0.2–0.3, inconsistent per component — standardize at `0.25` everywhere).
- Scroll-linked continuous motion (Process's signal dot, Portfolio's scroll-scrub) is the only place scroll position should drive animation progress directly (0-to-1 mapped), not just trigger a one-shot reveal.
- No section may pin scroll (`position: sticky`/ScrollTrigger pin) without a documented reason — currently none do, keep it that way unless a specific scene needs it.
- Scroll-triggered reveals fire once per section, never re-trigger on scroll-up/scroll-down toggle (avoid replaying entrance every time a visitor scrolls past a boundary twice).

---

## 11 · Particle Rules

One particle = one piece of meaning (Creative Direction Bible §04). A particle with no assigned meaning does not ship.

| Type | Meaning | Current status |
|---|---|---|
| Ambient | Background atmosphere | Hero only |
| Signal | Customer/data in motion | Process (as a dot, not true particles) |
| Construction | Object earning its appearance | Nowhere currently — `ProblemIconCanvas` built for this, unused |
| Network | Business connections | Nowhere currently — `GrowthSystem` explicitly opted out |
| Cursor-reactive | System noticing the visitor | Hero only |
| Earth | Scale/infrastructure | Nowhere currently — replaced by static `NetworkGlobe` |

**Material:** metallic shards, micro-polygons, crystal fragments. Never snow/dust/stars/confetti/fireflies/smoke.
**Color:** 95% white/silver/gray, 5% purple max, purple only as a pointer (signal, CTA, active state).

---

## 12 · Particle Density (device budgets)

| Device | Particle count |
|---|---|
| Desktop | 3,000–8,000 |
| Tablet | 1,200–2,500 |
| Mobile | 400–1,200 |

These numbers assume a **single shared engine**. Since the global `ParticleProvider` was removed from every scene but Hero (due to the lag/hang that prompted the removal), any restoration must re-verify these budgets hold with real FPS measurement before shipping to more than one scene at a time — do not re-enable sitewide in one pass.

---

## 13 · Particle Lifecycles

```
Birth → Travel → Assemble → Exist → Transform → Disassemble → Travel again
```

Particles never hard-delete mid-scene. They either travel off-screen naturally or transform into the next scene's construction material. A particle system that just stops (opacity snaps to 0) has failed this lifecycle — this is effectively what happened project-wide when the shared engine was pulled without a replacement lifecycle; any reintroduction must plan the *end* of a particle's life, not just its start.

---

## 14 · Camera Rules

Allowed: slow zoom, gentle orbit, soft parallax, subtle perspective/depth shift — all slow enough the visitor doesn't consciously register camera movement.
Prohibited: shake, fast rotation, whip-pan, extreme zoom, any movement that calls attention to itself as "camera."

**Current status:** no true camera system exists past Hero's 2D parallax layers. Any future camera work (e.g., for a restored Future-Proof climax) must stay within this table — Canvas2D pseudo-camera (scaling/offsetting a layer) counts as "camera" for these rules even without a literal 3D camera object.

---

## 15 · Parallax Rules

- Depth values (`useParallaxMouse(ref, { depth })`) should scale with actual visual layer depth, not be picked by feel. Hero currently uses `depth: 6` (noise) and `depth: 23` (particles) — roughly a 1:4 ratio between near-background and far-background layers; use this ratio as the starting point for any new parallax layer rather than guessing a new number.
- Parallax must never move foreground text/CTAs — reading content stays static regardless of cursor position.
- Cap parallax travel distance so no layer can scroll far enough to reveal a hard edge/seam (the `inset(-5%)` oversize wrapper pattern in `Hero.tsx` exists for exactly this reason — reuse it, don't reinvent).

---

## 16 · Lighting Philosophy

Lighting breathes; it doesn't flicker, and it isn't static either. Per the Experience Blueprint, lighting mood should shift per scene: cooler/harsher in Problem, warmer in Growth System, maximum complexity at the climax, near-dark at Footer.

**Current violation, sitewide:** every section uses the identical `bg-[#020205]` and an identical purple radial gradient at roughly the same position, differing only by opacity (0.12 → 0.09 → 0.07 → 0.06). This is the single cheapest fix in the whole audit — swap to a shared `--scene-glow-hue` / `--scene-glow-temp` CSS custom property that shifts per section (defined per-scene, not copy-pasted), no canvas or WebGL required.

---

## 17 · Glow Rules

Glow is a spotlight, not a filter. Reserved for: idle particles (soft), active components (medium), signals/CTA (strong), Hero/Earth/active engines (signal-strength).

**Hard rule:** no more than 2–3 simultaneously-glowing elements visible in any single viewport. If a scroll position shows four or more glowing things at once, dial back — audit found `GrowthEngineCard`'s glow is currently a one-off inline value rather than a shared token; migrate it into a `glow.ts` file (referenced by the Design System manual but never created) before adding any more per-component glow values.

---

## 18 · Section Transition Rules

No transition may be an empty spacer div. (`HeroToProblemTransition.tsx` currently is exactly this — fix before adding any new transitions elsewhere.)

Minimum bar for a real transition: the outgoing scene's dominant visual element visibly becomes material for the incoming scene — even a cheap CSS/SVG treatment (e.g., the last row of Problem's icons visually breaking into small fragments that scroll upward into Growth System's node row) beats an empty div. True particle-based matter-conservation is the long-term goal (§11–13); a lightweight interim version is acceptable and strictly better than nothing.

---

## 19 · Interaction Rules

- Cursor gravity radius: 120–240px (per Design System §06) — currently only implemented in Hero; do not extend sitewide without confirming perf budget per §21–26 below.
- Every interactive element needs a resting state that returns fully after interaction — nothing should be left in a "half hovered" visual state after mouse-leave.
- Focus states (`focus-visible:ring-2 ring-purple-400`, already used in `GrowthEngineCard`/`ProjectCard`) are the correct pattern — extend to every interactive element, no exceptions.

---

## 20 · Accessibility Rules

- Every animation must have a `prefers-reduced-motion` fallback: replace construct/travel with instant opacity swap, no camera motion, no parallax, no cursor-reactive particle movement.
- The `usePrefersReducedMotion()` pattern already used across the codebase (Footer, CTA, WhyPyraxis, etc.) is correct — apply it to any new Tier 1/2 animation before merging, not after.
- Keyboard-only visitors must be able to reach and activate everything a mouse user can — Portfolio's scroll-scrub rail specifically needs a verified keyboard path (flagged, not yet re-confirmed after later changes).

---

## 21 · Reduced Motion Rules

Reduced motion is not "turn off everything" — it's "tell the same story without motion." Concretely:
- Construct → instant fade-in only (the one place bare opacity is acceptable — reduced motion is the explicit exception to the §05 ban)
- Travel → element appears at destination directly, no path shown
- Camera/parallax → completely disabled, not just slowed
- Signal/particle systems → render one static frame representing final state, per `ai/rules/animation.md #10`'s existing precedent (already correctly implemented in Future-Proof/CTA per code comments)

---

## 22 · Mobile Motion Rules

- Particle density drops to the mobile tier (§12) automatically, never desktop density scaled down visually.
- No horizontal scroll where it would compromise usability (Growth Engines already resolved this correctly: vertical stack below `md`, horizontal at `md`+ — use this as the template for any future horizontal-scroll decision instead of re-litigating it, per Blueprint §20).
- Touch replaces hover: any hover-only interaction (card lift, glow) needs a touch-triggered equivalent (tap-to-reveal, or always-on subtle state) — currently unaudited across cards, should be checked alongside the hover-state fixes in §08.

---

## 23 · Desktop Motion Rules

- Full Tier 1/2/3 animation budget available.
- Cursor-reactive effects (parallax, magnetized buttons, cursor gravity) are desktop-only by default; do not attempt touch equivalents for cursor-gravity specifically — that one has no faithful touch analog and should just be absent on touch devices rather than faked.

---

## 24 · WebGL Guidelines

**Not currently used anywhere** (`three` is not in `package.json`). Any future WebGL introduction (most likely forcing function: a real 3D Earth/globe) must:
- Be scoped to exactly one section, lazy-loaded, never block first paint
- Ship with a Canvas2D or static fallback for low-end devices/reduced-motion
- Get a real FPS budget check before merging — this project has already hit one lag/hang incident from over-ambitious simultaneous animation (the original global particle engine); WebGL raises that risk further, not lower

---

## 25 · Canvas2D Guidelines

The project's actual working medium. Current good patterns to keep:
- One `<canvas>` per concern (Hero's ambient/logo canvases, `GrowthEngineIconCanvas`, `ProblemIconCanvas`) rather than one global canvas trying to do everything at once — this is *why* Hero still works while the global engine caused problems
- Pre-render expensive-per-frame work to an offscreen sprite once, `drawImage` per frame (already done for `HeroLogoCanvas`'s gradient per the Phase 16 audit) — apply this pattern to any new canvas work before it ships
- Cap active canvases visible in one viewport; prefer disposing/pausing rAF loops for canvases scrolled out of view (verify this is actually happening — not confirmed in this audit)

---

## 26 · Shader Guidelines

Not currently used anywhere in the codebase. If introduced (only plausible under a WebGL Earth per §24), shaders must be simple enough to run on integrated GPUs at 60fps at the mobile particle-density tier — no shader work should be desktop-exclusive without a hard device-capability check and fallback.

---

## 27 · Performance Budget

- Target: 60fps sustained during scroll, on mid-tier hardware, on every scene.
- The single largest performance incident on record: the global `ParticleProvider` running simultaneous instructions across six-plus sections caused a lag/hang, leading to its removal everywhere but Hero (confirmed via code comments in `CTA.tsx`, `Portfolio.tsx`). Any restoration effort must be incremental — one scene at a time, measured, not a single big-bang re-enable.
- No numeric Lighthouse/Core Web Vitals/FPS trace has ever actually been run against this project (confirmed in `state.json` — still true as of this audit). This blocks confident performance sign-off on everything above; treat every "should be 60fps" claim in this document as a target, not a verified fact, until that measurement pass happens.

---

## 28 · Maximum Particle Counts

See §12 for the full device table. Sitewide ceiling: **no more than one section running Tier-1 particle density (desktop 3,000–8,000) at a time.** If a future transition needs two adjacent sections' particles visible simultaneously (matter-conservation handoff), the combined instantaneous count still must not exceed the single-section desktop ceiling — taper one down as the other ramps up, don't add them together.

---

## 29 · Maximum Simultaneous Animations

- Per viewport: no more than 3 independently-timed Tier 1/2 animations running at once (this is the rule the removed global engine violated by running six-plus section instructions concurrently).
- Per component: a single element should not be the target of more than 2 concurrent tweens (e.g., a card animating position AND glow AND scale simultaneously via three separate timelines is a smell — consolidate into one timeline).

---

## 30 · GPU Budget

No formal GPU profiling has been done on this project (see §27). Interim rule until real profiling exists: treat any addition of a second simultaneous canvas-heavy section (beyond Hero) as requiring a manual before/after frame-time comparison on a mid-tier device before merging, not just a "looks smooth on my machine" check.

---

## 31 · CPU Budget

Same caveat as §30 — no measured budget exists yet. Interim rule: any per-frame JS logic (rAF loops, physics updates) outside Hero's existing canvases needs justification against Tier 1/2/3/4 in §04 before it ships; Tier 3/4 work (hover, ambient decoration) should never require a persistent rAF loop — CSS/GSAP timeline-driven only.

---

## 32 · Things Never Allowed

- Bare fade or bare slide as a section entrance (§05)
- Hardcoded ease strings or duration numbers outside the token files (§06–07)
- A card-shaped component shipping with no hover state (§08 — current violation: `GrowthEngineCard`)
- An empty spacer div standing in for a section transition (§18 — current violation: `HeroToProblemTransition`)
- More than one section running Tier-1 particle density simultaneously (§28)
- Camera shake, whip-pan, fast rotation, extreme zoom (§14)
- More than 2–3 simultaneously glowing elements in one viewport (§17)
- Imported/raster icon sets alongside the manufactured icon language (§11 of Creative Direction Bible — current violation: Problem section's PNG icons)
- Shipping a new animation without its `prefers-reduced-motion` fallback in the same change (§20–21)
- Re-enabling the global particle engine sitewide in a single pass without incremental FPS verification (§12, §27)

---

## 33 · Quality Checklist for Every Future Animation

Before merging any new animation, confirm all of the following:

- [ ] Named with one of the five allowed verbs (§05)
- [ ] Duration pulled from `motion.ts`, not hardcoded (§07)
- [ ] Easing pulled from `easing.ts`/`gsapEasing`, not hardcoded (§06)
- [ ] Tier correctly assigned, budget matches tier (§04)
- [ ] Has a `prefers-reduced-motion` fallback in the same change (§20–21)
- [ ] Has a mobile-appropriate variant if it's cursor- or hover-driven (§22–23)
- [ ] Doesn't push simultaneous glow count past 2–3 in any single viewport (§17)
- [ ] Doesn't push simultaneous animation count past 3 Tier 1/2 items at once (§29)
- [ ] If it's a particle effect: has an assigned meaning per §11's table, uses only approved material/color (§11)
- [ ] If it's Tier 1: has been frame-timed on a mid-tier device, not just "looks smooth" on the dev machine (§27, §30)
- [ ] Matches the emotional job of its scene per §03, not borrowed wholesale from another scene's animation

If any box is unchecked, it doesn't ship yet.

---

*Cross-references: brand/emotional judgment → `creative/CREATIVE_DIRECTION_BIBLE.md`. Component-level visual tokens → `manuals/03-design-system.md`. Per-scene narrative detail → `manuals/05-experience-blueprint.md`. This file resolves conflicts between the two when a concrete number or hard rule is needed and the manuals only describe intent.*
