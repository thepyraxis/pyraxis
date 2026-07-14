# Coding Rules

Permanent constraints. Do not violate without adding an entry to `ai/memory/decisions.md`.

1. TypeScript strict mode always. No `any`. No implicit types. (Technical Architecture §20)
2. No inline styles. No magic numbers. Use design tokens exclusively (`styles/tokens/`). (Technical Architecture §20, Design System §01)
3. No dead code. Comment complex logic only — do not narrate obvious code. (Technical Architecture §20)
4. Components: single responsibility, under ~250 lines. Split rather than grow. (Technical Architecture §04, §20)
5. Composition over inheritance, composition over monolith. (Technical Architecture §04)
6. Naming: descriptive PascalCase for components (`HeroCanvas`, `ParticleManager`, `GrowthEngineCard`). Never version suffixes in filenames (`hero_v2`, `finalFinal.tsx`) — version history belongs in Git. (Technical Architecture §20)
7. Server Components are the default for static content. Client Components (`"use client"`) only for animation, interaction, canvas, tracking. (Technical Architecture §12)
8. State: `useState` for local, React Context for shared-among-a-few, Zustand only for complex global interaction state. Never introduce global state for convenience. (Technical Architecture §13)
9. GSAP: one timeline per section. Kill timelines and ScrollTriggers on unmount — no memory leaks. Never scatter GSAP calls across random `useEffect`s. (Technical Architecture §10)
10. Particles, scroll, and mouse tracking are owned exclusively by the global engines/managers (`ParticleProvider`, `ScrollManager`, `MouseManager`). Sections send instructions; they never instantiate their own systems. (Technical Architecture §06, §08, §09)
11. Never create arrays or objects inside animation loops (no per-frame allocation). Reuse geometry and materials; one material instance per type; `InstancedMesh` for all particle rendering. (Technical Architecture §15)
12. Dynamic-import Three.js; throttle expensive calculations (mouse, physics); pause offscreen calculations for invisible sections. (Technical Architecture §15)
13. Never regenerate existing architecture when using AI to add code. Extend the current system, reuse existing hooks/providers/utilities/particle engine. Every addition must integrate — no parallel systems. (Technical Architecture §24)

## Negative Prompt — never generate

- Plain HTML/CSS/JS files (`index.html`, `style.css`, `script.js`)
- Inline CSS or inline JavaScript
- jQuery, Bootstrap, or CDN-only imports
- Generic agency templates or SaaS landing-page layouts
- ThemeForest aesthetics or generic hero gradients
- Emoji-based UI, cartoon graphics, RGB gamer visuals
- Neon cyberpunk themes, matrix effects
- Random floating particles (particles always carry meaning — see `ai/rules/animation.md`)
- Duplicate particle systems
- Components copied from Apple, Stripe, Linear, or Vercel
- Any design that locks PYRAXIS into one industry
- Anything that breaks the "one living system" narrative

(Technical Architecture §25)

## Related

`ai/rules/architecture.md`, `ai/rules/performance.md`, `04-architecture.md`

## Last Updated

Generated from source manuals, version 1.0.
