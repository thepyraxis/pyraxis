# CTA

## Purpose
Conversion. Per manuals/05-experience-blueprint.md §17: the final beat of the entire narrative — Problem, Growth System, Growth Engines, Why PYRAXIS, Portfolio, Process, Future-Proof Systems all lead here. This section answers exactly one question the visitor now has: "what's the next step?" It does not reopen anything already resolved earlier in the page.

## Narrative
Before entering: visitor has just watched Future-Proof Systems' network converge into an Earth shape (Blueprint §16 "Leaving") — the spectacle is still fresh, the feeling is wonder tipping into readiness.
After leaving (i.e., after acting): visitor has taken one clear, low-friction next step — starting a real conversation — or has scrolled on to Footer having decided not to, with no guilt-trip, no second pitch, no reopened objection.

## Emotional Goal
Confidence, Decision — **Medium** intensity per the Visual Rhythm Map (§19), a deliberate step down from Future-Proof Systems' Very-High climax. The feeling should be inevitable, not aggressive (§17) — this section persuades by clarity and continuity, not by volume.

## Non-Goals
Per the user's explicit brief, this section is NOT:
- A testimonials or social-proof section (that's already been earned by Portfolio).
- A pricing or package-tier breakdown.
- A feature list or capability recap (that's Growth Engines/Future-Proof Systems' job, already done).
- A second sales pitch — the story is finished; this is the door, not another chapter.
- A form/lead-capture widget with fields — the "action" is a direct link (see Scene Specification), not an on-page form.

## Technical Constraint
Same engine reality as Future-Proof Systems (ai/specs/future-proof-systems.md): the rising Earth and orbiting particles are a Canvas2D cinematic 2D approximation on the shared `ParticleEngine.tsx` — a ring of particle targets positioned mostly below the viewport bottom edge so only its top ~30% reads as visible, not a real 3D globe/mesh/depth buffer. This section directly continues the Earth-illusion object Future-Proof Systems' exit beat builds (same ring geometry technique, `earthRingPositions`-equivalent math), not a separately-invented Earth.

## Layout

### Desktop
Centered, minimal composition. Massive Earth-illusion ring anchored to the bottom edge of the viewport, ~30% of its height visible above the fold (§17). Copy (eyebrow optional, headline, one supporting sentence) sits above the Earth, vertically centered in the remaining space. One primary button below the copy; one secondary contact link beside or below it, visually subordinate (smaller, lower-contrast — see Visual Direction).

### Tablet
Same composition — headline, supporting sentence, primary + secondary action, Earth rising from bottom. Reduced particle density and simplified rotation/orbit complexity per §20, same device-tier pattern as every other scene.

### Mobile
Same vertical order. Earth ring's visible arc may need a smaller radius so it doesn't crowd the buttons on short viewports — exact value is a build-time layout decision (see Open Questions), not a re-designed mobile-only layout (§20: "never simply shrink the desktop layout," but this section's shape is already vertical/centered at every breakpoint, so there's no shape change to make, only scale).

### Height
`100vh` per `ai/knowledge/sections.json`'s `cta` entry.

### Spacing
Generous vertical breathing room around the button — per §17 "the most premium interaction on the page," it must not feel crowded by adjacent copy or the secondary link. Follows the existing spacing-token scale (`ai/rules/design.md` #8), no ad hoc values; exact steps are a build-time decision.

### Composition
Symmetrical, centered, single focal column — no multi-column layout, no cards, matching this section's "one clear decision" purpose. The Earth-illusion ring is the only large-scale visual object besides text and the two actions.

### Scroll behavior
Entry: Earth-illusion ring is already forming as Future-Proof Systems' exit beat runs (continuity, not reset — see Animation → Particle behavior). Copy and buttons reveal calmly as the section enters viewport (data-reveal stagger pattern, matching every prior scene). No pin, no horizontal scroll, no scroll-scrubbed content — the section's own content doesn't need scroll-linked reveal beyond the standard entry stagger, since there's no rail/track/stage progression here.

## Visual Direction

### Colors
`styles/tokens/colors.ts` exclusively. This is the one section (besides Future-Proof Systems) where purple carries real visual weight — the primary button (`purple-vivid`/`purple-700` gradient, matching `HeroButtons.tsx`'s existing pattern) and the Earth/orbit particles (`particleType: "signal"`) are the two places it's allowed to read as prominent, per `ai/rules/design.md` #2's own carve-out ("reserved for signals, CTA, active states, and the Earth network"). Secondary contact link stays in the neutral `ink`/`border` palette — visually subordinate, never competing with the primary action.

### Lighting
Per §21, lighting here is calmer than Future-Proof Systems' "maximum complexity" — the Earth is still the brightest single object, but the overall scene lights down from the climax into something closer to Hero's directional, focused restraint. No competing light sources besides the Earth ring and the button's own glow on hover.

### Depth
Layered-illusion only, same as Future-Proof Systems (Technical Constraint) — the Earth reads as sitting "in front of" the copy through opacity/scale/vertical-position layering, not a real z-axis camera.

### Composition
Earth anchored bottom-center, rising just enough to feel present without obscuring the buttons above it. Copy block and actions form a single vertical stack above the Earth's visible arc.

### Motion language
Calm and continuous at idle (particles orbit continuously, §17) — contrast against Future-Proof Systems' busier, most-interactive motion is the point (Visual Rhythm Map §19: the step down from Very-High to Medium is itself part of the story, giving the decision room to breathe). The one exception is the button's own hover sequence, which is allowed to be the single richest micro-interaction on the page (§17: "the most premium interaction... make it feel earned").

### Forbidden visuals
No testimonials, quote cards, star ratings, or logos-of-clients rows. No pricing tables or tiers. No feature-recap grid/icon list. No countdown timers, urgency banners, or scarcity language ("limited spots," etc.) — inconsistent with "inevitable, not aggressive" (§17). No second headline that re-explains what PYRAXIS does — that conversation is already finished.

## Scene Specification
Exactly the elements the brief specifies, nothing else:
1. **One primary headline** — short, decision-oriented, not a recap of the pitch (e.g., framing the moment itself, not re-selling the product).
2. **One concise supporting sentence** — a single line, no bullet list, no paragraph.
3. **One primary action** — a real, working link, not a `#` placeholder or on-page form. Reuses the project's actual established contact channel: the WhatsApp deep link already live in `components/hero/HeroButtons.tsx` (`https://wa.me/919837104413`) — this is the same "one idea, one location" discipline that avoided inventing a new logo asset or a new package manager elsewhere in this project; the real booking channel already exists once, this section reuses it rather than inventing a second one.
4. **One secondary contact option (optional per brief; included here since a working, already-established channel exists)** — the existing Gmail compose deep link (`https://mail.google.com/mail/?view=cm&fs=1&to=thepyraxis@gmail.com`), visually subordinate per Visual Direction.
5. **A final particle convergence into the button** — resolves the brief's explicit requirement: rather than the primary button fading or sliding into place, a stream of `signal`-type particles breaks off from the Earth/orbit field and travels to the button's on-screen position as it enters, particle-constructing it (`ai/rules/animation.md` #1: construct, never fade/pop). This is a real, named, one-time entry beat — not idle/continuous — narratively reading as "the infrastructure becomes the door you walk through."
6. **Minimal distractions** — no other visual elements besides the Earth ring, copy, and the two actions.

## Animation

### Entry
1. Earth-illusion ring is already rising (continued from Future-Proof Systems' converge beat — see Particle behavior).
2. Copy (eyebrow/headline/supporting sentence) reveals via the standard `data-reveal` stagger pattern used by every prior scene (opacity + small y-offset, never a slide-up per `ai/rules/animation.md` #7 for the headline specifically — light-sweep or mask-reveal, matching Typography Animation §22).
3. The particle-convergence-into-button beat (Scene Specification #5) plays once, after the copy has revealed, ending with the button in its resting hover-ready state.

### Idle
Earth ring "rotates" slowly (same angular-offset-cycling technique as Future-Proof Systems' `EARTH_ROTATION_SPEED`, reused not reinvented) and orbit particles trace their paths continuously (§17: "particles orbit continuously"). Button sits at rest, no idle animation on the button itself beyond ambient particles occasionally passing near it.

### Scroll
No scroll-scrubbed content specific to this section (see Layout → Scroll behavior). Standard IntersectionObserver-driven visible/exiting phase toggle, same pattern as every prior scene.

### Hover
Per §17, the button's hover sequence is the richest micro-interaction on the page — exact choreography (glow intensification, subtle scale, particle attraction toward the cursor's hover, label treatment) is a build-time design decision within the existing motion-timing scale (`styles/tokens/motion.ts` `hover: 250–400ms`), not invented in full here; the requirement is that it must feel deliberately more elevated than every other button on the page (Hero's, etc.), since this is the only "moment of decision."

### Exit
Calm — no equivalent "accelerating handoff" beat is required here, since CTA is not hard-transitioning its visual identity into Footer the way Future-Proof Systems hands into CTA. Footer's own spec (§18: "Slow drift. Almost no motion. The experience exhales.") describes a section that generically de-intensifies rather than one requiring a specific object-continuity contract — flag this as an Open Question rather than assert a matching contract that Footer's own (still-UNKNOWN) spec hasn't confirmed.

### Particle behavior
Continues the same Earth-illusion ring Future-Proof Systems' exit beat builds — this section takes over ownership of that visual object (new `sourceId`, same ring-geometry technique, position shifted to bottom-anchored/~30%-visible rather than centered) rather than constructing an unrelated new Earth from scratch, per `ai/rules/animation.md` #3 ("scene transitions... preserving particle continuity"). Density: lower than Future-Proof Systems' peak (Medium intensity, not Very-High) — exact value TBD at build time (see Open Questions), same "pick a real number, don't leave a placeholder" discipline as Process/Future-Proof Systems.

### Cursor interaction
Per §17: cursor gently disturbs nearby particles, they return naturally after — reuses the same mouse-repulsion physics already shared globally via `MouseProvider`/`stepParticle`, not a bespoke mechanism for this section.

## Interaction

### Mouse
Gentle particle disturbance near cursor (see Animation → Cursor interaction). Primary/secondary links get standard hover states; primary button's hover sequence is this page's premium moment (see Animation → Hover).

### Keyboard
Both links are real anchor elements (`<a href>`), natively focusable and activatable — no custom keyboard handling required. Visible focus rings on both, matching every other interactive element project-wide (`focus-visible:outline`, per `HeroButtons.tsx`'s existing pattern).

### Touch
Both actions work as standard tap targets — no hover-dependent functionality gates access to either (consistent with every prior scene's "hover never gates functionality" rule, e.g. Portfolio).

### Reduced motion
Per `ai/rules/animation.md` #10: Earth ring renders static (no rotation), orbit particles reduce to a low, mostly-still density, the particle-convergence-into-button entry beat is replaced with a simple opacity transition for the button (motion removed, narrative beat — "the button appears as the section's clear focal point" — preserved). Cursor-disturbance physics can remain (it's already a subtle, non-narrative effect) or be dropped; build-time call, not a spec-locked requirement either way.

## Performance Rules
- 60 FPS sustained, including during the one-time particle-convergence-into-button entry beat.
- Zero CLS — button/link positions reserved before particle animation starts; the entry beat animates particles arriving at a fixed, pre-reserved button location, never the button's own layout shifting into place.
- GPU-friendly transforms only (`transform`/`opacity`) for any DOM-level animation (button glow/scale on hover); particle motion itself stays inside the shared canvas's own `requestAnimationFrame` loop, per the existing engine architecture.
- No React state updates per animation frame — Earth rotation/orbit-cycling drives the external instruction store directly (same rAF-writes-to-store pattern established in Future-Proof Systems), not `useState`.
- No magic numbers — all constants (density, rotation speed, convergence-beat duration/ease, hover-sequence timing) centralized in `components/cta/motion.ts`, reusing `styles/tokens/motion.ts` scale steps where applicable.

## Accessibility
- Heading hierarchy: section `h2` for the headline, no skipped levels, matching every prior scene.
- Full keyboard access to both links; visible focus states on both.
- Canvas remains `aria-hidden="true"` (decorative), same as every scene using the shared engine.
- Button label describes the real action in plain terms ("Book via WhatsApp," matching `HeroButtons.tsx`'s existing established copy) — not vague ("Get Started," "Learn More").
- Full `prefers-reduced-motion` path per Animation → Reduced motion above; the two real actions remain fully usable regardless of motion state.

## Dependencies
`future-proof-systems` (previous scene, per `ai/knowledge/sections.json` `dependencies: ["future-proof-systems"]`) — this section's Earth-illusion ring is a direct continuation of that scene's exit beat, not an independent visual; see Technical Constraint and Animation → Particle behavior. Reuses `ParticleProvider`/`MouseProvider`/`AnimationProvider` directly, same integration pattern every scene has used since Phase 08. Reuses the real contact links already established in `components/hero/HeroButtons.tsx` rather than inventing new ones (see Scene Specification #3–4).

## Open Questions (flag, don't guess)
- Exact particle density value for the Earth/orbit rings at this section's Medium intensity — UNKNOWN, pick a real number at build time, below Future-Proof Systems' peak.
- Exact Earth-ring radius/vertical-anchor on mobile so it doesn't crowd the buttons on short viewports — UNKNOWN, build-time layout decision (see Layout → Mobile).
- Exact hover-sequence choreography for the primary button ("the most premium interaction on the page") — §17 doesn't specify the literal steps; UNKNOWN beyond "must feel more elevated than any other button on the page," build-time design decision within the existing motion scale.
- Whether the secondary contact link is genuinely optional (brief said "optional") or should ship by default since a real, working channel already exists — resolved provisionally in favor of including it (Scene Specification #4), flagged here in case that reads as scope creep against the brief's "optional" wording.
- Whether CTA needs its own explicit exit-continuity contract into Footer, or whether Footer's generic "exhale" description is sufficient without one — UNKNOWN until Footer's own spec (`ai/specs/footer.md`) is filled in; do not invent a matching contract Footer's spec hasn't confirmed.

## Acceptance Criteria
✓ Build passes
✓ Lint passes
✓ No console errors or warnings
✓ Exactly one primary headline, one supporting sentence, one primary action, and (if included) one secondary action — no additional copy blocks
✓ No testimonials, pricing, feature lists, countdown/urgency elements, or client-logo rows anywhere in the section
✓ Primary and secondary links are real, working URLs (WhatsApp/email deep links) — no `#` placeholders, no on-page form
✓ Earth-illusion ring is a continuation of Future-Proof Systems' exit beat (same ring technique, shifted anchor), not a separately-built Earth
✓ Particle-convergence-into-button entry beat verified as a real, one-time construct animation, not a fade/slide
✓ Mobile layout complete (Earth ring doesn't crowd the two actions on short viewports)
✓ Tablet and desktop verified at correct scale and particle density per §20
✓ 60 FPS sustained, including during the entry convergence beat, on mid-tier hardware
✓ Zero layout shift (CLS = 0)
✓ Full keyboard access and visible focus states on both links
✓ Reduced-motion path verified (static Earth, no convergence beat, button still fully usable)
✓ No magic numbers — all constants centralized in `components/cta/motion.ts`
✓ `.placeholder.md` deleted (feature is genuinely implemented)
✓ Production ready

## Status
Not started. Spec written per user brief (session), before any component code — same spec-first discipline as Phases 11–13.

## Notes
- This spec deliberately reuses the real, already-shipped contact links from `components/hero/HeroButtons.tsx` rather than inventing new copy/destinations for the "primary action"/"secondary contact option" — consistent with this project's repeated "don't invent, reuse what's real" discipline (logo asset, package manager, particle engine capabilities).
- The Earth-illusion continuity requirement (this section continuing, not resetting, Future-Proof Systems' converged Earth) is treated as a hard cross-spec contract, matching how Future-Proof Systems' own spec already commits to it in its Transition-into-CTA section.
- Footer's own exit/entry contract relative to CTA is left as an Open Question rather than guessed, since `ai/specs/footer.md` is still UNKNOWN/unfilled (see `ai/memory/known-issues.md`).
