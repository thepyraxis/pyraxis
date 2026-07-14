/**
 * Footer local animation constants (Phase 15, ai/specs/footer.md
 * Performance Rules: "no magic numbers... constants centralized in
 * components/footer/motion.ts").
 *
 * Particle Open Question, resolved: this file intentionally defines no
 * particle source id, density, or ParticleProvider instruction. Spec
 * §Particle behavior/Open Questions explicitly leaves "ship with zero
 * particles" as equally valid to a minimal-drift instruction, and notes
 * the user's direction this pass "leans toward less spectacle, not more."
 * Given Footer must be the single lowest-intensity, cheapest-to-render
 * section on the page (spec §Performance Rules: "near-zero particle
 * budget"), zero is the more honest reading of "near-zero" than adding a
 * new ambient instruction — so Footer does not call useParticles() at all.
 *
 * Entry stagger: same data-reveal mechanism every prior scene uses, but at
 * reduced amplitude/duration (spec §Animation → Entry: "should read as
 * settling, not arriving"). Duration sits at the low end of
 * styles/tokens/motion.ts's `section` scale (800-1400ms); the y-offset is
 * roughly half of other sections' typical 14px.
 */

export const ENTRY_Y_OFFSET_PX = 8;
export const ENTRY_DURATION_S = 0.8;
export const ENTRY_STAGGER_S = 0.08;
export const ENTRY_EASE = "power2.out";

/** IntersectionObserver threshold for the entry reveal — this is the last section, so no early-enter margin is needed (spec §Animation → Scroll: "standard IntersectionObserver-driven entry only"). */
export const ENTRY_THRESHOLD = 0.2;
