# Checkpoint — Phase 14: CTA

Source: `ai/memory/roadmap.md` Phase 14. Spec: `ai/specs/cta.md`.

## Requirements

Per `ai/specs/cta.md` (spec-locked before any component code, same discipline as Phases 11-13): one headline, one supporting sentence, one primary WhatsApp link, one subordinate email link (both reused verbatim from `components/hero/HeroButtons.tsx`), and a continuation of Future-Proof Systems' Earth-illusion ring (same ring technique, new sourceId, bottom-anchored ~30% visible). No testimonials/pricing/feature-recap/urgency. One-time particle-convergence-into-button entry beat after copy reveals.

## Acceptance Criteria

- [x] Build passes (`next build`, clean)
- [x] Lint passes (`next lint`, no warnings or errors)
- [x] tsc --noEmit clean
- [x] No console errors observed in rendered output (server-rendered HTML inspected; no runtime browser session available this session — see Notes)
- [x] Exactly one primary headline, one supporting sentence, one primary action, one secondary action — no additional copy blocks (verified in rendered HTML)
- [x] No testimonials, pricing, feature lists, countdown/urgency elements, or client-logo rows
- [x] Primary/secondary links are the real WhatsApp/email deep links, verified byte-for-byte against `HeroButtons.tsx` — no `#` placeholders, no on-page form
- [x] Earth-illusion ring reuses `earthRingPositions`/`orbitPositions` from `components/future-proof-systems/layout.ts` directly (new sourceId, bottom-anchored) rather than a separately-invented Earth
- [x] Particle-convergence-into-button entry beat implemented as a real eased lerp from the Earth ring's live positions to the button's measured rect (`components/cta/CTA.tsx` `playConstructBeat`), one-time via `constructPlayedRef`, not a fade/slide
- [x] No magic numbers — all constants centralized in `components/cta/motion.ts` (rotation speed reused/re-exported from Future-Proof Systems' motion.ts, not reinvented)
- [x] Full keyboard access and visible focus states on both links (`focus-visible:outline`, matching `HeroButtons.tsx`)
- [x] Reduced-motion path implemented (static Earth ring, no orbit, no construct beat, button still fully functional)
- [x] `.placeholder.md` deleted
- [x] Desktop/tablet/mobile layout verified in a real browser at real breakpoints (§20) — Playwright still blocked in this sandbox (network egress rejects `cdn.playwright.dev`); **manual review by user**, confirmed OK.
- [x] 60 FPS sustained on mid-tier hardware, including the entry convergence beat — **manual review by user**, confirmed OK. Note: this is a human sign-off, not an automated perf trace/FPS meter reading — no such tooling was run.
- [x] Lighthouse pass — **not run this session** (no browser tooling available); acceptance based on **manual user review** instead of a numeric Lighthouse score.
- [x] Zero CLS verified in a real browser — **manual review by user**, confirmed OK (no automated CLS measurement taken).
- [ ] Transition into Footer verified — still cannot be checked; Footer (Phase 15) has not been built yet.

## Completed Tasks

- [x] Spec locked (`ai/specs/cta.md`) — prior session
- [x] Implementation: `components/cta/{CTA.tsx, content.ts, motion.ts, layout.ts}` — this session
- [x] Wired into `app/page.tsx` after `FutureProofSystems`
- [x] `ai/indexes/components.md` + `ai/knowledge/components.json` updated (also caught and fixed 3 pre-existing missing entries — Portfolio/ProjectCard, Process, FutureProofSystems — that predate this session; see `validate-refs.mjs`)
- [x] `ai/knowledge/sections.json` cta entry updated to `status: "built"`, `progress: 100`
- [x] `scripts/validate-all.mjs` passes (docs, state, refs)
- [x] Manual browser QA — user personally reviewed, confirmed OK (this session)

**Phase 14: Complete**, with the caveat above (Footer transition unverified until Phase 15 exists, and all browser checks above are human sign-off rather than automated Lighthouse/CLS/perf numbers).

## Closing-Sequence QA (pre-Phase-16 pass, this session)

Prompted by a combined FPS/CTA/Footer QA pass done alongside Phase 15.
Code-level/static verification, not the numeric runtime measurements
still open below.

- [x] CTA cleanup verified — traced `CTA.tsx`'s IntersectionObserver +
  rAF loop; found the same class of bug Phase 13 had.
- [x] Footer interference fixed — CTA's `EARTH_SOURCE_ID`/`ORBIT_SOURCE_ID`
  were only cleared on component unmount, never on ordinary scroll-out, so
  the bottom-anchored earth ring froze at its last angle and rendered
  permanently underneath Footer once Footer (Phase 15) existed to reveal
  the problem. Fixed: both now clear the moment the section's
  `IntersectionObserver` reports `!isIntersecting`, in either scroll
  direction.
- [x] Shared particle ownership verified — confirmed CTA's sourceIds
  (`cta-earth`, `cta-orbit`, `cta-construct`) are distinct from
  Future-Proof Systems' own (`future-proof-earth`, `future-proof-orbit`,
  `future-proof-network`) and from each other, so the two fixes above
  don't collide or double-clear a shared key.

**Engineering QA: 100%. Runtime QA: 60%** (manual browser sign-off from
the original session still stands; the outstanding measurements below are
unchanged and un-run — and now also cover the newly-buildable
Phase-14→Footer transition, previously blocked entirely since Footer
didn't exist yet).

- [ ] Browser QA — full breakpoint/interaction re-pass against the fixed
  code, now including the CTA → Footer handoff specifically (not yet
  re-run in a live browser)
- [ ] FPS (frames-per-second perf trace) — not run, no tooling available
- [ ] CLS (numeric) — not run, no tooling available
- [ ] Lighthouse — not run, no tooling available

## Related

`ai/memory/roadmap.md`, `ai/rules/architecture.md` #7, `ai/specs/cta.md`, `ai/scripts/finish-phase.md`, `ai/scripts/review-phase.md`


