# Deployment (Operational)

UNKNOWN — hosting provider, CI/CD pipeline, domain/DNS, and environment variables are not specified in any source manual.

For deployment *requirements* (as opposed to operational how-to), see `ai/context/10-deployment.md` and the checklist in `ai/prompts/release.md`.

## When this becomes real

Fill in: hosting provider, build command, deploy command, environment variable list (names only, never values), preview/staging URL pattern, rollback procedure. When `.github/workflows/` is scaffolded, wire `node scripts/validate-all.mjs` in as a required CI check alongside lint/build/test — it catches documentation drift the same way a type check catches code drift.

## Related

`ai/context/10-deployment.md`, `ai/prompts/release.md`, `ai/rules/security.md`, `scripts/`
