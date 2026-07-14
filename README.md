# PYRAXIS

Digital growth infrastructure for businesses — a single connected system spanning website, lead capture, booking, follow-up, retention, review, referral, and intelligence. Not a website. Not automation. Not AI. Infrastructure.

> Status: **documentation baseline only.** No application code exists in this repository yet. Everything below describes the specification this project will be built against. See `ai/memory/progress.md` for the current build state.

## Vision

A business that chooses PYRAXIS should feel it has chosen a long-term infrastructure partner, not a vendor — a brand that stays native to whatever it builds, five years from now, without needing a rebrand. Full detail: [`ai/context/02-philosophy.md`](ai/context/02-philosophy.md).

## Architecture

The website is built as one continuous application — a ten-scene, scroll-driven cinematic experience powered by a single global particle engine, a single scroll manager, and a single mouse manager. Sections never own their own animation systems; they send instructions to shared global engines. Full detail: [`ai/context/04-architecture.md`](ai/context/04-architecture.md).

**Stack:** Next.js 15+ (App Router) · TypeScript (strict) · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Three.js + React Three Fiber + Drei · pnpm. Full detail: [`ai/context/06-tech-stack.md`](ai/context/06-tech-stack.md).

## Folder Structure

```
pyraxis/
├── app/                    # Next.js App Router (not yet implemented)
├── components/             # one folder per section + shared/three/particles/animations
├── hooks/
├── lib/
├── providers/              # global providers, mount once at app root
├── public/
├── styles/tokens/          # single source of truth for all visual values
├── types/
├── utils/                  # ⚠ duplicates lib/utils/ — unresolved, see ai/memory/known-issues.md
├── scripts/                # real, dependency-free Node validators (docs/state/refs) — see ai/docs/CONTRIBUTING.md
├── ai/                     # AI Operating System — see below
│   ├── bootstrap.md        # condensed session checklist, read 2nd
│   ├── state.json          # machine-readable status snapshot (derived cache)
│   ├── scripts/            # reusable maintenance prompts
│   └── checkpoints/        # one acceptance-criteria file per roadmap phase
├── STATUS.md               # human dashboard (mirrors ai/state.json)
├── CHANGELOG.md            # human-readable digest (detail: ai/memory/changelog.md)
├── TODO.md                 # quick scene/phase checklist
├── AI.md                   # compatibility pointer → CLAUDE.md, for non-Claude tools
├── CLAUDE.md               # AI session bootloader
└── README.md               # this file
```

## Installation

UNKNOWN — no `package.json` exists yet. Once Phase 01 (Foundation) is complete, this section will list real install steps. Expected shape, per the tech stack:

```bash
pnpm install
```

## Commands

UNKNOWN — no scripts exist yet. Expected shape once scaffolded:

```bash
pnpm dev      # local development
pnpm build    # production build
pnpm lint     # lint
```

## Development

Build phases run strictly in sequence — never multiple major sections at once. Full phase list and current status: [`ai/memory/roadmap.md`](ai/memory/roadmap.md) and [`ai/memory/progress.md`](ai/memory/progress.md).

Before writing any code, read [`CLAUDE.md`](CLAUDE.md) — it is the required starting point for every session, human or AI.

## Deployment

Pre-deployment checklist and Lighthouse/Core Web Vitals targets: [`ai/context/10-deployment.md`](ai/context/10-deployment.md). Hosting/CI details are UNKNOWN — not yet decided.

## Status at a Glance

See [`STATUS.md`](STATUS.md) (human dashboard) or [`ai/state.json`](ai/state.json) (machine-readable). Quick checklist: [`TODO.md`](TODO.md). Human-readable changelog: [`CHANGELOG.md`](CHANGELOG.md) (technical detail lives in `ai/memory/changelog.md`).

## Documentation

All project knowledge lives in [`ai/`](ai/) — this is the project's memory, and it is expected to outlive the current website implementation, exactly as the original five-manual specification (Brand Bible, Product Bible, Design System, Technical Architecture, Experience Blueprint) intended.

| Want to know... | Go to |
|---|---|
| Where to start, every session | `CLAUDE.md`, then `ai/bootstrap.md` (non-Claude tools: `AI.md` redirects here too) |
| Why the project exists, why it's built this way | `ai/context/` |
| What's being worked on right now | `ai/memory/current.md` (or `ai/state.json` / `STATUS.md` for a fast snapshot) |
| What's not allowed | `ai/rules/` |
| How to do a specific task | `ai/prompts/` |
| How to do routine memory/phase bookkeeping | `ai/scripts/` |
| Whether a phase is actually done | `ai/checkpoints/` |
| Reference docs (API, components, features) | `ai/docs/` |
| Machine-readable project state | `ai/knowledge/`, `ai/state.json` |
| Where something lives | `ai/indexes/` |
| Templates for new entries | `ai/templates/` |
| Automated consistency checks (broken links, state sync, index drift) | `scripts/` — run `node scripts/validate-all.mjs` |

## AI System

This repository is a **self-documenting AI Operating System**: any AI coding assistant should be able to open this repo cold, read `CLAUDE.md`, and be fully oriented within minutes — no prior conversation history required. See [`CLAUDE.md`](CLAUDE.md) for the required boot sequence and the update obligations that come after every completed feature.
