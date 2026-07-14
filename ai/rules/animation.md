# Animation Rules

1. Nothing fades, pops, slides, zooms, bounces, or spins randomly. Use construct, manufacture, flow, morph, merge/split, assemble/disassemble instead. (Experience Blueprint §02)
2. Every animated object needs believable mass, momentum, weight, friction, and inertia. Nothing teleports or suddenly appears. (Experience Blueprint §02)
3. Scene transitions never use opacity crossfades — one scene physically transforms into the next, preserving particle continuity. (Experience Blueprint §08)
4. Camera motion: only slow zoom, gentle orbit, perspective shifts, soft parallax, depth changes. Never shake, fast rotation, whip pan, extreme zoom, or random movement. It should be subtle enough to go unnoticed consciously. (Experience Blueprint §05)
5. Timing must come from the shared scale: micro 120–250ms, hover 250–400ms, section animations 800–1,400ms, major transformations 1,500–3,000ms. No ad hoc durations. (Experience Blueprint §07, Design System §10)
6. Icons always animate through the fixed sequence: Edges → Outline → Material → Glow → Final object, and dissolve back to particles on exit. (Experience Blueprint §23)
7. Typography never slides upward on entrance; use particle-build, light-sweep, mask-reveal, tracking-expand, or weight-change instead. (Experience Blueprint §22)
8. No spinners anywhere, including loading states — use particle assembly, skeletons, signal animation, or construction animation. (Experience Blueprint §24)
9. Section intensity must alternate per the Visual Rhythm Map (`08-animation-system.md`) — do not make every scene equally intense; the Future-Proof Systems climax depends on the Why-PYRAXIS rest beat before it. (Experience Blueprint §19; renamed from "Intelligence Core" — see `ai/memory/decisions.md` D-005.)
10. `prefers-reduced-motion`: replace morphing with opacity, reduce particle density, disable camera motion — but preserve the narrative beats. Never simply turn animation off entirely. (Design System §22, Technical Architecture §18)
11. The story test applies to every animation without exception: "Does this help tell the story of digital infrastructure?" If not, cut it, no matter how impressive it looks. (Experience Blueprint §02, Brand Bible §13)

## Related

`08-animation-system.md`, `09-particle-engine.md`, `ai/rules/performance.md`, `ai/rules/accessibility.md`

## Last Updated

Generated from source manuals, version 1.0.
