# Design Rules

1. Always use design tokens. Never hardcode color, spacing, radius, shadow, blur, z-index, or timing values in components. (Design System §01, §26)
2. Purple (`brand-primary`/`brand-light`/`brand-dark`) is capped at ~5% of visual weight — reserved for signals, CTA, active states, and the Earth network. Everything else stays white/silver/gray. (Design System §02)
3. Only four surface types exist: Flat, Glass, Metal, Signal. Do not invent a fifth without updating `05-design-system.md` and the token files. (Design System §07)
4. Only four material tokens exist: `material-flat`, `material-glass`, `material-metal`, `material-signal`. (Design System §13)
5. Glow is reserved for particles, signals, CTA, Hero, Earth — never glow every component; glow exists to direct attention, not decorate. (Design System §08)
6. Blur stays within `blur-sm` (8–12px) to `blur-lg` (24px+ max). Glassmorphism is a seasoning, not a diet. (Design System §09)
7. Border radius uses only the defined scale (`radius-sm` 8px → `radius-full` 9999px). No mixed random radii. (Design System §06)
8. Spacing uses only the token scale (`space-1` 4px → `space-12` 160px). No arbitrary values. (Design System §04)
9. Typography never hardcodes font sizes — use the semantic scale (`display-*`, `heading-*`, `title-*`, `body-*`, `caption`, `label`). Headlines break across lines intentionally, one idea per line. (Design System §03)
10. Z-index uses only the defined layer tokens. Never `z-index: 99999`. (Design System §14)
11. Every component must pass the Component Quality Checklist before being considered done: single responsibility; reusable/composable; TypeScript strict; accessible (ARIA, keyboard, contrast); responsive at all breakpoints; tokens only; global motion language; global particle language; supports reduced-motion; works on touch; 60 FPS; matches Brand Bible creative direction. (Design System §25)
12. Identity test: a single button, card, or nav bar cropped out of context should still read as unmistakably PYRAXIS. (Design System §26)

## Related

`05-design-system.md`, `ai/rules/accessibility.md`, `ai/rules/animation.md`

## Last Updated

Generated from source manuals, version 1.0.
