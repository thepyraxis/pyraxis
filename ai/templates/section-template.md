# Section Template

Copy this block into `ai/knowledge/sections.json` for every new scene/section.

```json
{
  "id": "section-id",
  "name": "Section Name",
  "height": "e.g. 100vh",
  "emotion": ["Emotion1", "Emotion2"],
  "intensity": "Low | Medium | High | Very High",
  "purpose": "one sentence, what this scene must accomplish",
  "status": "not-started",
  "components": [],
  "dependencies": ["previous-section-id"],
  "progress": 0
}
```

## Section Completion Gate (must all pass before status = complete)

- [ ] Desktop layout complete
- [ ] Tablet layout complete
- [ ] Mobile layout complete
- [ ] Animations complete
- [ ] Mouse interactions complete
- [ ] Accessibility verified
- [ ] Responsive typography verified
- [ ] Performance tested (60 FPS)
- [ ] Lighthouse checked
- [ ] No console errors/warnings
- [ ] No unexpected layout shift (CLS)
- [ ] Transition into next section complete

(`ai/rules/architecture.md` #7, Technical Architecture §23)

## Related

`ai/prompts/build-section.md`, `ai/context/08-animation-system.md`
