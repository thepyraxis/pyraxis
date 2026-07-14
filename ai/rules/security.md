# Security Rules

UNKNOWN — none of the five source manuals (Brand Bible, Product Bible, Design System, Technical Architecture, Experience Blueprint) specify security requirements, authentication approach, data handling policy, or environment-variable/secrets handling.

## Provisional baseline (standard practice, not sourced from manuals — mark and revise once real requirements exist)

- Never commit secrets or API keys to the repository; use environment variables.
- Validate and sanitize all form input (Lead Engine, Booking Engine, contact forms) before it reaches any backend or third-party integration.
- Any future backend/API work must define its own security rules here and this file must be updated out of UNKNOWN status.

## Related

`10-deployment.md`, `ai/memory/known-issues.md`

## Last Updated

Generated from source manuals, version 1.0 — flagged UNKNOWN, needs owner input.
