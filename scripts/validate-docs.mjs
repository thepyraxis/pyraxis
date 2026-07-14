#!/usr/bin/env node
/**
 * validate-docs.mjs
 *
 * Walks every .md file in the repository and verifies:
 *   1. Every markdown link [text](path) that points at a local file resolves
 *      to a real file on disk (relative to the linking file's directory).
 *   2. Every "stable" doc (ai/context/*.md, ai/rules/*.md) ends with a
 *      "## Last Updated" section, per ai/rules/documentation.md rule #8.
 *
 * Exit code 0 = clean, 1 = problems found. No dependencies — plain Node.
 *
 * Usage: node scripts/validate-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const IGNORE_DIRS = new Set([".git", "node_modules"]);

/** @returns {string[]} absolute paths of every .md file in the repo */
function walkMarkdown(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(full, out);
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;
const STABLE_DOC_RE = /[\\/]ai[\\/](context|rules)[\\/]/;

let errors = [];
let linksChecked = 0;
let filesChecked = 0;

for (const file of walkMarkdown(ROOT)) {
  filesChecked++;
  const content = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);

  // 1. Broken relative link check
  for (const m of content.matchAll(LINK_RE)) {
    const link = m[1].split("#")[0].trim();
    if (!link || link.startsWith("http://") || link.startsWith("https://") || link.startsWith("mailto:")) continue;
    linksChecked++;
    const resolved = path.resolve(path.dirname(file), link);
    if (!fs.existsSync(resolved)) {
      errors.push(`[broken-link] ${rel} -> "${link}" (resolved: ${path.relative(ROOT, resolved)})`);
    }
  }

  // 2. Stable-doc "Last Updated" footer check
  if (STABLE_DOC_RE.test(file) && !/^##\s+Last Updated/m.test(content)) {
    errors.push(`[missing-footer] ${rel} has no "## Last Updated" section (ai/rules/documentation.md #8)`);
  }
}

console.log(`validate-docs: checked ${filesChecked} markdown files, ${linksChecked} local links.`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:\n`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
} else {
  console.log("OK — no broken links, no missing footers.");
  process.exit(0);
}
