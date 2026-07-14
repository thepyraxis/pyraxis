# Index — Dependency Graph

No `package.json` exists yet. UNKNOWN versions. Planned dependency graph below, sourced from `ai/context/06-tech-stack.md`.

```
Next.js (App Router)
├── TypeScript (strict)
├── Tailwind CSS
├── GSAP + ScrollTrigger  ── drives section timelines, scroll choreography
├── Framer Motion         ── micro-interactions only, where GSAP insufficient
├── Lenis                 ── smooth scroll, feeds ScrollManager
├── Three.js
│   ├── React Three Fiber
│   └── Drei
├── React Context         ── local/shared state
├── Zustand               ── complex global state only
└── pnpm                  ── package manager
```

**Internal dependency direction (conceptual, once code exists):**

```
Global Providers (Theme/Particle/Mouse/Scroll/Performance/Animation)
        ↓
Global Managers (ParticleManager/ScrollManager/MouseManager)
        ↓
Section components (Hero, Problem, Growth System, ...)
        ↓
Subcomponents / Primitives
```

Sections depend downward on managers; managers never depend on sections (see `ai/rules/architecture.md` #4, #6).

## Related

`ai/knowledge/dependencies.json`, `ai/context/06-tech-stack.md`
