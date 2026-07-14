# Components

No components exist yet in the repository — UNKNOWN implementation status.

## Expected top-level component folders (from `ai/context/04-architecture.md`, Technical Architecture §03)

```
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
  future-proof-systems/
  cta/
  footer/
  three/
  particles/
  animations/
```

## Expected decomposition pattern (example from Technical Architecture §04)

```
Hero
├── HeroLogo
├── HeroCanvas
├── HeroParticles
├── HeroContent
├── HeroButtons
└── HeroTransition
```

Each real component, once built, should be logged in `ai/knowledge/components.json` and `ai/indexes/components.md` with: location, purpose, dependencies, status, used-by, related sections.

## Related

`ai/prompts/build-component.md`, `ai/rules/coding.md`, `ai/rules/design.md`
