/**
 * Scene — CTA (Phase 14, ai/specs/cta.md).
 *
 * Copy is deliberately minimal (spec §Scene Specification: one headline,
 * one supporting sentence, nothing else) — the story is already finished
 * by the time a visitor reaches this section (Future-Proof Systems), so
 * there is no pitch left to make here, only a door to point at.
 *
 * Contact actions (`ctaActions`) moved to lib/config/contact.ts — the
 * single shared source Hero/CTA/Footer all consume directly (Phase 1.2
 * consistency pass). Import `ctaActions` from "@/lib/config/contact",
 * not from here.
 */

export const ctaHeadline = {
  eyebrow: "The Next Step",
  heading: "Your systems are ready. Are you?",
  supporting: "One conversation is all it takes to start building.",
};
