# Prompt: Release / Deployment

Run the full checklist in `10-deployment.md` before any release:

- [ ] Build passes with no errors
- [ ] No TypeScript errors
- [ ] No console errors or hydration warnings
- [ ] No broken links or missing images
- [ ] Environment variables verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tested (iOS Safari, Android Chrome)
- [ ] Lighthouse scores meet targets (Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+; LCP<2.5s, INP<200ms, CLS<0.1)
- [ ] Analytics and metadata verified
- [ ] All ten scenes individually pass their Section Completion Gate (`ai/rules/architecture.md` #7)
- [ ] `ai/memory/progress.md` shows 100% across all build phases

## After release

Add a version entry to `ai/memory/changelog.md`, update `ai/memory/roadmap.md` status, and archive superseded `next.md`/`current.md` content into `completed.md`.

## Related

`10-deployment.md`, `ai/rules/performance.md`, `ai/rules/accessibility.md`
