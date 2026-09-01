# Spec: Lenis Smooth Scroll Integration

Status: LOCKED (implemented and verified this session — see ai/memory/decisions.md D-015)
Scope: Infrastructure only. Replace native scroll physics with Lenis. No section
redesign, no new content, no animation *content* changes — only the scroll driver
underneath existing GSAP ScrollTrigger work becomes Lenis-smoothed.

## Problem

Site currently uses native browser scroll. `ScrollProvider` reads `window.scrollY`
directly via a passive scroll listener. GSAP ScrollTrigger (`lib/gsap.ts`) reads
native scroll position for all scrub/pin work across sections (Portfolio rail,
Problem image sequence, Growth Engines, etc). Native scroll has no momentum/easing
control — feels abrupt relative to the site's motion language (`ai/rules/animation.md`
#2: "every animated object needs believable mass, momentum, weight, friction, inertia").

## Goals

1. Single Lenis instance mounted once at app root (architecture.md #4: global
   providers mount once, never localized).
2. `ScrollProvider`'s existing `ScrollState` (`y`, `progress`, `velocity`, `direction`)
   keeps its current public shape — consumers (`useScrollStore`) need zero changes.
   Internally, its values come from Lenis's `scroll`/`velocity`/`progress` instead of
   `window.scrollY`.
3. GSAP ScrollTrigger stays the source of truth for scrub/pin (architecture.md #2:
   never build animation systems outside the global GSAP system). Lenis's `scroll`
   event calls `ScrollTrigger.update()`, and Lenis's `raf` is driven by
   `gsap.ticker` (the standard Lenis+GSAP pairing) — one RAF loop, not two competing
   ones.
3a. `ScrollTrigger.defaults({ scroller: ... })` NOT needed — Lenis's default mode
    keeps the native document scrollbar/scroll position in sync, so ScrollTrigger's
    existing viewport-based triggers keep working unmodified.
4. `lenis.stop()` / `lenis.start()` exposed through context for any future modal/
   overlay work that needs to lock scroll (none currently exists — just don't block
   the door).
5. `prefers-reduced-motion` respected: Lenis instantiated with near-1 lerp / duration
   (effectively native-feeling) or not instantiated at all when the media query
   matches, per accessibility.md and animation.md #10.

## Non-goals

- No change to any section's animation content, timing, or ScrollTrigger trigger
  points — this is a driver swap beneath them, not a retune.
- No horizontal/pinned "scroll-jacking" beyond what already exists (Portfolio rail).
- No new dependency beyond `lenis` itself (no `@studio-freight/react-lenis` wrapper —
  plain `lenis` package, manual provider, to match this codebase's hand-rolled
  provider pattern instead of adopting a third library's React API).

## Where it lives

- New file: `providers/LenisProvider.tsx` — owns the Lenis instance + RAF wiring.
  Mounts in `providers/GlobalProviders.tsx` alongside the other six, **outermost**
  (before `ScrollProvider`), since `ScrollProvider` will read from it.
- `providers/ScrollProvider.tsx` — internal `flush()` swaps `window.scrollY` /
  scroll-event listening for Lenis's `scroll` callback payload. Public
  `ScrollState`/`useScrollStore` API unchanged (Goal 2).
- `lib/gsap.ts` — no export changes; the `gsap.ticker`-drives-`lenis.raf` wiring
  lives in `LenisProvider.tsx`, not here, to keep `lib/gsap.ts`'s single
  responsibility (plugin registration) per its existing doc-comment.

## Acceptance criteria (Section Completion Gate subset — architecture.md #7)

- [ ] `npm run build` — zero TS/lint errors
- [ ] All existing ScrollTrigger-driven sections (Hero, Problem, Portfolio,
      Growth Engines, Growth System) scrub/pin exactly as before — no retune
- [ ] Scroll feel: momentum/easing present, no jitter, no double-scroll lag
- [ ] `prefers-reduced-motion: reduce` → scroll behaves ~natively
- [ ] No new console errors; no layout shift introduced
- [ ] `useScrollStore()` call sites (grep before/after) require zero edits

## Related

`ai/rules/architecture.md` #2, #4, #8 · `ai/rules/animation.md` #2, #10 ·
`providers/ScrollProvider.tsx` · `lib/gsap.ts` · `ai/specs/architecture/responsive-layout-system.md`
(non-goals section already named Lenis as an anticipated future system)
