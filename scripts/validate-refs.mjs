#!/usr/bin/env node
/**
 * validate-refs.mjs
 *
 * ai/indexes/files.md claims to list "every important file in the
 * repository". At today's size that's eyeballable; at 500+ components
 * and 1000+ commits it isn't. This script makes that claim checkable:
 *
 *   1. Every real file under ai/ (.md/.json) has its basename mentioned
 *      somewhere in ai/indexes/files.md.
 *   2. Every implemented component directory under components/ (i.e. one
 *      that contains a real .tsx file, not just a .placeholder.md) has a
 *      corresponding entry in ai/indexes/components.md AND
 *      ai/knowledge/components.json — catches the exact "index drifted
 *      from reality" failure mode CLAUDE.md warns about.
 *   3. ai/indexes/components.md and ai/knowledge/components.json list the
 *      same set of component names as each other (human/machine parity,
 *      ai/rules/documentation.md #7).
 *
 * ai/checkpoints/phaseNN.md files are intentionally excluded from the
 * files.md basename check below — ai/indexes/files.md documents that
 * range with the shorthand "phase01.md … phase17.md" rather than listing
 * all 17 individually, and phase/checkpoint numeric sync is already the
 * job of validate-state.mjs. Duplicating that check here would just
 * produce noisy false positives against a documented convention.
 *
 * This intentionally does NOT flag anything while the repo is still
 * documentation-only (no .tsx files exist yet) — it activates naturally
 * as Phase 01+ lands real components, which is exactly when it starts
 * being useful.
 *
 * Exit code 0 = clean, 1 = drift detected.
 * Usage: node scripts/validate-refs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

let errors = [];

// --- 1. Every ai/**/*.{md,json} basename appears in ai/indexes/files.md ---
const filesIndex = read("ai/indexes/files.md");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else if (/\.(md|json)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

for (const rel of walk("ai")) {
  if (rel.startsWith(path.join("ai", "checkpoints"))) continue; // covered by validate-state.mjs, documented as a range shorthand
  const base = path.basename(rel);
  if (base === "files.md") continue; // self-reference, obviously present
  if (!filesIndex.includes(base)) {
    errors.push(`[unindexed-file] ${rel} exists but its name is not mentioned in ai/indexes/files.md`);
  }
}

// --- 2 & 3. components/ vs ai/indexes/components.md vs ai/knowledge/components.json ---
const componentsRoot = path.join(ROOT, "components");
let implementedComponents = [];
if (fs.existsSync(componentsRoot)) {
  for (const dir of fs.readdirSync(componentsRoot, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const sub = path.join(componentsRoot, dir.name);
    const hasTsx = fs.readdirSync(sub).some((f) => f.endsWith(".tsx") || f.endsWith(".jsx"));
    if (hasTsx) implementedComponents.push(dir.name);
  }
}

if (implementedComponents.length > 0) {
  const componentsIndex = read("ai/indexes/components.md");
  let componentsJson = [];
  try {
    componentsJson = JSON.parse(read("ai/knowledge/components.json"));
  } catch {
    errors.push(`[bad-json] ai/knowledge/components.json is not valid JSON or not an array`);
  }

  for (const name of implementedComponents) {
    if (!componentsIndex.includes(name)) {
      errors.push(`[missing-index-entry] components/${name}/ has real .tsx files but is not mentioned in ai/indexes/components.md`);
    }
    if (Array.isArray(componentsJson) && !componentsJson.some((c) => c.name === name || c.id === name)) {
      errors.push(`[missing-knowledge-entry] components/${name}/ has real .tsx files but no matching entry in ai/knowledge/components.json`);
    }
  }
} else {
  console.log("validate-refs: no implemented components yet (pre-Phase-01) — component/index parity check skipped.");
}

console.log(`validate-refs: checked ${walk("ai").length} ai/ files against ai/indexes/files.md.`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:\n`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
} else {
  console.log("OK — indexes match reality.");
  process.exit(0);
}
