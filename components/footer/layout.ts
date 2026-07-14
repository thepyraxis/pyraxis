/**
 * Footer DOM-layout decisions (Phase 15, ai/specs/footer.md Open Questions:
 * "exact column/row arrangement... a build-time layout decision, not a
 * re-derivation of the whole design system").
 *
 * Unlike Portfolio/CTA/Future-Proof Systems' layout.ts files, this one
 * holds no particle-geometry math — the spec's particle Open Question
 * resolved toward zero particles here (see motion.ts's note), so the only
 * "layout" concern left is real DOM arrangement, centralized here instead
 * of as inline magic values in Footer.tsx.
 *
 * Resolved arrangement: a single centered stack (logo, then nav, then
 * contact, then copyright) at every breakpoint. Spec §Tablet explicitly
 * says this section has "no complexity to reduce" the way Future-Proof
 * Systems' does, and §Mobile specifies the same stacked vertical order —
 * so, unusually for this project, there is no desktop-row/mobile-stack
 * split to encode here. A single stacked arrangement satisfies Desktop,
 * Tablet, and Mobile all at once without a materially different layout
 * pass per breakpoint.
 */

/** Distinct from Header's own `aria-label="Primary"` (spec §Accessibility). */
export const FOOTER_NAV_ARIA_LABEL = "Footer";

/** Centered content column width — matches the narrower end of other sections' max-width scale (e.g. Process's 880px), since Footer's content list is short. */
export const FOOTER_CONTENT_MAX_WIDTH_PX = 640;
