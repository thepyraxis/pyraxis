# 10 · Deployment

## Purpose

Record deployment expectations for the website codebase (distinct from "deployment" as a brand/product word — see `03-website.md` Product Bible §07 for the client-facing meaning of "Deploy Infrastructure").

## Responsibilities

Governs release process, environment configuration, and the pre-deployment checklist.

## Core Principles

**Pre-deployment checklist** (Technical Architecture §26):
- Build passes with no errors
- No TypeScript errors
- No console errors or hydration warnings
- No broken links or missing images
- Environment variables verified
- Cross-browser tested: Chrome, Firefox, Safari, Edge
- Mobile tested: iOS Safari, Android Chrome
- Lighthouse scores meet targets (see `06-tech-stack.md` and `ai/rules/performance.md`)
- Analytics and metadata verified

**Lighthouse targets:**

| Metric | Minimum |
|---|---|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1. (Technical Architecture §16)

**SEO requirements:** server-rendered content via App Router, Metadata API on all pages, Open Graph + Twitter Cards, structured data, semantic heading hierarchy, sitemap + robots.txt. (Technical Architecture §17)

## Dependencies

- `06-tech-stack.md`
- `ai/rules/performance.md`, `ai/rules/accessibility.md`

## Related Files

- `ai/docs/DEPLOYMENT.md` — operational how-to (currently UNKNOWN, no hosting/CI details exist in source manuals)

## Future Expansion

UNKNOWN — hosting provider, CI/CD pipeline, and environment variable list are not specified in any source manual.

## Last Updated

Generated from source manuals, version 1.0.
