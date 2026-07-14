# Performance Rules

**Targets:** 60 FPS desktop, 45–60 FPS mobile. Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1. (Technical Architecture §15–16)

1. Particle density is capped by device and must adjust dynamically — performance always wins over particle count:

   | Device | Max particles |
   |---|---|
   | Desktop | 3,000–8,000 |
   | Tablet | 1,200–2,500 |
   | Mobile | 400–1,200 |

   (Design System §23, Experience Blueprint §04)

2. Object pooling: allocate once, recycle forever. Never allocate arrays/objects inside animation loops. (Technical Architecture §15)
3. Reuse geometry across identical meshes; one material instance per type; use `InstancedMesh` for all particle rendering. (Technical Architecture §15)
4. LOD: far = points, medium = triangles, near = detailed geometry. (Technical Architecture §15)
5. Dynamic-import Three.js so it never blocks initial load.
6. Throttle expensive per-frame calculations (mouse tracking, physics).
7. Pause calculations for offscreen/invisible sections.
8. Max blur is 24px system-wide (`max-blur` token). (Design System §23)
9. Mobile is not a scaled-down desktop experience — it is independently designed with lower complexity: no expensive shaders, lower particle counts, touch replaces hover, simplified transitions. The emotional journey must not change, only the complexity. (Technical Architecture §14, Experience Blueprint §20)
10. Images: SVG for logos/icons/illustrations; WebP/AVIF for photos/renders; lazy-load everything except Hero assets (priority-loaded). (Technical Architecture §19)

## Related

`09-particle-engine.md`, `10-deployment.md`, `ai/rules/animation.md`

## Last Updated

Generated from source manuals, version 1.0.
