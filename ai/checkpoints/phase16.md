# Checkpoint — Phase 16: Performance Optimization

Source: `ai/memory/roadmap.md` Phase 16. No single spec file — cross-cutting infrastructure pass against `ai/rules/performance.md`, not one scene.

## Requirements

Audit-and-fix pass against `ai/rules/performance.md`'s 10 numbered rules across the whole shipped site (Phases 01-15), plus the font-loading item already flagged here before this session began.

## Audit Results

1. **Particle density caps** — `styles/tokens/particles.ts`'s `densityBudget` (desktop 3000-8000 / tablet 1200-2500 / mobile 400-1200) matches the rule table exactly. Compliant, no change.
2. **No allocations inside animation loops** — spot-checked FPS/CTA/Portfolio's per-frame code; position arrays are recomputed each frame by design (rotation/scroll-driven), consistent with the pattern already accepted across Phases 11-14. No new issue found.
3. **Object pooling / InstancedMesh** — N/A this pass; particle engine is still Canvas2D (`ParticlePool`), not Three.js — pre-existing, tracked in `ai/memory/known-issues.md`, out of this pass's scope to migrate.
4. **LOD** — N/A, same reason as #3.
5. **Dynamic-import Three.js** — N/A; `three` still isn't in `package.json` at all.
6. **Throttle expensive per-frame calculations** — mouse tracking goes through `MouseProvider`'s external store (no React state per move); not independently re-verified in depth this pass.
7. **Pause calculations for offscreen/invisible sections** — audited every particle-emitting section's `IntersectionObserver` handling site-wide. 🔴 Two real violations found and fixed in the prior QA pass (see `ai/checkpoints/phase13.md`/`phase14.md`): Future-Proof Systems' earth-ring and CTA's earth-ring/orbit both kept rendering forever after scrolling past, since neither transitioned to `"exiting"` phase / cleared on scroll-out. Re-checked this pass against every other particle-using section (GrowthSystem, GrowthEngines, WhyPyraxis, Portfolio, Process) — all already correct (`phase: isIntersecting ? "living" : "exiting"` set directly from the observer callback). The bug was isolated to the two components using a continuous rAF loop instead of that pattern, not systemic.
8. **Max blur 24px system-wide** — 🔴 Found and fixed: `CTA.tsx`'s button hover-bloom used Tailwind's default `blur-2xl` (40px), over the cap. Changed to `blur-[24px]`. No actual `max-blur` token exists in `styles/tokens/` despite being referenced in the rules doc — a pre-existing doc/code gap, flagged not silently invented into a new token system.
9. **Mobile independently designed, not scaled-down** — not re-audited component-by-component this pass; no new evidence either way. Real-browser mobile QA is the only way to confirm this properly.
10. **Image formats/lazy-loading** — `public/` has only `favicon.svg`/`logo.svg` (SVG, correct) and `noise.webp`/`og-image.webp` (WebP, correct). No `<img>`/`next/image` usage anywhere in `app/`/`components/`; the only raster consumer is `HeroLogoCanvas.tsx` loading `logo.svg` into canvas for Hero's priority-loaded construction effect — exempt from lazy-loading by the rule's own carve-out. Compliant.
11. **Font-loading item (this checkpoint's own pre-existing flag)** — 🔴 Fixed: removed the external Google Fonts `<link>`/preconnects for Syne from `app/layout.tsx`. It existed solely as a fallback so the wordmark's "Λ" (U+039B) glyph — outside the self-hosted Latin-only Syne subset — would render pixel-exact instead of falling back. Removing it drops a render-blocking third-party request; `tailwind.config.ts`'s font stack already has a bare `"Syne"` name (now unreachable for nearly everyone) then generic `sans-serif` as the next fallback, so the one glyph now renders in system sans-serif instead of exact Syne — a cosmetic-only tradeoff on one decorative character, not a missing/broken character.

## Acceptance Criteria

- [x] `tsc --noEmit`, `next lint`, `next build` all clean after every fix above
- [x] Rule #7 (pause/teardown for offscreen sections) audited site-wide, not just the two components already caught in the FPS/CTA/Footer pass
- [x] Rule #8 (max blur) audited site-wide, one violation found and fixed
- [x] Rules #1, #3-5, #10 confirmed compliant or correctly N/A
- [x] Font audit item: external Google Fonts `<link>` for Syne removed, degradation path confirmed safe (existing fallback stack already covers it)
- [ ] Rules #6, #9 — spot-checked only, not exhaustively re-verified
- [ ] Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+ — **not run**, no browser tooling available in this sandbox
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1 — **not measured**, same reason (font-loading change should reduce LCP/render-blocking risk, but this is reasoned, not measured)
- [ ] 60 FPS desktop, 45-60 FPS mobile sustained — **not measured**, same reason

**Engineering QA: ~90% (rules #6/#9 unverified in depth). Runtime QA: 0%** — the numeric Lighthouse/Core-Web-Vitals/FPS measurements this phase exists to produce cannot be captured at all in this sandbox (no Playwright/browser access, same standing limitation as every prior phase, not a new gap). **Phase 16 is not being marked Complete in `ai/memory/roadmap.md`** pending that measurement pass, per `ai/scripts/finish-phase.md`.

## Completed Tasks

- [x] Site-wide rule-by-rule audit against `ai/rules/performance.md`
- [x] Fixed: FPS/CTA particle-teardown bugs (already fixed in prior session, re-verified here as part of rule #7)
- [x] Fixed: CTA hover-bloom blur reduced from 40px to the 24px cap
- [x] Fixed: removed external Syne Google Fonts request, kept the glyph fallback safe
- [x] Full gate re-run clean after every change

## Related

`ai/memory/roadmap.md`, `ai/rules/performance.md`, `ai/checkpoints/phase13.md`, `ai/checkpoints/phase14.md`, `ai/memory/known-issues.md`, `ai/scripts/finish-phase.md`

