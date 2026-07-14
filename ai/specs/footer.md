# Footer

## Purpose
Closure. Per `manuals/05-experience-blueprint.md` §18: the experience ends peacefully. This is the last thing a visitor sees regardless of whether they acted on the CTA — it does not sell, recap, or ask for anything further. It exists so the page has a floor, not a cliff edge.

## Narrative
Before entering: visitor has just left CTA — either having acted (clicked WhatsApp/email) or having decided not to, with no guilt-trip per CTA's own spec. Either way, the story is finished.
After leaving: nothing — this is the last section on the page. There is no further scroll, no further scene to hand off to.

## Emotional Goal
Silence, Calm — **Very Low** intensity per the Visual Rhythm Map (§19), the lowest point on the page by design. This is intentional contrast against every scene before it, not an oversight — per §19, "never let every section compete."

## Non-Goals
Per the user's explicit instruction on this pass, this section is NOT:
- A second CTA, another button, or a repeated conversion prompt — that decision already happened.
- A cinematic sequence, scroll-triggered set piece, or particle spectacle of any kind — no network, no Earth, no converge/exit beat.
- A newsletter signup, social-proof strip, or feature recap.
- A place to reopen anything already resolved earlier in the page.

## Layout

### Desktop
Minimal, elegant, low-key. Per `manuals/05-experience-blueprint.md` §18, contents are exactly: **Logo · Navigation · Contact · Copyright** — nothing beyond this list. A single row or a simple two/three-column arrangement (logo+tagline on one side, nav links centered or right, contact/copyright below or alongside) — exact column arrangement is a build-time layout decision (see Open Questions), not a re-derivation of the whole design system.

### Tablet
Same content, same order, no complexity to reduce (per §20) — this section is already the simplest on the page, so tablet is not a materially different reduction pass the way Future-Proof Systems' is. Columns may stack earlier than desktop if width requires it.

### Mobile
Stacked vertical order: logo, then navigation (likely wrapped/two-line), then contact, then copyright. No horizontal scroll, no menu-behind-hamburger reinvention — this is a footer, not a second header.

### Height
`40vh` per `ai/knowledge/sections.json`'s `footer` entry and `manuals/05-experience-blueprint.md` §18.

### Spacing
Generous, breathing, uncrowded — matches the section's "exhale" purpose. Follows the existing spacing-token scale (`ai/rules/design.md` #8), no ad hoc values.

### Composition
Single simple block, no cards, no grid of items competing for attention. This is the one section on the page explicitly designed to *not* be a "scene" in the cinematic sense the others are.

## Visual Direction

### Colors
`styles/tokens/colors.ts` exclusively. Per §21 ("Footer: Near-dark. Only ambient remains.") this section sits at the darkest, lowest-contrast end of the page — text stays in the neutral `ink` palette at lower emphasis than any other section (e.g. `ink-400`/`ink-600`, not `ink-100`), reserving `purple` only for the smallest possible accent (e.g. a hover-state underline on a link), never a bright fill — per `ai/rules/design.md` #2's own reservation of purple for "signals, CTA, active states, and the Earth network," none of which apply here.

### Lighting
Near-dark per §21. No directional light source, no glow, no bloom — the opposite end of the lighting scale from Future-Proof Systems' peak.

### Depth
Flat. No layered-illusion particle objects (unlike every prior scene) — see Particle behavior below for the one exception (slow ambient drift, not a "scene").

### Composition
Quiet, symmetrical or simply-aligned block. No focal object competing with the CTA's Earth or any prior scene's spectacle.

### Forbidden visuals
No particle network, Earth-illusion ring, orbit rings, scroll-scrub rail, or any construct/converge beat. No testimonials, logos-of-clients, pricing, or urgency language (same forbidden list as CTA, for the same "inevitable, not aggressive" reasoning — closure should feel even quieter than conversion). Per the user's explicit direction on this pass: resist giving Footer "another cinematic sequence."

## Component Specification
Exactly the elements the brief and manuals specify, nothing else:
1. **Logo** — reuses the existing wordmark treatment already established in `components/navigation/Header.tsx` (gradient-text "PYRΛXIS"), not a new asset.
2. **Navigation** — reuses `Header.tsx`'s existing `LINKS` array (Services, The System, Portfolio, About, How It Works) for consistency ("one idea, one location," same discipline CTA's spec used for its own action links) rather than inventing a second nav taxonomy. **Known caveat, not to be silently fixed here:** several of `Header.tsx`'s own anchor hrefs (`#services`, `#system`, `#work`, `#about`, `#contact`) do not currently match any real section `id` in the codebase (existing ids: `hero`, `problem`, `growth-engines`, `why-pyraxis`, `portfolio`, `process`, `future-proof-systems`, `cta` — only `#process` genuinely matches, via a different label). This is a pre-existing Header bug, not introduced by Footer, and is out of this spec's scope to correct — flagged in Open Questions instead so a future session decides whether to fix Header's anchors or Footer's copy of them.
3. **Contact** — reuses the same two real, working channels already established project-wide (`components/hero/HeroButtons.tsx`, continued by `components/cta/CTA.tsx`): the WhatsApp deep link (`https://wa.me/919837104413`) and the Gmail compose deep link (`https://mail.google.com/mail/?view=cm&fs=1&to=thepyraxis@gmail.com`). No new contact channel invented, no on-page form.
4. **Copyright** — a single small line, e.g. "© [current year] PYRAXIS. All rights reserved." — exact year sourced at build/render time, not hardcoded to today's date.
5. **Nothing else** — no additional link columns, no sitemap, no social-media icon row unless a real, working social account is confirmed to exist (currently none is referenced anywhere else in the project; do not invent placeholder social links per `ai/rules/design.md`'s no-`#`-placeholder discipline).

## Animation

### Entry
Standard `data-reveal` stagger (opacity + small y-offset), same pattern as every prior scene, but at reduced amplitude/duration relative to earlier sections — this entry should read as settling, not arriving.

### Idle
Near-static. Per §18/§21, "almost no motion."

### Particle behavior
Per `manuals/03-design-system.md` §20 ("Footer: Dispersing calmly") and `manuals/05-experience-blueprint.md` §18 ("Slow drift. Almost no motion. The experience exhales. Never let the footer compete with anything"): a small number of ambient particles at very low density, slow drift only — no target-shape choreography (no ring, no network, no nodes-per-item), no `ParticleProvider` instruction with meaningful `phase`/converge logic. If implemented at all, this should be the single lowest-density particle instruction on the entire page, or omitted in favor of pure CSS if that reads as calmer — exact approach (shared engine vs. no particles at all) is an Open Question, not a foregone cinematic requirement, since the user's direction on this pass explicitly deprioritizes another particle sequence in favor of a clean, quiet footer.

### Reduced motion
Even less to reduce than other sections, since idle motion is already minimal — reduced-motion path simply removes the (already sparse) particle drift entirely, per `ai/rules/animation.md` #10 (reduce, never disable — links/content remain fully functional regardless).

### Scroll
No scroll-scrubbed content, no pin, no exit-transition contract to hand off to (this is the last section) — standard IntersectionObserver-driven entry only.

## Interaction
Only standard link hover/focus states (underline or subtle color shift on nav/contact links, matching Header's own existing hover treatment `group-hover:w-full` underline pattern) — no bespoke button choreography like CTA's. Full keyboard access and visible focus states on every link.

## Performance Rules
No magic numbers — any constants (particle density if used, stagger timing) centralized in `components/footer/motion.ts`, mirroring every other section's pattern. This should be among the cheapest sections on the page to render, by design — near-zero particle budget, no scroll-linked JS beyond the standard visibility observer.

## Accessibility
Semantic `<footer>` element. Nav links use a real `<nav aria-label="Footer">` (distinct label from Header's `"Primary"`). Full keyboard access and visible focus states on every interactive element. Any decorative particle canvas is `aria-hidden` and does not block or reflow real content if JS is disabled.

## Dependencies
`ParticleProvider` (only if the Open Question above resolves toward keeping minimal particles), `AnimationProvider` (`usePrefersReducedMotion`), `components/navigation/Header.tsx`'s `LINKS` array (reused, not duplicated — import or mirror exactly, per Open Questions), `components/hero/HeroButtons.tsx`'s real contact hrefs (reused, not re-typed).

## Open Questions (flag, don't guess)
- Exact column/row arrangement at desktop width (single row vs. logo-left/nav-right vs. stacked) — a build-time layout decision.
- Whether to import `Header.tsx`'s `LINKS` array directly or maintain a second literal copy in Footer — reuse is preferred per "one idea, one location," but the two components currently live in separate folders with no shared nav-data module; introducing one is a small architectural decision for build time, not this spec.
- Whether to fix Header's own mismatched anchor hrefs (`#services`/`#system`/`#work`/`#about`/`#contact` vs. real section ids) as part of this phase, or leave that as a separately-tracked known issue and have Footer simply inherit whatever Header currently does. Recommend the latter (out of Footer's scope) unless the user says otherwise.
- Whether to include any particle drift at all, or ship with zero particles and rely on quiet typography/spacing alone — both are consistent with "Very Low intensity" and "never compete with anything"; the manuals describe "slow drift" but do not mandate a specific implementation, and the user's direction this pass leans toward less spectacle, not more.
- Exact copyright line wording/legal entity name — using "PYRAXIS" per the wordmark; confirm if a full legal name is needed instead.

## Acceptance Criteria
- [ ] Full Section Completion Gate passes (`tsc --noEmit`, `next lint`, `next build` clean)
- [ ] Matches this spec and `ai/knowledge/sections.json`'s `footer` entry
- [ ] Contains exactly Logo, Navigation, Contact, Copyright — nothing else (no CTA repeat, no particle spectacle, no social icons unless a real account is confirmed)
- [ ] No `#` placeholder links — nav reuses Header's real hrefs as-is (see Open Questions re: the pre-existing mismatch), contact links are the real WhatsApp/email deep links
- [ ] Height = `40vh` per `ai/knowledge/sections.json`
- [ ] Intensity reads as Very Low — no bright purple fills, no bloom/glow, no competing focal object
- [ ] Full keyboard access and visible focus states on every link
- [ ] Reduced-motion path implemented (removes any particle drift entirely; content unaffected)
- [ ] No magic numbers — constants in `components/footer/motion.ts`
- [ ] `.placeholder.md` deleted once genuinely implemented
- [ ] Real-browser visual QA pass (this project's established substitute for automated Lighthouse/CLS, since Playwright is unavailable in this sandbox — see `ai/state.json` and `ai/checkpoints/phase13.md`/`phase14.md`)

## Status
**Locked.** Component code has not been written yet, per the project's established discipline (spec first, locked, then build — Phases 11-14). Next step: build Footer per this spec.

## Notes
- Source: `manuals/05-experience-blueprint.md` §18 (Scene 10 — Footer), §19 (Visual Rhythm Map), §21 (Lighting Behavior); `manuals/03-design-system.md` §20 (Signal Component — "Dispersing calmly"); `manuals/01-brand-bible.md` §11 (Emotional tone table — "Silence · Closure"); `manuals/04-technical-architecture.md` (Phase 15, `components/footer/` directory already scaffolded).
- This spec deliberately keeps the particle question open (see Open Questions) rather than mandating a scene-style implementation, per the user's explicit instruction this pass: "Resist the temptation to give it another cinematic sequence... A clean footer... will serve the experience better than another round of particles."
- Per the user's instruction, nothing else in the repo was touched while writing this spec — no code, no other docs, no state.json changes.
