# PYRAXIS — Creative Direction Bible
**The single document every design decision must pass through.**

> Every future AI prompt starts with: *Read CREATIVE_DIRECTION_BIBLE.md before making any design decision.*

This is not a spec. Specs describe *what* to build. This describes *why it looks right when it's right* — the judgment layer above every spec, token, and component.

---

## 01 · The One Feeling

The visitor should not remember the particles, the GSAP, the Canvas2D Earth.

They should remember exactly one sentence:

> *"I've never seen a company present itself like this."*

If a decision doesn't serve that sentence, it's decoration. Cut it.

---

## 02 · Emotional Score (what every section must evoke)

The site is one story, not ten sections. Emotion moves like a score, not a checklist.

| Scene | Emotion | Intensity |
|---|---|---|
| Hero | Wonder · Confidence · Calm | Medium |
| Problem | Urgency · Recognition | High |
| Growth System | Understanding · Confidence | High |
| Growth Engines | Discovery · Capability | High |
| Why PYRAXIS | Calm · Human connection | **Low (rest)** |
| Portfolio | Trust · Capability | Medium |
| Process | Clarity | Medium |
| Intelligence Core | Wonder · Spectacle | **Very high (climax)** |
| CTA | Confidence · Decision | Medium |
| Footer | Silence · Closure | **Very low** |

Rule: intensity must alternate. If two adjacent sections are both "high," the second one can't land. The dip before Intelligence Core (Why PYRAXIS, low-intensity) is what makes the climax feel earned. Never sand that dip away because it "feels empty" — empty is the point.

---

## 03 · What Motion Must Communicate

Motion is not decoration. It's the sentence structure of the story. Every motion choice should read as one of these verbs:

- **Construct** — something is being engineered, not summoned
- **Travel** — signal moving with purpose, going somewhere specific
- **Transform** — one thing becoming another, matter conserved
- **Respond** — the system noticing you (cursor, hover, scroll)
- **Settle** — a moment of rest after effort

If a motion can't be named with one of these five verbs, it doesn't belong.

**Never:** fade, pop, slide-up, zoom, bounce, spin, teleport. These say "template." They say "this was assembled from a component library," not "this was engineered."

**Always:** things travel from somewhere to somewhere, at a believable speed, with mass and follow-through.

---

## 04 · What Particles Represent

Particles are not weather. They are not ambiance. Each particle is standing in for something real:

| Particle type | Represents |
|---|---|
| Ambient | The infrastructure breathing in the background — always present, never the point |
| Signal | A customer, a lead, a piece of data moving through the system |
| Construction | The act of building — an object earning its existence on screen |
| Network | Connection between parts of the business |
| Cursor-reactive | The system noticing the visitor is there |
| Earth | Scale — PYRAXIS as infrastructure, not a tool |

Ask before adding a particle effect: **what is this particle standing in for?** If the honest answer is "nothing, it looks cool," remove it.

**Material:** metallic shards, micro-polygons, crystal fragments, signal fragments — engineered matter.
**Never:** snow, dust, stars, confetti, fireflies, smoke — these read as nature or celebration, not infrastructure.

**Color discipline:** 95% white/silver/gray particles, 5% purple. Purple is a pointer, not a paint. The moment purple stops meaning "pay attention here," it has been overused.

---

## 05 · What Should Never Happen (hard lines)

These are not style notes. They are the difference between PYRAXIS and a template.

- Nothing **appears**. Everything **travels** into place.
- Nothing **disappears**. Everything **disassembles** or **transforms**.
- No opacity-only transitions between major sections — sections physically evolve into each other, particle continuity preserved.
- No camera shake, whip-pan, fast rotation, or extreme zoom. The camera is a patient observer, not a handheld phone.
- No glow on every element. Glow is a spotlight, used maybe 3-4 places on the whole page. If everything glows, nothing does.
- No random spin, no bounce-back easing, no cartoon physics.
- No fake stats, fake logos, fake testimonials. Trust is earned by craft on screen, never claimed in text.
- No section competes with the section before or after it for intensity. Every scene knows its emotional job and doesn't overreach it.
- No prohibited brand words in copy near visuals: innovative, cutting-edge, revolutionary, best-in-class, next-gen, seamless. If a visual is trying to compensate for weak copy, fix the copy.

---

## 06 · What "Too Much" Looks Like

Too much is not a particle count. It's a feeling: the visitor notices the *effect* instead of the *content*.

Signs you've crossed the line:
- You can't describe what the section is about without mentioning the animation first
- Two or more elements are glowing/pulsing/moving at once and pulling attention in different directions
- The particle simulation is doing something the story doesn't require ("it just looked cool in a demo")
- A scene's intensity matches or exceeds Intelligence Core, but it isn't Intelligence Core
- You added a hover effect because the component "felt bare," not because the interaction needed it
- Camera movement is noticeable rather than felt

**Test:** cover the copy. If the motion alone tells a story a stranger could roughly retell, it's on budget. If it's just movement, it's too much.

---

## 07 · What Makes Something Feel Expensive

- **Restraint.** The confidence to leave space empty. Whitespace is not unfinished — it's the loudest thing on the page when everything else is quiet.
- **Follow-through.** Motion that decelerates naturally into rest, never stopping dead.
- **Consistency of material.** One particle DNA, one lighting model, one motion vocabulary — expressed everywhere, never reinvented per section.
- **Things earning their appearance.** An icon that assembles from particles feels engineered. An icon that just fades in feels imported.
- **Silence.** Sections with almost no motion (Why PYRAXIS, Footer) make the sections with heavy motion mean something.
- **Precision over density.** Fewer, more deliberate particles that behave correctly beat more particles that behave randomly.
- **Typography that breaks intentionally** — one idea per line, large, unafraid of empty space around it.

---

## 08 · What Makes Something Feel Cheap

- Stock easing curves (`ease-in-out` defaults) instead of tuned deceleration
- Particle effects that don't interact with each other (each one animating independently, no shared physics)
- Glassmorphism used everywhere instead of as one surface type among four
- Hover states that only change color/scale with no depth, light, or particle response
- Anything that resembles a game HUD: neon glow, RGB, harsh bloom
- Motion that's technically smooth but has no *weight* — objects that move like they're massless
- Icons imported from a library instead of manufactured in the same visual language as everything else
- Copy trying to sound impressive to cover for a section with nothing visually happening

---

## 09 · Reference Standards

### Timing
| Interaction | Duration | Feel |
|---|---|---|
| Micro (buttons, links) | 120–250ms | Instant, responsive |
| Hover states | 250–400ms | Noticeable, not sluggish |
| Section entrances | 800–1,400ms | Cinematic, unhurried |
| Major transformations | 1,500–3,000ms | The visitor should feel time pass |

If it's faster than this table, it'll feel like a UI kit. If it's slower, it'll feel like it's stalling.

### Easing
- Default UI → standard ease, nothing exotic
- Entrances / attention → emphasized ease, slight overshoot in arrival only
- Objects arriving → decelerate hard at the end (this is what reads as "weight")
- Objects leaving → accelerate away (this is what reads as "departure," not "deletion")
- Particle physics → smooth, continuous, never linear

### Lighting
- Directional, cinematic, volumetric — like a product photography studio, not a stage show
- Never neon, never RGB, never harsh bloom
- Lighting should shift mood per scene (cooler/harsher in Problem, warmer in Growth System, maximum complexity only in Intelligence Core, near-dark in Footer)
- Highlights are earned by geometry (edges, rims), not painted on

### Spacing
- Generous, token-driven, never arbitrary (see Design System spacing scale)
- Section padding: 120–180px vertical minimum on desktop — cramped sections are the fastest way to feel cheap
- One idea per screen. If a section needs a subhead to explain itself, it has too much in it.

### Transitions
- Matter is conserved: particles from the outgoing scene become the material of the incoming scene
- No hard cuts, no opacity crossfades between major scenes
- The transition itself should communicate the *relationship* between the two scenes (e.g., signal paths becoming engine cards — the problem literally becomes the solution)

---

## 10 · The Final Filter

Before shipping any visual or motion decision, answer honestly:

1. Does this increase clarity?
2. Does this increase elegance?
3. Does this increase confidence?
4. Does this strengthen the story being told scene-to-scene?
5. Would a visitor remember this interaction tomorrow — for the right reason?

Any "no" → remove it, don't tune it.

---

*This document sits above `ai/specs/*.md`. Specs describe implementation. This describes judgment. When they conflict on a creative call, this document wins — then update the spec.*
