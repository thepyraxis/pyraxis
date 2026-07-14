# Prompt: Review Code or Design Against the System

Use before merging any change, or when asked to audit existing work — for any single component, feature, or PR. For a whole-phase acceptance check against `ai/checkpoints/phaseNN.md` (e.g. before running `ai/scripts/finish-phase.md`), use `ai/scripts/review-phase.md` instead; it runs this same set of gates but scoped to a full checkpoint.

## Run the Quality Gates

From `00-master-index.md`, all five must pass, no exceptions:

- [ ] **Brand** — matches `07-brand.md` voice, banned-word list, messaging formula
- [ ] **Product narrative** — communicates the right outcome per `03-website.md`
- [ ] **Visual consistency** — uses design tokens only, per `ai/rules/design.md`
- [ ] **Technical standards** — meets `ai/rules/architecture.md` and `ai/rules/coding.md`
- [ ] **Experience integrity** — supports the scene story, per `ai/rules/animation.md`

## Component-level review

Run the full checklist in `ai/rules/design.md` #11 (Component Quality Checklist).

## Section-level review

Run the Section Completion Gate in `ai/rules/architecture.md` #7.

## Negative-prompt scan

Confirm none of the forbidden patterns in `ai/rules/coding.md` (Negative Prompt list) are present.

## Output format

List failures grouped by gate. For each failure: what rule it violates, which file/section defines the rule, and a concrete fix. Do not approve if any gate fails.

## Related

`00-master-index.md`, all `ai/rules/*.md`
