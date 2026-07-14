# 09 · Particle Engine

## Purpose

Explain why the particle system is singular and global, and what it is conceptually for (it's not decoration — it's the visual embodiment of "the Signal," see `03-website.md`).

## Responsibilities

Governs `components/particles/`, `components/three/`, and the global `ParticleProvider`.

## Core Principles

**One canvas. One simulation. One renderer.** Different behaviors per section are achieved by sections sending *instructions* (target shape, behavior mode, transition type, density) to the engine — sections never own or instantiate their own particle systems. (Technical Architecture §06)

**Particle Manager responsibilities:** creation/pooling, lifetime/recycling, velocity/attraction/repulsion, morph targets, mouse interaction, scroll interaction, color/glow/depth, performance (LOD, instancing). (Technical Architecture §06)

**Shape morphing is one engine.** Every object can become another through the same system:
```
Logo → Signal → Icon → Typography → Card → Network → Earth → Logo
```
Never build a separate animation system per shape. (Technical Architecture §07)

**Particle DNA** (the full data model per particle): Position, Velocity, Acceleration, Mass, Rotation, Angular Velocity, Life, Glow, Depth, Temperature, Noise, Target, State, Energy. (Experience Blueprint §03)

**Particle types and purpose:**

| Type | Purpose |
|---|---|
| Ambient | Background atmosphere |
| Signal | Represents customers/data |
| Construction | Builds objects in scene |
| Network | Creates connections |
| Cursor | Responds to mouse |
| Hero | Detached logo fragments |
| Energy | Powers transitions |
| Earth | Builds globe surface |
| Glow | Lighting support |

**Material identity — OVERRIDDEN this session (explicit user direction).** Original spec: metallic shards, micro polygons, tiny triangles, crystal/signal fragments, never snow/dust/stars/confetti/fireflies/smoke (Experience Blueprint §03). As of this session, `components/three/ParticleEngine.tsx`'s draw call was deliberately changed from a rotated-triangle shard to circular dust particles (round arc, twinkle-modulated alpha via per-particle `noiseSeed`, soft white core) to match `HeroBackgroundParticles.tsx`'s look/behavior — user found the shard rendering read as "tiny square dots" and asked to override the spec rather than just fix the shard's rendering. This is a conscious brand-language change, not a bug fix: the "manufactured infrastructure" vs "generic particle effect" distinction the original rule was protecting no longer applies to this engine. If this is ever revisited, the shard-drawing code (rotated triangle path) is preserved in git history / prior session context, not deleted from the concept — only the live render was swapped.

**Lifecycle — particles never die, they change purpose:**
```
Birth → Travel → Assemble → Exist → Transform → Disassemble → Travel again
```

**Behavior state machine:**
```
Idle → Searching → Travelling → Connecting → Building → Living → Breaking → Returning
```
(Experience Blueprint §04)

**Physics.** Every particle carries mass/weight/momentum, drag/friction/inertia, and attraction/repulsion to neighbors, so the swarm reads as organic rather than random. (Experience Blueprint §04)

**Density budgets (performance-driven, adjusts dynamically, performance always wins):**

| Device | Count |
|---|---|
| Desktop | 3,000–8,000 |
| Tablet | 1,200–2,500 |
| Mobile | 400–1,200 |

(Experience Blueprint §04, Design System §23)

## Dependencies

- `04-architecture.md` for the provider/manager pattern
- `08-animation-system.md` for how motion built from particles should look and feel

## Related Files

- `ai/rules/performance.md`
- `ai/knowledge/animations.json`

## Future Expansion

Engine must support new scenes without modification — sections only ever send new instruction sets, never new engines (Technical Architecture §27).

## Last Updated

Generated from source manuals, version 1.0.
