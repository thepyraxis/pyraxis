# PYRAXIS — Design System
**Manual 03 of 05 · Version 1.0**

---

## 01 · Design System Philosophy

The design system is not a component library. It is the visual language of the PYRAXIS brand.

Every component must feel engineered rather than decorated. One coherent material, one motion language, one particle DNA — expressed across every surface.

**Single source of truth:** All visual decisions live in design tokens. Change a token, change the system. Never hardcode values inside components.

---

## 02 · Color Tokens

### Backgrounds
| Token | Value | Use |
|-------|-------|-----|
| `background-primary` | `#050505` | Main canvas |
| `background-secondary` | `#0A0A0A` | Elevated sections |
| `background-surface` | `#111111` | Cards, panels |

### Text
| Token | Value | Use |
|-------|-------|-----|
| `text-primary` | `#FFFFFF` | Headlines |
| `text-secondary` | `#D4D4D8` | Body copy |
| `text-muted` | `#A1A1AA` | Captions, labels |
| `text-disabled` | `#71717A` | Inactive states |

### Brand
| Token | Value | Use |
|-------|-------|-----|
| `brand-primary` | `#8B5CF6` | Signals, CTA, emphasis |
| `brand-light` | `#A78BFA` | Hover states |
| `brand-dark` | `#6D28D9` | Pressed states |

**Purple rule:** Purple guides attention. It never dominates. 95% of particles are white/silver/gray. 5% purple — reserved for signals, CTA, active states, Earth network.

---

## 03 · Typography Tokens

Never hardcode font sizes. Every token scales automatically across breakpoints.

| Token | Role |
|-------|------|
| `display-xl` / `display-lg` / `display-md` | Hero headlines |
| `heading-xl` / `heading-lg` / `heading-md` | Section titles |
| `title-lg` / `title-md` | Cards, subsections |
| `body-lg` / `body-md` / `body-sm` | Paragraphs |
| `caption` | Small descriptions |
| `label` | Navigation, buttons, forms |

**Typography character:** Large. Confident. Simple. Strong hierarchy. Large spacing. The typography must feel expensive. Headlines break across lines intentionally — one idea per line.

---

## 04 · Spacing Tokens

| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 48px |
| `space-8` | 64px |
| `space-9` | 80px |
| `space-10` | 96px |
| `space-11` | 120px |
| `space-12` | 160px |

No arbitrary values. Every margin and padding uses this scale.

---

## 05 · Grid System

| Breakpoint | Columns | Container | Gutters |
|------------|---------|-----------|---------|
| Desktop | 12 | max 1440px, content 1280px | 32px |
| Tablet | 8 | — | — |
| Mobile | 4 | — | — |

**Section padding:** Top/bottom 120–180px · Horizontal 32–64px

---

## 06 · Border Radius Tokens

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 8px | Small UI |
| `radius-md` | 12px | Inputs |
| `radius-lg` | 20px | Cards |
| `radius-xl` | 28px | Large panels |
| `radius-full` | 9999px | Badges, pills |

No mixed random radii. Consistency creates premium quality.

---

## 07 · Surface System

Every surface belongs to one of four types:

| Type | Character | Use |
|------|-----------|-----|
| Flat | Minimal, no depth | Background sections |
| Glass | Semi-transparent, blur 8–12px | Interactive cards |
| Metal | Reflective, premium | Hero objects |
| Signal | Glowing, purple-tinted | Active signals, CTA |

No other surface types exist.

---

## 08 · Shadow & Glow Tokens

**Shadows:** `shadow-xs` · `shadow-sm` · `shadow-md` · `shadow-lg` · `shadow-xl`

**Glow:** Reserved for particles, signals, CTA, Hero, Earth.

| Token | Use |
|-------|-----|
| `glow-soft` | Idle particles |
| `glow-medium` | Active components |
| `glow-strong` | Signals, CTA |
| `glow-signal` | Hero, Earth, active engines |

Never glow every component. Glow directs attention.

---

## 09 · Blur Tokens

| Token | Value | Use |
|-------|-------|-----|
| `blur-sm` | 8–12px | Glass surfaces |
| `blur-md` | 16–24px | Background depth |
| `blur-lg` | 24px+ | Overlays |

Avoid excessive blur. Glassmorphism is a seasoning, not a diet.

---

## 10 · Motion Tokens

All animations use predefined durations. No magic numbers.

### Timing
| Token | Duration | Use |
|-------|----------|-----|
| `instant` | < 120ms | State feedback |
| `fast` | 120–250ms | Micro interactions |
| `normal` | 250–400ms | Hover states |
| `slow` | 800–1400ms | Section animations |
| `cinematic` | 1500–3000ms | Major transformations |

### Easing
| Token | Use |
|-------|-----|
| `ease-standard` | Default UI motion |
| `ease-emphasized` | Entrances, attention |
| `ease-decelerate` | Objects arriving |
| `ease-accelerate` | Objects leaving |
| `ease-smooth` | Particle physics |

---

## 11 · Particle Tokens

| Token | Defines |
|-------|---------|
| `particle-idle` | Slow drift, low glow |
| `particle-building` | Medium speed, medium glow |
| `particle-signal` | Fast, bright, directional |
| `particle-network` | Connected paths, pulsing |
| `particle-earth` | Orbital, structured |
| `particle-glow` | Lighting support only |

Each token specifies: speed · glow intensity · density · interaction radius · LOD threshold.

---

## 12 · Lighting Tokens

| Token | Use |
|-------|-----|
| `light-ambient` | Scene base |
| `light-key` | Primary directional |
| `light-rim` | Edge definition |
| `light-accent` | Attention direction |
| `light-hero` | Hero environment |

Lighting is cinematic. Soft volumetric. Directional highlights. Edge reflections. Never: neon, RGB, harsh bloom, gaming aesthetics.

---

## 13 · Material Tokens

| Token | Character |
|-------|-----------|
| `material-flat` | Matte, minimal |
| `material-glass` | Transparent, refractive |
| `material-metal` | Reflective, premium alloy |
| `material-signal` | Energetic, purple-tinted |

Every object uses one of these. No new materials without updating the system.

---

## 14 · Z-Index Tokens

| Token | Layer |
|-------|-------|
| `z-background` | Canvas, particles background |
| `z-particles` | Active particle layer |
| `z-content` | Section content |
| `z-overlay` | Modals, sheets |
| `z-navigation` | Nav bar |
| `z-modal` | Dialog layer |
| `z-tooltip` | Floating labels |

No `z-index: 99999`. Ever.

---

## 15 · Component Hierarchy

```
Page
└── Section
    └── Layout
        └── Component
            └── Subcomponent
                └── Primitive
```

*Example: Hero → HeroContent → HeroButtons → PrimaryButton*

Never skip layers. Never merge responsibilities across levels.

---

## 16 · Button System

**Variants:** Primary · Secondary · Ghost · Text · Icon

**States:** Default · Hover · Pressed · Focus · Disabled · Loading

**Hover behavior:**
- Surface lifts slightly
- Glow increases
- Particles gather near edges
- Cursor magnetizes

**Click:** Small energy pulse → natural return. Never bounce.

---

## 17 · Card System

Cards feel physical. Every card defines: padding · radius · border · glow · elevation · hover · spacing.

**Hover:**
- Depth increases
- Perspective shifts
- Light moves
- Particles gather along edges
- Surface reflects cursor position

**Leaving:** Everything returns smoothly.

---

## 18 · Navigation

Minimal. Fixed. Transparent. Darkens slightly on scroll.

Contents: Logo · Links · CTA

Hover: Light sweep · tiny particle response · underline grows.

Never flashy.

---

## 19 · Icon System

Icons are manufactured, not imported.

- Consistent stroke width
- Minimal detail
- Particles capable of constructing every icon
- No color fills
- No emoji

**Animation:** Edges → Outline → Material → Glow → Final object. Dissolve back into particles.

---

## 20 · Signal Component

The Signal is the fundamental visual primitive of the entire website. Every section uses it differently.

| Scene | Signal State |
|-------|-------------|
| Hero | Born from logo |
| Problem | Lost / interrupted |
| Growth System | Flowing through engines |
| Growth Engines | Activating each module |
| Portfolio | Demonstrating deployment |
| Process | Traveling each stage |
| Intelligence Core | Thousands merging into network |
| CTA | Converging into Earth |
| Footer | Dispersing calmly |

---

## 21 · Breakpoint Tokens

| Token | Width |
|-------|-------|
| `xs` | < 375px |
| `sm` | 375px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1440px |

Components adapt using these only.

---

## 22 · Accessibility Tokens

| Token | Use |
|-------|-----|
| `focus-ring` | Keyboard focus visible state |
| `focus-shadow` | Focus depth indicator |
| `contrast-high` | AAA contrast surfaces |
| `contrast-normal` | AA contrast minimum |
| `reduced-motion` | Simplified animation fallback |

`prefers-reduced-motion`: Replace morphing with opacity. Reduce density. Disable camera motion. Preserve the story.

---

## 23 · Performance Tokens

Visual effects have budgets:

| Token | Value |
|-------|-------|
| `max-particles-desktop` | 3000–8000 |
| `max-particles-tablet` | 1200–2500 |
| `max-particles-mobile` | 400–1200 |
| `max-blur` | 24px |
| `max-glow` | Defined per component |

---

## 24 · Token Folder Structure

```
styles/
└── tokens/
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    ├── radius.ts
    ├── shadows.ts
    ├── glow.ts
    ├── blur.ts
    ├── borders.ts
    ├── zIndex.ts
    ├── motion.ts
    ├── easing.ts
    ├── particles.ts
    ├── lighting.ts
    ├── materials.ts
    ├── surfaces.ts
    ├── breakpoints.ts
    └── accessibility.ts
```

Every component imports from these files. Never duplicate values.

---

## 25 · Component Quality Checklist

Every component must satisfy:

- [ ] Single responsibility
- [ ] Reusable and composable
- [ ] Fully typed (TypeScript strict)
- [ ] Accessible (ARIA, keyboard, contrast)
- [ ] Responsive (all breakpoints defined)
- [ ] Uses design tokens only (no hardcoded values)
- [ ] Uses global motion language
- [ ] Uses global particle language
- [ ] Supports reduced-motion
- [ ] Works on touch devices
- [ ] Performs at 60 FPS
- [ ] Matches Creative Direction (Brand Bible Manual 01)

---

## 26 · Design System Rule

The design system must allow changing the personality of the entire website by editing only the token files. Components never know specific colors, spacing, or animation values. They only know the design language. The tokens define the brand. The components express it.

**Identity test:** If someone cropped a single button, card, or nav bar from the website in isolation — it should still feel unmistakably PYRAXIS.

---

*Cross-references: For philosophy behind visual decisions → Brand Bible (Manual 01). For motion implementation → Experience Blueprint (Manual 05). For technical token integration → Technical Architecture (Manual 04).*
