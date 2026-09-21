// Reads test-results/results.json (from Playwright's "json" reporter) and:
//   1. Rewrites the SNAPSHOT block in README.md with real pass/fail counts.
//   2. Flips matching test cases in docs/TEST_CASES.md from "Not Started"
//      to "Automated", based on test titles that start with an ID like
//      "TID-001: ...". Never touches "Blocked" or "Deprecated" — those
//      stay as manual calls.
//
// Usage:  node scripts/update-snapshot.js
// Run this right after `npx playwright test` (locally or in CI).

const fs = require("fs");
const path = require("path");

const RESULTS_PATH = path.join(__dirname, "..", "test-results", "results.json");
const README_PATH = path.join(__dirname, "..", "README.md");
const TEST_CASES_PATH = path.join(__dirname, "..", "docs", "TEST_CASES.md");
const START_MARKER = "<!-- SNAPSHOT:START -->";
const END_MARKER = "<!-- SNAPSHOT:END -->";

function collectSpecs(suite, specs = []) {
  if (suite.specs) specs.push(...suite.specs);
  if (suite.suites) for (const sub of suite.suites) collectSpecs(sub, specs);
  return specs;
}

// Pulls every ID (e.g. "TID-001") out of the JSON results' test titles.
function getAutomatedIds(results) {
  const specs = [];
  for (const suite of results.suites || []) collectSpecs(suite, specs);

  const ids = new Set();
  for (const spec of specs) {
    const match = spec.title.match(/^([A-Za-z]+-\d+)/);
    if (match) ids.add(match[1].toUpperCase());
  }
  return ids;
}

function buildSnapshotBlock(stats) {
  const passed = stats.expected ?? 0;
  const failed = stats.unexpected ?? 0;
  const flaky = stats.flaky ?? 0;
  const skipped = stats.skipped ?? 0;
  const total = passed + failed + flaky + skipped;
  const durationSec = ((stats.duration ?? 0) / 1000).toFixed(1);
  const timestamp = new Date().toISOString().split("T")[0];

  return {
    total,
    passed,
    block: `${START_MARKER}
Snapshot updated: **${timestamp}**.

- **${passed} passed / ${failed} failed / ${flaky} flaky / ${skipped} skipped** out of **${total}** automated scenarios.
- Last run duration: **${durationSec}s**.
- [View the full Playwright report](https://cncalumpad.github.io/Playwright-Test-Portfolio/) for step-by-step traces on any failure.
${END_MARKER}`,
  };
}

function updateReadmeSnapshot(stats) {
  const readme = fs.readFileSync(README_PATH, "utf-8");
  const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerRegex.test(readme)) {
    console.error(
      `Could not find ${START_MARKER} / ${END_MARKER} markers in README.md. Add them once, then rerun this script.`,
    );
    process.exit(1);
  }

  const { total, passed, block } = buildSnapshotBlock(stats);
  fs.writeFileSync(README_PATH, readme.replace(markerRegex, block));
  console.log(`README snapshot updated: ${passed}/${total} passed.`);
}

function updateTestCaseStatuses(automatedIds) {
  if (!fs.existsSync(TEST_CASES_PATH)) {
    console.warn(`No docs/TEST_CASES.md found — skipping status sync.`);
    return;
  }

  const lines = fs.readFileSync(TEST_CASES_PATH, "utf-8").split("\n");
  let currentId = null;
  let changedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const headerMatch = lines[i].match(/^### ([A-Za-z]+-\d+):/);
    if (headerMatch) {
      currentId = headerMatch[1].toUpperCase();
      continue;
    }

    const statusMatch = lines[i].match(/^- \*\*Status:\*\* (.+)$/);
    if (statusMatch && currentId) {
      const currentStatus = statusMatch[1].trim();
      if (automatedIds.has(currentId) && currentStatus === "Not Started") {
        lines[i] = "- **Status:** Automated";
        changedCount++;
      }
      currentId = null; // this case's block is done once we hit its Status line
    }
  }

  fs.writeFileSync(TEST_CASES_PATH, lines.join("\n"));
  console.log(
    `docs/TEST_CASES.md: ${changedCount} case(s) flipped to Automated.`,
  );
}

function main() {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error(
      `No results file found at ${RESULTS_PATH}. Run the tests first.`,
    );
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf-8"));
  const stats = results.stats || {};

  updateReadmeSnapshot(stats);
  updateTestCaseStatuses(getAutomatedIds(results));
}

main();
