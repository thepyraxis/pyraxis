# Spec: Responsive Layout System

Status: LOCKED (approved before implementation, per CLAUDE.md spec-first discipline)
Scope: Architecture refactor only. NOT a redesign. No component renames, no section
reorder, no content change, no animation/interaction removal. Only the layout
substrate beneath existing design becomes fluid.

## Problem

Current system uses fixed-px values scattered through components: fixed
max-w-[Npx] containers, fixed font sizes, fixed gap/margin/padding, fixed
card/image widths, fixed h-[Npx] sections, some GSAP x-distances in raw px.
Breaks/looks unintentional between the tested breakpoints (esp. 480-900px band).

## Goals

1. One container system (semantic token, not repeated max-w arbitrary values).
2. One fluid typography scale (clamp-based, tokens not inline clamp per component).
3. One fluid spacing scale (clamp-based tokens).
4. Grid/flex primitives that reflow (auto-fit/minmax, flex-col -> lg:flex-row) instead
   of fixed multi-column layouts.
5. GSAP distances converted from raw px to viewport-relative (%, innerWidth-derived,
   or ScrollTrigger's own relative units) where currently hardcoded.
6. Zero horizontal overflow 320px-2560px.
7. Desktop (1440-1920) visually unchanged within ~1-2%.

## Non-goals

- Redesign of any section, component, color, brand, or animation *content*.
- Changing GSAP/Lenis/particle *systems* themselves (only their distance inputs
  where hardcoded in px).
- Renaming exported components/props (breaks downstream imports/specs).

## Token architecture (new files under styles/tokens/)

- `styles/tokens/typography.ts` — clamp() scale: display, h1, h2, h3, body, small.
  Mirrors existing `motion.ts` pattern (const object + type + helper fn).
- `styles/tokens/spacing.ts` — clamp() scale: section-y, gap-sm/md/lg, inset.
- `styles/tokens/layout.ts` — container max-width, responsive padding-x scale,
  breakpoint constants (xs 480 / sm 390 — already changed in tailwind.config.ts /
  md 768 / lg 1024 / xl 1280 / 2xl 1536 / 3xl 1920).

Components consume semantic tokens only. No arbitrary inline clamp() in a
component unless the exact value genuinely has no token yet — and if that
happens, the missing token gets added to the relevant tokens file in the same
change, not left as a one-off.

Tailwind config extends `theme.extend` with these tokens (fontSize, spacing,
maxWidth keys) so both token-object consumers (JS/GSAP) and className
consumers (JSX) read the same source of truth.

## Breakpoints (authoritative)

```
xs: 480px
sm: 390px   (already live in tailwind.config.ts, per D-0xx decision — components
             using old 640px sm: assumption get reviewed during their own pass)
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
3xl: 1920px
```

## Implementation order

1. Spec review — this file. DONE.
2. Create semantic token architecture (typography.ts, spacing.ts, layout.ts).
3. Update `manuals/` design doc to document the implemented architecture (after
   tokens exist, not before).
4. Refactor layout infrastructure: container component/util, grid primitives,
   breakpoint usage audit.
5. Refactor sections one-by-one, dependency order:
   Header/Nav -> Hero -> Problem -> GrowthSystem -> GrowthEngines -> WhyPyraxis
   -> Portfolio -> FounderStory -> Process -> FutureProofSystems -> CTA -> Footer.
   Each section: swap fixed values for tokens, verify visually against reference
   screenshot at 320/375/390/414/768/820/1024/1280/1440/1728/1920/2560, then next.
6. Full regression pass: `npm run build` (0 TS/lint errors), horizontal-overflow
   check across all widths, GSAP/ScrollTrigger sanity check per section.

## Definition of Done

- No horizontal scroll 320px-2560px.
- No overlap/clipping at any tested width.
- No breakpoint hacks outside the token/breakpoint system above.
- Components reference semantic tokens, not arbitrary hardcoded values.
- Desktop appearance unchanged within ~1-2% visually.
- Tablet band (768-1024) intentionally composed, not a scaled-down desktop or
  stretched mobile.
- Mobile is first-class layout, not compressed desktop.
- All animations/interactions intact and performant.
- Zero new TypeScript or ESLint errors (`npm run build` clean).
- No public API changes: no component renamed, no export removed, no prop
  signature broken.

## Open questions

- None blocking. `growth-system.md` spec gap (pre-existing, unrelated to this
  refactor) not addressed here — out of scope.
