# 01 · Project

## Purpose

PYRAXIS is digital growth infrastructure for businesses — an interconnected system (website, lead capture, booking, follow-up, retention, review, referral, and intelligence layer) that converts visitors into customers and customers into compounding revenue. It is explicitly not "a website," "an AI automation product," or "a service." See `07-brand.md` and `03-website.md`.

The current deliverable being planned/built from this documentation set is the PYRAXIS marketing website — a single continuous, scroll-driven cinematic experience (10 scenes) built on Next.js, GSAP, and a global particle engine.

## Responsibilities

This repository (once code exists) is responsible for:
- The PYRAXIS marketing website front-end (Next.js app)
- The shared design token system
- The global particle/animation engine
- The documentation system in `ai/` (this system) that keeps any AI assistant or human developer oriented without needing prior conversation history

## Core Principles

- Infrastructure over trend: the brand and codebase must survive product pivots (website → AI systems → SaaS) without a rebrand or rewrite. See `02-philosophy.md`.
- One living system, not a page collection: architecture and experience are both designed as one continuous system, not independent modules bolted together.
- Documentation is equal in importance to code. See `CLAUDE.md`.

## Dependencies

- Source documentation: five manuals (`01-brand-bible.md` through `05-experience-blueprint.md`) and `00-master-index.md`, originally supplied as project specification. Canonical content has been redistributed into `ai/context/`, `ai/rules/`, and `ai/knowledge/` per the AI Operating System Generator instructions (see `pyraxis_content_.txt`, the generator prompt this system was built from).
- Technology stack: see `06-tech-stack.md`.

## Related Files

- `02-philosophy.md` — why the brand/product exists the way it does
- `03-website.md` — what the website is and does
- `CLAUDE.md` — session bootloader, read this first every session
- `ai/knowledge/project.json` — machine-readable summary

## Future Expansion

Per source manuals, product roadmap explicitly anticipates: AI-native client dashboards, predictive signal routing, cross-business intelligence networks, SaaS products on the same engine architecture (see Product Bible §11). The documentation system and architecture must accommodate these without redesign.

## Status

UNKNOWN — no source code, `package.json`, or build output was present in the repository at generation time. Only specification documents (the five manuals) existed. Treat all "current build state" claims elsewhere in `ai/memory/` as UNKNOWN unless a manual explicitly states progress.

## Last Updated

Generated from source manuals, version 1.0. Update this line whenever this file's content changes.
