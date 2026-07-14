# PYRAXIS — Technical Architecture
**Manual 04 of 05 · Version 1.0**

---

## 01 · Architecture Philosophy

This website is not a collection of pages. It is one continuous application. Every component behaves as part of one living system.

**Core constraints:**
- Never build isolated animations
- Never duplicate functionality
- Everything must be modular, reusable, maintainable, scalable
- The architecture must support future expansion without major rewrites
- The codebase should be understandable by a developer five years from now

---

## 02 · Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Animation | GSAP + ScrollTrigger |
| Micro-interactions | Framer Motion (only where GSAP is insufficient) |
| Smooth scroll | Lenis |
| 3D | Three.js + React Three Fiber + Drei (only when required) |
| State (local) | React Context |
| State (complex global) | Zustand (only if interaction complexity demands it) |
| Package manager | pnpm |

---

## 03 · Project Structure

```
app/
components/
  common/
  layout/
  navigation/
  hero/
  problem/
  growth-system/
  growth-engines/
  why-pyraxis/
  portfolio/
  process/
  intelligence-core/
  cta/
  footer/
  three/
  particles/
  animations/
hooks/
providers/
lib/
  utils/
styles/
  tokens/
public/
types/
config/
```

Every major section owns its own folder. Never dump unrelated files together.

---

## 04 · Component Architecture

**Rule:** Every component has one responsibility. Never create components larger than ~250 lines. Split instead.

**Example decomposition:**
```
Hero
├── HeroLogo
├── HeroCanvas
├── HeroParticles
├── HeroContent
├── HeroButtons
└── HeroTransition
```

Composition over complexity. Composition over monolith.

---

## 05 · Global Providers

One instance only. Never recreate.

```
ThemeProvider
ParticleProvider
MouseProvider
ScrollProvider
PerformanceProvider
AnimationProvider
```

These mount once at app root. All sections consume them. Never localize what should be global.

---

## 06 · Global Particle Engine

**This is the heart of the website.** One canvas. One simulation. One renderer. Different behaviours per section.

```
One Canvas
└── One Simulation
    └── One Renderer
        └── Receives instructions from sections
```

**Sections never own particles.** Sections send instructions:
- Target shape
- Behaviour mode
- Transition type
- Density

The engine performs the work. The engine is autonomous.

**Particle Manager responsibilities:**
- Creation and pooling
- Lifetime and recycling
- Velocity, attraction, repulsion
- Morph targets
- Mouse interaction
- Scroll interaction
- Color, glow, depth
- Performance (LOD, instancing)

---

## 07 · Shape Morphing System

Every object is capable of becoming another. One engine, all morphs.

```
Logo → Signal → Icon → Typography → Card → Network → Earth → Logo
```

Never build separate animation systems for different shapes. All morphs go through the same engine.

---

## 08 · Scroll Manager

One global controller.

**Responsibilities:**
- Current section tracking
- Scroll progress and velocity
- Direction detection
- Transition timing
- Particle state triggers
- Camera movement coordination

Nothing relies on scattered `useEffect` animations. Everything synchronizes through the scroll manager.

---

## 09 · Mouse Manager

Single global manager.

**Tracks:**
- Cursor position and velocity
- Hover targets
- Distance and depth
- Repulsion field radius (120–240px)
- Particle influence zones

Everything interactive connects to one manager. No duplicate cursor tracking.

---

## 10 · GSAP Architecture

GSAP handles:
- Large timeline animations
- ScrollTrigger choreography
- Section pinning
- Camera movement coordination

**Rules:**
- Each section owns one timeline
- Global animations centralized in ScrollManager
- Never scatter GSAP across random useEffects
- Kill timelines and ScrollTriggers on unmount — no memory leaks

---

## 11 · Three.js Architecture

Three.js exists only where necessary. Do not build the website around WebGL.

**Use Three.js for:**
- Hero object
- Signal core
- Energy sphere
- Infrastructure network
- Earth construction
- Background depth

**Avoid:**
- Multiple renderers (exactly one)
- Heavy shaders on mobile
- Unnecessary scenes
- Geometries or materials created per frame

---

## 12 · React Strategy

```
Server Components    → all static content (default)
Client Components   → animation, interaction, canvas, tracking
```

Never convert everything to client components. Server renders content. Client animates it.

---

## 13 · State Management Decision Tree

```
Is state local to one component?
  → useState

Is state shared across a few related components?
  → React Context

Is state global with complex interactions?
  → Zustand

Never introduce global state for convenience.
```

---

## 14 · Responsive System

| Breakpoint | Experience |
|------------|------------|
| Desktop | Full cinematic experience |
| Tablet | Reduced particle density, simplified camera, reduced blur |
| Mobile | No expensive shaders, lower particle count, touch replaces hover, simplified transitions |

Mobile is not a scaled desktop. It is its own intentionally designed experience. The emotional journey never changes. Only the complexity reduces.

---

## 15 · Performance Strategy

**Target:** 60 FPS on desktop, 45–60 FPS on mobile.

| Technique | Implementation |
|-----------|---------------|
| Object pooling | Allocate once, recycle forever |
| Geometry reuse | Share across identical meshes |
| Material reuse | One material instance per type |
| InstancedMesh | All particle rendering |
| LOD | Far = points, medium = triangles, near = detailed |
| Dynamic imports | Three.js loads async |
| Throttling | Expensive calculations (mouse, physics) |
| Pause offscreen | Stop calculations for invisible sections |
| No frame allocation | Never create arrays or objects inside animation loops |

---

## 16 · Lighthouse Targets

| Metric | Minimum |
|--------|---------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

**Core Web Vitals:**
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 17 · SEO

- Server-rendered content via Next.js App Router
- Metadata API for all pages
- Open Graph + Twitter Cards
- Structured data
- Semantic heading hierarchy
- Fast Core Web Vitals
- Sitemap and robots.txt

---

## 18 · Accessibility

- `prefers-reduced-motion`: Replace morphing with opacity, reduce density, disable camera motion
- Keyboard navigation throughout
- Focus states visible and consistent
- ARIA labels on all interactive elements
- Semantic HTML structure
- Color contrast meets AA minimum
- Animations never block interaction

---

## 19 · Image Strategy

| Type | Format |
|------|--------|
| Logo, icons, illustrations | SVG |
| Photos, renders | WebP + AVIF |
| Loading | Lazy (except Hero assets — priority) |

---

## 20 · Code Standards

**TypeScript:** Strict mode. No `any`. No implicit types.

**Components:** Single responsibility. Under 250 lines. Composition over inheritance.

**Style:** No inline styles. No magic numbers. No dead code. Comment complex logic only.

**Naming:**
```
✓ HeroCanvas · ParticleManager · GrowthEngineCard · MouseProvider · SignalPath
✗ hero_new · hero_v2 · component1 · test · finalFinal.tsx
```

Version names belong in Git history, not filenames.

---

## 21 · Git Workflow

Meaningful commits using conventional format:

```
feat(hero): add interactive logo
feat(particles): implement global particle engine
refactor(motion): extract scroll controller
perf(hero): reduce particle allocations
fix(gsap): kill scroll triggers on unmount
```

---

## 22 · Build Phases

Build sequentially. Perfect one phase. Then continue.

| Phase | Work |
|-------|------|
| 01 | Foundation + project structure |
| 02 | Design System + tokens |
| 03 | Global Providers |
| 04 | Global Particle Engine |
| 05 | Hero |
| 06 | Hero → Problem transition |
| 07 | Problem |
| 08 | Growth System |
| 09 | Growth Engines |
| 10 | Why PYRAXIS |
| 11 | Portfolio |
| 12 | Process |
| 13 | Intelligence Core |
| 14 | CTA |
| 15 | Footer |
| 16 | Performance optimization |
| 17 | Final polish + QA |

Never build multiple major sections simultaneously.

---

## 23 · Section Completion Gate

A section is complete only when all pass:

- [ ] Desktop layout complete
- [ ] Tablet layout complete
- [ ] Mobile layout complete
- [ ] Animations complete
- [ ] Mouse interactions complete
- [ ] Accessibility verified
- [ ] Responsive typography verified
- [ ] Performance tested (60 FPS)
- [ ] Lighthouse checked
- [ ] Transition into next section complete

---

## 24 · AI Collaboration Rules

When using AI to generate code:

- Never regenerate existing architecture
- Extend the current system
- Never replace working components
- Reuse existing hooks, providers, utilities, particle engine
- Every AI addition must integrate with current architecture — no parallel systems

---

## 25 · Negative Prompt (Never Generate)

- HTML/CSS/JS files, `index.html`, `style.css`, `script.js`
- Inline CSS or inline JavaScript
- jQuery, Bootstrap, CDN imports
- Generic agency templates or SaaS landing page layouts
- ThemeForest aesthetics or generic hero gradients
- Emoji-based UI, cartoon graphics, RGB gamer visuals
- Neon cyberpunk themes, matrix effects
- Random floating particles (particles have meaning)
- Duplicate particle systems
- Components copied from Apple, Stripe, Linear, or Vercel
- Any design that locks PYRAXIS into one industry
- Anything that breaks the "one living system" narrative

---

## 26 · Pre-Deployment Checklist

- [ ] Build passes with no errors
- [ ] No TypeScript errors
- [ ] No console errors or hydration warnings
- [ ] No broken links or missing images
- [ ] Environment variables verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tested (iOS Safari, Android Chrome)
- [ ] Lighthouse scores meet targets
- [ ] Analytics and metadata verified

---

## 27 · Final Rule

The architecture must allow adding an entirely new section five years from now without rewriting the particle engine, scroll system, mouse system, animation system, or design system.

If a future developer removes the logo, the remaining experience should still feel unmistakably like PYRAXIS. That is the standard every architectural decision must meet.

---

*Cross-references: For component visual specifications → Design System (Manual 03). For section-specific animation instructions → Experience Blueprint (Manual 05). For what each section must achieve → Product Bible (Manual 02).*
