# Roadmap

Source: Technical Architecture §22 — Build Phases. Build sequentially; perfect one phase before continuing; never build multiple major sections simultaneously.

| Phase | Work | Status |
|---|---|---|
| 01 | Foundation + project structure | Complete |
| 02 | Design System + tokens | Complete |
| 03 | Global Providers | Complete |
| 04 | Global Particle Engine | Complete* |
| 05 | Hero | Complete* |
| 06 | Hero → Problem transition | Complete |
| 07 | Problem | Complete* |
| 08 | Growth System | Complete* |
| 09 | Growth Engines | Complete* |
| 10 | Why PYRAXIS | Built |
| 11 | Portfolio | Built* |
| 12 | Process | Built |
| 13 | Future-Proof Systems | Complete* |
| 14 | CTA | Complete* |
| 15 | Footer | Implementation Complete, Runtime QA Pending |
| 16 | Performance optimization | In Progress — engineering audit done, runtime measurement pending |
| 17 | Final polish + QA | Not started |

\* Phase 04 shipped as Canvas2D, not Three.js/WebGL — migrating Hero/Problem's own per-component canvases into it is still open. Phase 05/07 built directly, skipping Phases 01–04 and 06 at the time — now backfilled by this pass. Phase 08 built from `manuals/05-experience-blueprint.md` §11 directly since `ai/specs/growth-system.md` is still unfilled. Phase 09 built with six engines rather than the seven in `ai/specs/growth-engines.md`/`ai/knowledge/sections.json` — see `ai/memory/decisions.md` D-014. Phase 11 shipped clean (build/lint) but runtime QA (user screenshots) caught two real bugs afterward — card glow clipped (overflow-x/overflow-y CSS interaction) and last card's scroll distance short (padding fix broke the scrub-distance math) — both fixed same session, see `ai/state.json` completed entry. Phase 13/14 marked Complete on the strength of the user's own manual browser review (desktop/tablet/mobile, smoothness, no CLS/jank) — no automated Lighthouse/CLS/FPS-trace numbers were captured, since Playwright is not usable in this sandbox (network egress blocks `cdn.playwright.dev`). See `ai/memory/known-issues.md` and `ai/memory/decisions.md` D-012, D-014.

## Long-term (post-launch) roadmap

Per Product Bible §11 and §10, product/infrastructure direction beyond the website launch:

- Retention, Review, Referral engine activation (Scale stage)
- Intelligence Layer (cross-engine data synthesis)
- AI-native client dashboards
- Predictive signal routing
- Cross-business intelligence networks
- SaaS products built on the same engine architecture

Principle governing all future roadmap items: **infrastructure expands, identity stays constant** — no future capability should require a rebrand or a rewrite of the particle/scroll/mouse/animation/design systems (Product Bible §11, Technical Architecture §27).

## Related

`ai/memory/progress.md`, `ai/rules/architecture.md`, `ai/specs/` — one spec per section named on the roadmap.

## Last Updated

Generated from source manuals, version 1.0. Updated in documentation consistency pass v1.1 — see ai/memory/changelog.md.
