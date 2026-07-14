# Checkpoint — Phase 09: Growth Engines

Source: `ai/memory/roadmap.md` Phase 09. Spec: `ai/specs/growth-engines.md`.

## Requirements

Six engine cards (Website, Lead, Booking, WhatsApp, Review, AI Assistant — see `ai/memory/decisions.md` D-014 for why six, not the original seven), one reusable card component, particle-built icons, horizontal row on desktop / vertical two-column stack on mobile, hover/focus redirects ambient particles toward the active card.

## Acceptance Criteria

- [x] Full Section Completion Gate passes: `tsc --noEmit`, `eslint`, `next build` all clean; responsive (`sm`/`lg` breakpoints verified in layout); 60fps target respected (no per-frame allocation, `IntersectionObserver`-paused off-screen canvases, shared density budget); mouse interaction (hover glow + particle focus redirect); scroll animation (headline `IntersectionObserver` reveal, icon particle assembly on entry); mobile layout (vertical stack below `md`); accessibility (`role="group"`, `aria-label`, focus-visible ring, reduced-motion path)
- [x] One reusable Engine/Growth-Engine card component used for all six engines, not six bespoke components (ai/rules/coding.md #5)
- [x] Matches `ai/specs/growth-engines.md` (six-engine deviation logged, D-014) and `ai/knowledge/sections.json` entry
- [x] Horizontal-scroll decision resolved and recorded per `ai/memory/known-issues.md` before this phase closes (D-014: vertical below `md`)

## Completed Tasks

- [x] `components/growth-engines/engines.ts` — six-engine data model
- [x] `components/growth-engines/icons.tsx` — six hand-drawn stroke icons
- [x] `components/growth-engines/GrowthEngineIconCanvas.tsx` — particle-assembly icon canvas
- [x] `components/growth-engines/layout.ts` — responsive normalized node positions
- [x] `components/growth-engines/GrowthEnginesHeadline.tsx` — scroll-triggered reveal
- [x] `components/growth-engines/GrowthEngineCard.tsx` — reusable card, hover glow, keyboard focus
- [x] `components/growth-engines/GrowthEngines.tsx` — section, wired to `ParticleProvider`/`AnimationProvider`
- [x] Wired into `app/page.tsx` after `GrowthSystem`
- [x] `tsc --noEmit`, `eslint`, `next build` all clean

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/growth-engines.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`
