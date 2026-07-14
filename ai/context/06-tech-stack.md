# 06 · Tech Stack

## Purpose

Record the chosen technologies and why, so substitutions aren't made casually.

## Responsibilities

Governs all dependency choices across the repository.

## Core Principles / Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server-first rendering for SEO + Core Web Vitals |
| Language | TypeScript, strict mode | No `any`, no implicit types |
| Styling | Tailwind CSS | Token-driven, no inline styles |
| Animation | GSAP + ScrollTrigger | Section timelines, scroll choreography |
| Micro-interactions | Framer Motion | Only where GSAP is insufficient |
| Smooth scroll | Lenis | |
| 3D | Three.js + React Three Fiber + Drei | Only where required — site is not built "around" WebGL |
| State (local/shared) | React Context | |
| State (complex/global) | Zustand | Only if interaction complexity demands it |
| Package manager | pnpm | |

(Technical Architecture §02)

**Why not more tools than this.** Every additional library is a maintenance and performance cost against the 60fps / Lighthouse 90+ targets in `ai/rules/performance.md`. Three.js in particular is explicitly scoped to: Hero object, Signal core, energy sphere, infrastructure network, Earth construction, background depth — not general UI. (Technical Architecture §11)

**Explicitly rejected:** jQuery, Bootstrap, CDN imports, generic template stacks (Technical Architecture §25 — Negative Prompt).

## Dependencies

None — this is a leaf reference file.

## Related Files

- `04-architecture.md`
- `ai/knowledge/dependencies.json`
- `ai/indexes/dependencies.md`

## Future Expansion

UNKNOWN — no versions pinned yet in a real `package.json` at generation time.

## Last Updated

Generated from source manuals, version 1.0.
