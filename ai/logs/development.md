# Development Log

Tracks live project state. Update after every completed task. See `ai/memory/current.md` for the canonical current-task pointer — this file is the working-notes companion to it.

## Current Milestone
Section-boundary particle handoff (D-016). Implemented and verified. See `ai/memory/current.md`.

## Latest Completed Work
`hooks/useSectionHandoff.ts` built — first real consumer of `providers/ParticleProvider.tsx`. Sends a small additive density-ramped instruction per section edge as it nears the viewport boundary, driven by Lenis-backed `useScrollStore()`. Wired into all 10 applicable sections (11 boundaries total; Marquee excluded). Every section's existing local canvas untouched. See `ai/memory/decisions.md` D-016.

## Active Task
None in progress. Next: real-browser verification of the handoff + Lenis scroll feel + responsive breakpoint sweep, all blocked on the same sandbox tooling gap. Separately open: resolve the Hero→Problem crossfade-vs-handoff conflict flagged in `ai/memory/known-issues.md`. See `ai/memory/next.md`.

## Blocking Issues
Same sandbox browser-tooling gap as before, now also covering handoff visual verification. New this session: `hooks/useEdgeFadeOpacity.ts` (pre-existing, Hero→Problem only) confirmed to violate `ai/rules/animation.md` #3 (opacity crossfade) — flagged, not fixed, left coexisting with the new handoff at that one boundary pending a separate decision. Particle-engine-ownership split (now partially addressed — the shared engine has its first consumer, but sections' primary systems remain on local canvases, unchanged) and unfilled `ai/specs/growth-system.md` remain open. `ai/memory/changelog.md` versioning drift (pre-existing, from the Lenis session) still unreconciled.

## Performance Notes
Handoff instructions use a small density share (0.04 peak, default) specifically to avoid competing with whichever section's own local canvas is dominant at a boundary. First Load JS moved 310kB → 319kB across the 10 wired sections + new hook (`next build` output).

## Technical Debt
Same as `ai/memory/known-issues.md` "Open" section, plus the flagged crossfade conflict and changelog-versioning drift noted above.
