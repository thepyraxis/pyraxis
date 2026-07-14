#!/usr/bin/env node
/**
 * validate-all.mjs
 *
 * Runs every validator in scripts/ and reports a combined result.
 * Intended for pre-commit hooks and .github/workflows/ci once that
 * pipeline is scaffolded (see ai/context/10-deployment.md).
 *
 * Usage: node scripts/validate-all.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const validators = ["validate-docs.mjs", "validate-state.mjs", "validate-refs.mjs"];

let failed = false;

for (const script of validators) {
  console.log(`\n--- ${script} ---`);
  const result = spawnSync("node", [path.join(ROOT, "scripts", script)], {
    stdio: "inherit",
  });
  if (result.status !== 0) failed = true;
}

console.log("\n=================================");
console.log(failed ? "validate-all: FAILED — see problems above." : "validate-all: all validators passed.");
process.exit(failed ? 1 : 0);
