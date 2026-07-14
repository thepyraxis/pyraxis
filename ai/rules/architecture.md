# Architecture Rules

1. The site is one continuous application, never a collection of independent pages. (Technical Architecture §01)
2. Never build isolated animations that don't route through the global particle/GSAP systems.
3. Never duplicate functionality that already exists in a provider, hook, or util — search `ai/indexes/files.md` and `ai/knowledge/components.json` first.
4. Global providers (`ThemeProvider`, `ParticleProvider`, `MouseProvider`, `ScrollProvider`, `PerformanceProvider`, `AnimationProvider`) mount once at the app root. Never recreate or localize what should be global. (Technical Architecture §05)
5. Project structure is fixed at the top level — every major section owns its own folder under `components/`; never dump unrelated files together. (Technical Architecture §03)
6. Build sequentially by phase (see `ai/memory/roadmap.md`). Never build multiple major sections simultaneously — this is how parallel/duplicate systems get created. (Technical Architecture §22)
7. A section is not "complete" until it passes the full Section Completion Gate: desktop/tablet/mobile layout, animations, mouse interactions, accessibility, responsive typography, performance (60fps), Lighthouse, no console errors, no unexpected layout shift, and transition into the next section. (Technical Architecture §23, extended per team review — see `ai/memory/decisions.md` D-013)
8. The five-year test governs every architectural decision: could a new section be added, or the logo removed, without touching the particle engine, scroll system, mouse system, animation system, or design system? (Technical Architecture §27)

## Related

`04-architecture.md`, `ai/rules/coding.md`

## Last Updated

Generated from source manuals, version 1.0.
