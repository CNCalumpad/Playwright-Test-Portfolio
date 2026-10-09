// Reads test-results/results.json (from Playwright's "json" reporter) and:
//   1. Rewrites the SNAPSHOT block in README.md with pass/fail counts per
//      Test ID (all browsers rolled up) against the planned IDs in
//      docs/TEST_CASES.md.
//   2. Updates each test case's Status in docs/TEST_CASES.md, matched by
//      test titles that start with an ID like "TID-001: ...":
//        - "Automated" once it passes on every browser (Chromium, Firefox,
//          WebKit),
//        - "Started" if it runs but fails on any browser.
//   3. Updates the matching row's Status column in the README's own
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

// Files may be checked out with Windows (CRLF) line endings, e.g. on a
// local Windows clone. Split on either so line-anchored regexes still match,
// and write back with whichever ending the file already used.
function readLines(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return {
    lines: content.split(/\r?\n/),
    eol: content.includes("\r\n") ? "\r\n" : "\n",
  };
}

function collectSpecs(suite, specs = []) {
  if (suite.specs) specs.push(...suite.specs);
  if (suite.suites) for (const sub of suite.suites) collectSpecs(sub, specs);
  return specs;
}

// Groups every browser run by the ID (e.g. "TID-001") its test title starts
// with: Map of ID -> [{ project: "chromium", status: "expected" }, ...].
function getRunsById(results) {
  const specs = [];
  for (const suite of results.suites || []) collectSpecs(suite, specs);

  const runsById = new Map();
  for (const spec of specs) {
    const match = spec.title.match(/^([A-Za-z]+-\d+)/);
    if (!match) continue;
    const id = match[1].toUpperCase();
    if (!runsById.has(id)) runsById.set(id, []);
    for (const t of spec.tests) {
      runsById.get(id).push({ project: t.projectName, status: t.status });
    }
  }
  return runsById;
}

// Rolls every browser run up to one outcome per ID. An ID only counts as
// passed if every browser passed: any failure makes it "failed", otherwise
// any flaky run makes it "flaky", and it's "skipped" only if every run was
// skipped.
function getIdOutcomes(runsById) {
  const outcomes = new Map();
  for (const [id, runs] of runsById) {
    const statuses = runs.map((r) => r.status);
    if (statuses.includes("unexpected")) outcomes.set(id, "failed");
    else if (statuses.includes("flaky")) outcomes.set(id, "flaky");
    else if (statuses.every((s) => s === "skipped")) outcomes.set(id, "skipped");
    else outcomes.set(id, "passed");
  }
  return outcomes;
}

// Every ID documented in docs/TEST_CASES.md, minus any marked Deprecated.
function getPlannedIds() {
  const planned = new Set();
  if (!fs.existsSync(TEST_CASES_PATH)) return planned;

  let currentId = null;
  for (const line of readLines(TEST_CASES_PATH).lines) {
    const headerMatch = line.match(/^### ([A-Za-z]+-\d+):/);
    if (headerMatch) {
      currentId = headerMatch[1].toUpperCase();
      planned.add(currentId);
      continue;
    }
    const statusMatch = line.match(/^- \*\*Status:\*\* (.+)$/);
    if (statusMatch && currentId) {
      if (statusMatch[1].trim() === "Deprecated") planned.delete(currentId);
      currentId = null;
    }
  }
  return planned;
}

function formatList(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const BROWSER_LABELS = { chromium: "Chromium", firefox: "Firefox", webkit: "WebKit" };

function buildSnapshotBlock(results, idOutcomes, plannedIds) {
  const count = (outcome) =>
    [...idOutcomes.values()].filter((o) => o === outcome).length;
  const passed = count("passed");
  const failed = count("failed");
  const flaky = count("flaky");
  const skipped = count("skipped");
  const automated = idOutcomes.size;

  // Union, so an automated ID missing from the docs still counts as planned.
  const planned = new Set([...plannedIds, ...idOutcomes.keys()]).size;
  const coverage = planned ? Math.round((automated / planned) * 100) : 0;

  // Only the browsers that actually ran (e.g. not all three on a local
  // `--project chromium` run), in config order.
  const ranOn = new Set();
  for (const runs of getRunsById(results).values()) {
    for (const r of runs) ranOn.add(r.project);
  }
  const browsers = (results.config?.projects ?? [])
    .filter((p) => ranOn.has(p.name))
    .map((p) => BROWSER_LABELS[p.name] ?? p.name);
  const failedIds = [...idOutcomes]
    .filter(([, outcome]) => outcome === "failed")
    .map(([id]) => id)
    .sort();

  const durationSec = ((results.stats?.duration ?? 0) / 1000).toFixed(1);
  const timestamp = new Date().toISOString().split("T")[0];

  const lines = [
    `- **${automated} of ${planned}** planned Test IDs automated (${coverage}%).`,
    `- **${passed} passed / ${failed} failed / ${flaky} flaky / ${skipped} skipped** out of **${automated}** automated Test IDs` +
      (browsers.length ? `, each run on ${formatList(browsers)}.` : "."),
  ];
  if (failedIds.length) lines.push(`- Failing: ${failedIds.join(", ")}.`);
  lines.push(
    `- Last run duration: **${durationSec}s**.`,
    `- [View the full Playwright report](https://cncalumpad.github.io/Playwright-Test-Portfolio/) for step-by-step traces on any failure.`,
  );

  return {
    total: automated,
    passed,
    block: `${START_MARKER}
Snapshot updated: **${timestamp}**.

${lines.join("\n")}
${END_MARKER}`,
  };
}

// Decides which status each ID that ran should have:
//   - "Automated": it ran on every configured browser and every run
//     ultimately passed (a flaky run passed on retry, so it counts).
//   - "Started":   it ran, but at least one browser failed.
// Anything else (all skipped, or only some browsers ran, e.g. a local
// `--project chromium` run) isn't enough evidence either way, so those IDs
// are left out and keep whatever status they already have.
function getStatusUpdates(results, runsById) {
  const browsers = (results.config?.projects ?? []).map((p) => p.name);
  const updates = new Map();

  for (const [id, runs] of runsById) {
    if (runs.some((r) => r.status === "unexpected")) {
      updates.set(id, "Started");
      continue;
    }
    const passedOn = new Set(
      runs
        .filter((r) => r.status === "expected" || r.status === "flaky")
        .map((r) => r.project),
    );
    if (browsers.length && browsers.every((b) => passedOn.has(b))) {
      updates.set(id, "Automated");
    }
  }
  return updates;
}

// Shared by both docs/TEST_CASES.md and the README table: returns the status
// a line should change to, or null to leave it alone. Kept here once so the
// two different file formats don't drift into inconsistent matching logic.
// "Blocked" and "Deprecated" are manual calls and never touched.
const AUTO_STATUSES = ["Not Started", "Started", "Automated"];

function nextStatus(statusUpdates, id, currentStatus) {
  const current = currentStatus.trim();
  const next = statusUpdates.get(id);
  if (!next || next === current || !AUTO_STATUSES.includes(current)) return null;
  return next;
}

function updateReadmeSnapshot(readmeLines, results, idOutcomes) {
  const readme = readmeLines.join("\n");
  const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerRegex.test(readme)) {
    console.error(
      `Could not find ${START_MARKER} / ${END_MARKER} markers in README.md. Add them once, then rerun this script.`,
    );
    process.exit(1);
  }

  const { total, passed, block } = buildSnapshotBlock(
    results,
    idOutcomes,
    getPlannedIds(),
  );
  console.log(`README snapshot: ${passed}/${total} Test IDs passed.`);
  return readme.replace(markerRegex, block).split("\n");
}

// The README's "Automated Scenarios" table: markdown pipe rows like
//   | TID-002 | Login User with correct email and password | Authentication | Critical | Not Started |
// The status is always the last column before the closing pipe.
function updateReadmeTable(lines, statusUpdates) {
  let changedCount = 0;

  const updated = lines.map((line) => {
    const match = line.match(
      /^\|\s*([A-Za-z]+-\d+)\s*\|(.*)\|\s*([^|]+?)\s*\|\s*$/,
    );
    if (!match) return line;

    const [, id, middle, status] = match;
    const normalizedId = id.toUpperCase();

    const next = nextStatus(statusUpdates, normalizedId, status);
    if (next) {
      changedCount++;
      return `| ${id} |${middle}| ${next} |`;
    }
    return line;
  });

  console.log(`README table: ${changedCount} row(s) updated.`);
  return updated;
}

function updateTestCaseStatuses(statusUpdates) {
  if (!fs.existsSync(TEST_CASES_PATH)) {
    console.warn(`No docs/TEST_CASES.md found — skipping status sync.`);
    return;
  }

  const { lines, eol } = readLines(TEST_CASES_PATH);
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
      const next = nextStatus(statusUpdates, currentId, statusMatch[1]);
      if (next) {
        lines[i] = `- **Status:** ${next}`;
        changedCount++;
      }
      currentId = null; // this case's block is done once we hit its Status line
    }
  }

  fs.writeFileSync(TEST_CASES_PATH, lines.join(eol));
  console.log(
    `docs/TEST_CASES.md: ${changedCount} case(s) updated.`,
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
  const runsById = getRunsById(results);
  const idOutcomes = getIdOutcomes(runsById);
  const statusUpdates = getStatusUpdates(results, runsById);

  const readmeFile = readLines(README_PATH);
  let readmeLines = updateReadmeSnapshot(readmeFile.lines, results, idOutcomes);
  readmeLines = updateReadmeTable(readmeLines, statusUpdates);
  fs.writeFileSync(README_PATH, readmeLines.join(readmeFile.eol));

  updateTestCaseStatuses(statusUpdates);
}

main();
