# Accessibility Rules

1. `prefers-reduced-motion` support is mandatory: replace morphing with opacity, reduce particle density, disable camera motion. Preserve the story beats — never just disable animation wholesale. (Technical Architecture §18, Design System §22)
2. Full keyboard navigation throughout the site. (Technical Architecture §18)
3. Focus states must be visible and consistent — use `focus-ring` / `focus-shadow` tokens. (Design System §22)
4. ARIA labels required on all interactive elements. (Technical Architecture §18)
5. Semantic HTML structure and semantic heading hierarchy (also an SEO requirement, see `10-deployment.md`). (Technical Architecture §17–18)
6. Color contrast meets AA minimum system-wide; `contrast-high` token reserved for AAA surfaces where specified. (Technical Architecture §18, Design System §22)
7. Animations must never block interaction — a visitor should always be able to act on the page even mid-animation.
8. Lighthouse Accessibility target: 95+ minimum. (Technical Architecture §16)
9. Every component's Quality Checklist entry for accessibility (ARIA, keyboard, contrast) must be checked before a component is considered complete. (Design System §25)

## Related

`ai/rules/animation.md`, `ai/rules/design.md`, `10-deployment.md`

## Last Updated

Generated from source manuals, version 1.0.
