// Reads test-results/results.json (from Playwright's "json" reporter) and:
//   1. Rewrites the SNAPSHOT block in README.md with real pass/fail counts.
//   2. Flips matching test cases in docs/TEST_CASES.md from "Not Started"
//      to "Automated", based on test titles that start with an ID like
//      "TID-001: ...".
//   3. Flips the matching row's Status column in the README's own
//      "Automated Scenarios" summary table the same way.
// Neither (2) nor (3) ever touches "Blocked" or "Deprecated" — those
// stay as manual calls.
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

// Shared by both docs/TEST_CASES.md and the README table: given a set of
// automated IDs and a predicate that extracts "this line's ID + current
// status", decide whether a line should flip. Kept here once so the two
// different file formats don't drift into inconsistent matching logic.
function shouldFlip(automatedIds, id, currentStatus) {
  return automatedIds.has(id) && currentStatus.trim() === "Not Started";
}

function updateReadmeSnapshot(readmeLines, stats) {
  const readme = readmeLines.join("\n");
  const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerRegex.test(readme)) {
    console.error(
      `Could not find ${START_MARKER} / ${END_MARKER} markers in README.md. Add them once, then rerun this script.`,
    );
    process.exit(1);
  }

  const { total, passed, block } = buildSnapshotBlock(stats);
  console.log(`README snapshot: ${passed}/${total} passed.`);
  return readme.replace(markerRegex, block).split("\n");
}

// The README's "Automated Scenarios" table: markdown pipe rows like
//   | TID-002 | Login User with correct email and password | Authentication | Critical | Not Started |
// The status is always the last column before the closing pipe.
function updateReadmeTable(lines, automatedIds) {
  let changedCount = 0;

  const updated = lines.map((line) => {
    const match = line.match(
      /^\|\s*([A-Za-z]+-\d+)\s*\|(.*)\|\s*([^|]+?)\s*\|\s*$/,
    );
    if (!match) return line;

    const [, id, middle, status] = match;
    const normalizedId = id.toUpperCase();

    if (shouldFlip(automatedIds, normalizedId, status)) {
      changedCount++;
      return `| ${id} |${middle}| Automated |`;
    }
    return line;
  });

  console.log(`README table: ${changedCount} row(s) flipped to Automated.`);
  return updated;
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
      if (shouldFlip(automatedIds, currentId, statusMatch[1])) {
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
  const automatedIds = getAutomatedIds(results);

  let readmeLines = fs.readFileSync(README_PATH, "utf-8").split("\n");
  readmeLines = updateReadmeSnapshot(readmeLines, stats);
  readmeLines = updateReadmeTable(readmeLines, automatedIds);
  fs.writeFileSync(README_PATH, readmeLines.join("\n"));

  updateTestCaseStatuses(automatedIds);
}

main();
