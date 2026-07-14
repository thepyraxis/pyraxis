# 05 · Design System

## Purpose

Explain why PYRAXIS uses a token-only design system rather than a conventional component library, and why that matters for brand durability.

## Responsibilities

Governs `styles/tokens/` and all visual decisions consumed by `components/`.

## Core Principles

**Not a component library — a visual language.** Every component must feel engineered rather than decorated: one material language, one motion language, one particle DNA expressed across every surface. (Design System §01)

**Single source of truth.** All visual decisions live in token files. Changing a token changes the system everywhere it's used. Components never hardcode color, spacing, radius, or timing values — they only reference tokens. (Design System §01, §26)

**Why purple is restricted to 5%.** Purple (`brand-primary` family) guides attention; if it dominated, it would compete with itself. 95% of particles stay white/silver/gray, 5% purple, reserved for signals, CTA, active states, and the Earth network. (Design System §02)

**Why only four surface types exist** (Flat, Glass, Metal, Signal) and four material types (`material-flat/glass/metal/signal`): constraining the palette of "what a surface can be" is what keeps the system from decaying into one-off components over time. (Design System §07, §13)

**The identity test.** If someone cropped a single button, card, or nav bar out of the site in isolation, it should still feel unmistakably PYRAXIS. This is the practical acceptance criterion for "is the design system working." (Design System §26)

**Full token catalogue, naming rules, and values** live in `ai/knowledge/architecture.json` (machine-readable) and are not duplicated here — see Design System manual sections §02–§23 for the canonical human-readable version, or the folder structure at `styles/tokens/` (Design System §24).

## Dependencies

- `02-philosophy.md` ("Less. But better.")
- `07-brand.md` for color/voice rationale
- `08-animation-system.md` for motion token usage

## Related Files

- `ai/rules/design.md` — enforceable rules extracted from this system
- `ai/indexes/components.md`

## Future Expansion

Personality of the entire site should be changeable by editing token files alone, without touching component code (Design System §26).

## Last Updated

Generated from source manuals, version 1.0.
