# Component Template

Copy this block into `ai/indexes/components.md` and a matching object into `ai/knowledge/components.json` for every new component.

```md
### ComponentName

- **Location:** components/<folder>/ComponentName.tsx
- **Purpose:** one sentence, what problem this solves
- **Layer:** Page | Section | Layout | Component | Subcomponent | Primitive
- **Surface/Material:** Flat | Glass | Metal | Signal
- **Server or Client:** Server | Client (reason if Client)
- **Dependencies:** providers/hooks/other components it relies on
- **Used by:** parent components/sections
- **Related sections:** which of the 10 scenes use this
- **Status:** not-started | in-progress | complete
- **Notes:** anything a future AI/dev needs to know that isn't obvious from the code
```

```json
{
  "name": "ComponentName",
  "location": "components/.../ComponentName.tsx",
  "purpose": "",
  "dependencies": [],
  "status": "not-started",
  "usedBy": [],
  "relatedSections": []
}
```

## Related

`ai/prompts/build-component.md`, `ai/rules/coding.md`, `ai/rules/design.md`
