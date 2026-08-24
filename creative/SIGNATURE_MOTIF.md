# PYRAXIS Signature Motif — v1

## Origin
Not new. Already half-built in `components/growth-system/GrowthNode.tsx` +
`growth-node-travel` keyframe (globals.css). This spec formalizes that
into a grammar the whole site uses — instead of one section owning it and
everywhere else using generic particles/glow/cards.

## The four elements

| Element  | Meaning              | Visual form                                      |
|----------|----------------------|---------------------------------------------------|
| Shard    | A unit of information (a lead, a booking, a review, a data point) | Small solid mark, no glow, moves in straight or curved lines |
| Node     | A state the business is in (a stage, a channel, a status) | Fixed circle/point, border only, brightens when a shard arrives |
| Path     | Transformation between states | Thin line, shard travels along it, path itself never glows |
| Assembly | A working system — multiple nodes + paths visible at once | Only appears when explaining "the system," never as background decoration |

**Rule:** glow lives on the *node when active*, never on the shard, never
ambient. Path is a guide, not a glow trail. This is what stops it turning
into generic floating-particle soup.

## Where it appears — tested against 3 sections

**Growth System** (already has it) — canonical form. Full Assembly:
7 nodes in sequence, shard travels node → node on hover/focus. Keep as-is,
this is the reference implementation everything else should look like a
dialect of.

**Future-Proof Systems** — currently 5 cards + arrows (generic card chain).
Same underlying idea (cause → effect chain) as Growth System, so it
qualifies for the motif. Convert: pillars become Nodes in a single
horizontal Path, not five bordered rectangles. Card *content* (title +
description) sits below/beside each Node instead of inside a bordered box.
Removes the card-grid smell without inventing new decoration — it's the
same chain concept Growth System already proves works.

**Portfolio** — does NOT qualify. Projects aren't sequential states, they're
parallel case studies. Forcing shard/node here would be decorative, not
meaningful — exactly the trap called out ("don't make it ubiquitous").
Portfolio stays cards, but drop the ambient purple radial + generic
"Real systems. Real results." framing in the cleanup pass. This is a
**quiet section** by design: no motif, no purple accent beyond one CTA link.

## When the motif is absent (as important as when it's present)

Quiet sections — motif fully absent, no purple, no shards:
- Marquee (after `✦` removal — plain text, no decoration)
- Portfolio
- Founder Story (serif/italic carries the warmth here instead — per prior note)
- Footer

This gives the page a pulse: Hero (motif intro) → quiet → Growth System
(full Assembly) → quiet → Future-Proof (Path variant) → quiet → CTA
(single Node/shard as closing image, not full Assembly — a resolution,
not a repeat).

## Non-goals
- Not a particle system upgrade. HeroAmbientParticles / ProblemFloor /
  ambient canvas noise are separate and stay separate — they're
  atmosphere, not the identity system. Do not merge them with this.
- Not applied to typography, nav, or buttons in v1. Wait until it's proven
  in 2–3 sections before extending further (own stated risk: don't let it
  become the new ubiquitous layer).

## Purple map — final classification (audited against actual source, not just this doc)

**Loud (purple allowed, each earns it with real work, not decoration):**
- Hero — the one entrance moment
- Problem — real particle system + WebGL wave shader background (not a template)
- Growth System — canonical Signature System reference
- Process — real bespoke pinned scroll-stack sequence, genuine causal stages
- Future-Proof Systems — Signature System Node/Path chain
- CTA — real WebGL globe, closing moment

**Quiet (neutralized to ink/border, this pass):**
- Marquee — `✦` and purple removed, plain typographic ticker
- Portfolio — purple stripped from card/hover/glow, uses per-project `accent` instead
- Why PYRAXIS — plain icon row, no real centerpiece (its `GlobeCanvas.tsx` is dead
  code, never imported — don't be fooled by the filename into thinking this
  section has a globe; it doesn't)
- Growth Engines (Infrastructure Modules) — parallel module list, not causal,
  card border/glow/number/panel neutralized same as Portfolio
- Header / Footer / Legal — persistent chrome, link hovers neutralized. The
  one exception: nav's "Book a Call" button keeps purple — it's the single
  always-visible conversion action, functionally the same role as the
  Hero/CTA buttons, not a decorative repeat.

**Shared infrastructure (not a "section," don't audit as one):**
`signature-system/*`, `CustomCursor`, `LineIcons`, `ParticleEngine`.

**Confirmed dead code (unused, not rendered, left alone but flagged):**
`GrowthEngineIconCanvas.tsx`, `why-pyraxis/GlobeCanvas.tsx`.

## Rule (added after build)
If a visual element does not represent information, state, transformation,
or system assembly, it does not belong to the signature motif. It's
atmosphere (particles/glow/noise) or it's a plain UI element — not this.

## Status
- Primitives built: `components/signature-system/` — `SignatureNode`,
  `SignaturePath`, `SignatureShard`, `SignatureAssembly` (semantic API:
  `state="active"|"idle"`, not `purpleGlow`/`isShiny`).
- `GrowthNode.tsx` refactored to consume `SignatureNode`/`SignaturePath` —
  still the canonical reference, now backed by shared code instead of
  owning its own halo/border/travel markup.
- `FutureProofSystems.tsx` rebuilt as a labeled Node→Path chain
  (`futureProofPaths` in content.ts carries the transformation verbs:
  shapes → creates → earns → compounds into). `PillarCard.tsx` removed —
  card grid fully replaced, not layered on top of.
- Portfolio: was declared quiet in this doc but `Portfolio.tsx`/
  `ProjectCard.tsx` still hardcoded purple everywhere (ambient bg glow,
  hover border/shadow, index number tint, industry pill, cursor glow,
  arrow, case-study links). Fixed — all purple removed. Where a card
  still needs a signal (cursor glow, stat value, case-study link,
  preview-icon border) it now uses that project's own `project.accent`
  instead of brand purple, so cards read as distinct case studies, not
  purple-branded ones. Hover state is neutral (`border-ink-400`, soft
  black shadow, no purple ring). This is the actual enforcement of "quiet"
  — declaring a rule in this doc doesn't apply it to existing code, every
  future "quiet" section needs the same grep-for-purple check before
  being called done.

## Next
1. Build Node/Path/Shard as one shared component (extract from GrowthNode,
   generalize props: node count, active index, orientation).
2. Reskin Future-Proof Systems on top of it.
3. Only then do the marquee/glow-token/card cleanup — those fixes should
   land already knowing which sections keep purple (Hero, Growth System,
   Future-Proof, CTA) and which go fully quiet (Portfolio, Founder,
   Footer, Marquee).
