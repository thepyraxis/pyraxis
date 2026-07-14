# 04 · Architecture

## Purpose

Explain why the codebase is structured as one continuous application rather than a page collection, and why certain systems (particles, scroll, mouse) are centralized.

## Responsibilities

Governs `app/`, `components/`, `hooks/`, `providers/`, `lib/`, `styles/tokens/`, `types/`, `public/`, `scripts/`. Root `utils/` also exists as a scaffolded placeholder alongside `lib/utils/`; this duplication is unresolved — see `ai/memory/known-issues.md` and decision D-006 in `ai/memory/decisions.md`. Resolve before writing any utility code.

## Core Principles

**One living system.** The site is not a collection of pages; every component behaves as part of one system. Never build isolated animations, never duplicate functionality. Architecture must support future expansion without major rewrites, and remain understandable to a developer five years from now. (Technical Architecture §01)

**Why centralized managers exist (Particle, Scroll, Mouse):** sections must never own their own particle systems, scroll logic, or cursor tracking — that produces N inconsistent implementations. Instead one global engine receives *instructions* (target shape, behavior mode, transition type, density) from sections and performs the work autonomously. This is the single biggest architectural decision in the project. (Technical Architecture §06, §08, §09)

**Why Server/Client split matters.** Server Components render all static content by default; Client Components are reserved for animation, interaction, canvas, and tracking. This is an SEO and performance decision (see `06-tech-stack.md`, Lighthouse targets) as much as a code-organization one. (Technical Architecture §12)

**Why state defaults to the simplest option.** Decision tree: local → `useState`; shared among a few components → React Context; complex/global → Zustand. Global state is never introduced for convenience. (Technical Architecture §13)

**Why phases are sequential.** Building multiple major sections simultaneously breaks the "one system" property — a section built in isolation tends to reinvent particle/scroll/mouse logic. See the 17-phase build order in `ai/memory/roadmap.md`. (Technical Architecture §22)

**The five-year test.** If a future developer removes the logo, the remaining experience should still feel unmistakably PYRAXIS. If a future developer adds a new section, they should not need to touch the particle engine, scroll system, mouse system, animation system, or design system. (Technical Architecture §27)

## Dependencies

- `06-tech-stack.md` for concrete technology choices
- `09-particle-engine.md` for the particle engine's internal contract
- `ai/rules/architecture.md`, `ai/rules/coding.md`, `ai/rules/performance.md`

## Related Files

- `ai/knowledge/architecture.json`
- `ai/knowledge/components.json`
- `ai/indexes/files.md`

## Future Expansion

New sections/scenes must integrate with existing global providers rather than create parallel systems (Technical Architecture §24, Negative Prompt §25).

## Last Updated

Generated from source manuals, version 1.0. Updated in documentation consistency pass v1.1 — see ai/memory/changelog.md.
