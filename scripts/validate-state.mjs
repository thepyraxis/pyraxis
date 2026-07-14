#!/usr/bin/env node
/**
 * validate-state.mjs
 *
 * ai/rules/documentation.md #9: ai/state.json is a derived cache;
 * ai/memory/{current,next,roadmap,progress}.md are authoritative.
 * This script verifies they haven't drifted apart, and that the
 * roadmap/checkpoint/spec layers stay numerically in sync as the
 * project scales past 17 phases and 10 sections.
 *
 * Checks:
 *   1. ai/state.json.phaseTotal === number of phase rows in roadmap.md
 *   2. ai/state.json.phaseTotal === number of ai/checkpoints/phaseNN.md files
 *   3. Every roadmap.md phase row has a matching ai/checkpoints/phaseNN.md
 *   4. ai/state.json.phase is within [0, phaseTotal]
 *   5. ai/state.json.openBlockers is non-empty only if ai/memory/known-issues.md
 *      has a non-empty "Open" section, and vice versa
 *   6. Every section id in ai/knowledge/sections.json has a matching
 *      ai/specs/<id>.md file (and vice versa) — catches orphaned/missing specs
 *      at any scale, not just today's 10 sections.
 *
 * Exit code 0 = in sync, 1 = drift detected.
 * Usage: node scripts/validate-state.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

let errors = [];

// --- Load sources ---
const state = JSON.parse(read("ai/state.json"));
const roadmap = read("ai/memory/roadmap.md");
const knownIssues = read("ai/memory/known-issues.md");
const sectionsJson = JSON.parse(read("ai/knowledge/sections.json"));

// --- 1 & 2 & 3: phase/checkpoint sync ---
const roadmapRows = [...roadmap.matchAll(/^\|\s*(\d+)\s*\|/gm)].map((m) => parseInt(m[1], 10));
const roadmapPhaseCount = roadmapRows.length;

const checkpointFiles = fs
  .readdirSync(path.join(ROOT, "ai/checkpoints"))
  .filter((f) => /^phase\d+\.md$/.test(f));
const checkpointNums = checkpointFiles
  .map((f) => parseInt(f.match(/^phase(\d+)\.md$/)[1], 10))
  .sort((a, b) => a - b);

if (state.phaseTotal !== roadmapPhaseCount) {
  errors.push(
    `[phase-count] ai/state.json phaseTotal=${state.phaseTotal} but ai/memory/roadmap.md has ${roadmapPhaseCount} phase rows`
  );
}
if (state.phaseTotal !== checkpointFiles.length) {
  errors.push(
    `[checkpoint-count] ai/state.json phaseTotal=${state.phaseTotal} but ai/checkpoints/ has ${checkpointFiles.length} phaseNN.md files`
  );
}
for (const n of roadmapRows) {
  if (!checkpointNums.includes(n)) {
    errors.push(`[missing-checkpoint] roadmap.md phase ${n} has no ai/checkpoints/phase${String(n).padStart(2, "0")}.md`);
  }
}
for (const n of checkpointNums) {
  if (!roadmapRows.includes(n)) {
    errors.push(`[orphaned-checkpoint] ai/checkpoints/phase${String(n).padStart(2, "0")}.md has no matching roadmap.md row`);
  }
}

// --- 4: phase bounds ---
if (state.phase < 0 || state.phase > state.phaseTotal) {
  errors.push(`[phase-range] ai/state.json phase=${state.phase} outside [0, ${state.phaseTotal}]`);
}

// --- 5: openBlockers vs known-issues "Open" section ---
const openSectionMatch = knownIssues.match(/##\s*Open[^\n]*\n([\s\S]*?)(\n##\s|$)/);
const openSectionHasContent =
  !!openSectionMatch && /^- /m.test(openSectionMatch[1]) && !/^None/m.test(openSectionMatch[1].trim());
const stateHasBlockers = Array.isArray(state.openBlockers) && state.openBlockers.length > 0;

if (stateHasBlockers && !openSectionHasContent) {
  errors.push(
    `[blocker-drift] ai/state.json lists openBlockers but ai/memory/known-issues.md "Open" section looks empty`
  );
}
if (!stateHasBlockers && openSectionHasContent) {
  errors.push(
    `[blocker-drift] ai/memory/known-issues.md has open items but ai/state.json.openBlockers is empty`
  );
}

// --- 6: sections.json <-> ai/specs/*.md ---
const specFiles = fs
  .readdirSync(path.join(ROOT, "ai/specs"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));
const sectionIds = sectionsJson.sections.map((s) => s.id);

for (const id of sectionIds) {
  if (!exists(`ai/specs/${id}.md`)) {
    errors.push(`[missing-spec] ai/knowledge/sections.json has section "${id}" but ai/specs/${id}.md does not exist`);
  }
}
for (const id of specFiles) {
  if (!sectionIds.includes(id)) {
    errors.push(`[orphaned-spec] ai/specs/${id}.md exists but "${id}" is not in ai/knowledge/sections.json`);
  }
}

console.log(
  `validate-state: ${roadmapPhaseCount} roadmap phases, ${checkpointFiles.length} checkpoints, ${sectionIds.length} sections, ${specFiles.length} specs checked.`
);

if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:\n`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
} else {
  console.log("OK — state.json, roadmap, checkpoints, and specs are in sync.");
  process.exit(0);
}
