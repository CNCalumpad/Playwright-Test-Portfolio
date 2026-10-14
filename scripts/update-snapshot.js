// Reads the results of the UI and API test runs and:
//   1. Rewrites the SNAPSHOT block in README.md with one section per suite:
//        - UI tests:  test-results/results.json (Playwright's "json" reporter),
//                     planned IDs from docs/TEST_CASES.md.
//        - API tests: test-results/postman-run.txt (Postman CLI console
//                     output), planned IDs from docs/API_TEST_CASES.md.
//      Counts are per Test ID, so an ID run on several browsers (or a request
//      sent several times) counts once.
//   2. Updates each test case's Status in both docs, matched by test titles /
//      request names that start with an ID like "TID-001: ..." or
//      "API-001: ...":
//        - "Automated" once it passes everywhere it has to (every browser for
//          UI tests; every request carrying that ID for API tests),
//        - "Started" if it runs but fails.
//   3. Updates the matching row's Status column in the README's summary
//      tables ("Automated Scenarios" and "Automated API Scenarios") the
//      same way.
// Neither (2) nor (3) ever touches "Blocked" or "Deprecated" — those
// stay as manual calls.
//
// Usage:  node scripts/update-snapshot.js
// Run this right after `npx playwright test` and the Postman collection run
// (locally or in CI). A missing Postman output just leaves the API statuses
// alone and says so in the snapshot.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RESULTS_PATH = path.join(ROOT, "test-results", "results.json");
const POSTMAN_OUTPUT_PATH = path.join(ROOT, "test-results", "postman-run.txt");
const README_PATH = path.join(ROOT, "README.md");
const TEST_CASES_PATH = path.join(ROOT, "docs", "TEST_CASES.md");
const API_TEST_CASES_PATH = path.join(ROOT, "docs", "API_TEST_CASES.md");
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

// ---------------------------------------------------------------------------
// UI tests (Playwright)
// ---------------------------------------------------------------------------

// Groups every browser run by the ID (e.g. "TID-001") its test title starts
// with: Map of ID -> [{ project: "chromium", status: "expected" }, ...].
function getUiRunsById(results) {
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
function getUiOutcomes(runsById) {
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

// Decides which status each UI ID that ran should have:
//   - "Automated": it ran on every configured browser and every run
//     ultimately passed (a flaky run passed on retry, so it counts).
//   - "Started":   it ran, but at least one browser failed.
// Anything else (all skipped, or only some browsers ran, e.g. a local
// `--project chromium` run) isn't enough evidence either way, so those IDs
// are left out and keep whatever status they already have.
function getUiStatusUpdates(results, runsById) {
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

const BROWSER_LABELS = { chromium: "Chromium", firefox: "Firefox", webkit: "WebKit" };

// Only the browsers that actually ran (e.g. not all three on a local
// `--project chromium` run), in config order.
function getUiBrowsers(results, runsById) {
  const ranOn = new Set();
  for (const runs of runsById.values()) {
    for (const r of runs) ranOn.add(r.project);
  }
  return (results.config?.projects ?? [])
    .filter((p) => ranOn.has(p.name))
    .map((p) => BROWSER_LABELS[p.name] ?? p.name);
}

// ---------------------------------------------------------------------------
// API tests (Postman CLI)
// ---------------------------------------------------------------------------

// Parses the console output of `postman collection run` (the CLI's report
// file option, --output, needs a Postman Enterprise plan). Each request
// prints as:
//
//   Root API-001: Get All Products List          <- header holding the name
//
//     POST https://... [200 OK, 890 B, 806 ms]   <- or "[errored]"
//     Pass  responseCode equals 405              <- passed test
//     1. fails on purpose                        <- failed test (numbered)
//
// and a summary table follows the last request. Returns a Map of
// ID -> [{ failed: boolean }, ...] (one entry per request sent with that ID)
// plus the total run duration in seconds, or null if there's no output.
const HTTP_METHOD_LINE = /^\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S/;

function getApiRun() {
  if (!fs.existsSync(POSTMAN_OUTPUT_PATH)) return null;

  const text = fs
    .readFileSync(POSTMAN_OUTPUT_PATH, "utf-8")
    .replace(/\x1b\[[0-9;]*m/g, ""); // strip terminal colors, if any
  const lines = text.split(/\r?\n/);

  const runsById = new Map();
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (HTTP_METHOD_LINE.test(line)) {
      // A saved request's name is on the closest non-empty line above.
      let j = i - 1;
      while (j >= 0 && !lines[j].trim()) j--;
      const above = j >= 0 ? lines[j] : "";
      const idMatch = above.match(/\b([A-Za-z]+-\d+):/);
      if (!idMatch) {
        // Directly under another request's tests, this is a call made from
        // that request's script (pm.sendRequest): it belongs to that request,
        // so its failures still count. Otherwise it's a request without an
        // ID, which isn't tracked.
        const isScriptCall = /^\s+(Pass\s|\d+\.\s)/.test(above);
        if (current && isScriptCall) {
          if (/\[errored\]/.test(line)) current.failed = true;
        } else {
          current = null;
        }
        continue;
      }
      const id = idMatch[1].toUpperCase();
      current = { failed: /\[errored\]/.test(line) };
      if (!runsById.has(id)) runsById.set(id, []);
      runsById.get(id).push(current);
      continue;
    }

    // The summary table (and the failure details under it) starts with a
    // line of dashes; nothing after it belongs to a request.
    if (/^\s*-{10,}/.test(line)) {
      current = null;
      continue;
    }
    if (current && /^\s+\d+\.\s/.test(line)) current.failed = true;
  }

  const durationMatch = text.match(/total run duration:\s*([\d.]+)\s*(ms|s|m)\b/);
  let durationSec = null;
  if (durationMatch) {
    const value = parseFloat(durationMatch[1]);
    const unit = durationMatch[2];
    durationSec = unit === "ms" ? value / 1000 : unit === "m" ? value * 60 : value;
  }

  return { runsById, durationSec };
}

// An ID passes only if every request carrying it passed. There's no flaky
// or skipped state in a Postman run, so those always stay at 0.
function getApiOutcomes(runsById) {
  const outcomes = new Map();
  for (const [id, runs] of runsById) {
    outcomes.set(id, runs.some((r) => r.failed) ? "failed" : "passed");
  }
  return outcomes;
}

// Same rule as the UI tests: passing -> "Automated", failing -> "Started".
function getApiStatusUpdates(outcomes) {
  const updates = new Map();
  for (const [id, outcome] of outcomes) {
    updates.set(id, outcome === "passed" ? "Automated" : "Started");
  }
  return updates;
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

// Every ID documented in a test case doc, minus any marked Deprecated.
function getPlannedIds(docPath) {
  const planned = new Set();
  if (!fs.existsSync(docPath)) return planned;

  let currentId = null;
  for (const line of readLines(docPath).lines) {
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

// The bullet lines for one suite's section of the snapshot.
//   label:      e.g. "Test IDs" or "API Test IDs"
//   ranWith:    trailing phrase for the pass/fail line, e.g.
//               ", each run on Chromium, Firefox, and WebKit"
//   extraLines: appended after the duration line (e.g. the report link)
function buildSuiteLines({ outcomes, plannedIds, label, ranWith, durationSec, extraLines = [] }) {
  const count = (outcome) =>
    [...outcomes.values()].filter((o) => o === outcome).length;
  const passed = count("passed");
  const failed = count("failed");
  const flaky = count("flaky");
  const skipped = count("skipped");
  const automated = outcomes.size;

  // Union, so an automated ID missing from the docs still counts as planned.
  const planned = new Set([...plannedIds, ...outcomes.keys()]).size;
  const coverage = planned ? Math.round((automated / planned) * 100) : 0;

  const failedIds = [...outcomes]
    .filter(([, outcome]) => outcome === "failed")
    .map(([id]) => id)
    .sort();

  const lines = [
    `- **${automated} of ${planned}** planned ${label} automated (${coverage}%).`,
    `- **${passed} passed / ${failed} failed / ${flaky} flaky / ${skipped} skipped** out of **${automated}** automated ${label}${ranWith}.`,
  ];
  if (failedIds.length) lines.push(`- Failing: ${failedIds.join(", ")}.`);
  if (durationSec !== null) {
    lines.push(`- Last run duration: **${durationSec.toFixed(1)}s**.`);
  }
  lines.push(...extraLines);

  console.log(`README snapshot: ${passed}/${automated} ${label} passed.`);
  return lines;
}

function updateReadmeSnapshot(readmeLines, uiLines, apiLines) {
  const readme = readmeLines.join("\n");
  const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerRegex.test(readme)) {
    console.error(
      `Could not find ${START_MARKER} / ${END_MARKER} markers in README.md. Add them once, then rerun this script.`,
    );
    process.exit(1);
  }

  const timestamp = new Date().toISOString().split("T")[0];
  const block = `${START_MARKER}
Snapshot updated: **${timestamp}**.

### UI Tests (Playwright)

${uiLines.join("\n")}

### API Tests (Postman)

${apiLines.join("\n")}
${END_MARKER}`;

  return readme.replace(markerRegex, block).split("\n");
}

// Shared by both test case docs and the README tables: returns the status a
// line should change to, or null to leave it alone. Kept here once so the
// different file formats don't drift into inconsistent matching logic.
// "Blocked" and "Deprecated" are manual calls and never touched.
const AUTO_STATUSES = ["Not Started", "Started", "Automated"];

function nextStatus(statusUpdates, id, currentStatus) {
  const current = currentStatus.trim();
  const next = statusUpdates.get(id);
  if (!next || next === current || !AUTO_STATUSES.includes(current)) return null;
  return next;
}

// The README's summary tables: markdown pipe rows like
//   | TID-002 | Login User with correct email and password | Authentication | Critical | Not Started |
// The status is always the last column before the closing pipe. UI and API
// IDs never collide (TID- vs API-), so one pass covers both tables.
function updateReadmeTables(lines, statusUpdates) {
  let changedCount = 0;

  const updated = lines.map((line) => {
    const match = line.match(
      /^\|\s*([A-Za-z]+-\d+)\s*\|(.*)\|\s*([^|]+?)\s*\|\s*$/,
    );
    if (!match) return line;

    const [, id, middle, status] = match;
    const next = nextStatus(statusUpdates, id.toUpperCase(), status);
    if (next) {
      changedCount++;
      return `| ${id} |${middle}| ${next} |`;
    }
    return line;
  });

  console.log(`README tables: ${changedCount} row(s) updated.`);
  return updated;
}

function updateTestCaseStatuses(docPath, statusUpdates) {
  const docName = path.relative(ROOT, docPath).replace(/\\/g, "/");
  if (!fs.existsSync(docPath)) {
    console.warn(`No ${docName} found — skipping status sync.`);
    return;
  }

  const { lines, eol } = readLines(docPath);
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

  fs.writeFileSync(docPath, lines.join(eol));
  console.log(`${docName}: ${changedCount} case(s) updated.`);
}

function main() {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error(
      `No results file found at ${RESULTS_PATH}. Run the tests first.`,
    );
    process.exit(1);
  }

  // UI
  const results = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf-8"));
  const uiRunsById = getUiRunsById(results);
  const uiOutcomes = getUiOutcomes(uiRunsById);
  const uiStatusUpdates = getUiStatusUpdates(results, uiRunsById);
  const browsers = getUiBrowsers(results, uiRunsById);
  const uiLines = buildSuiteLines({
    outcomes: uiOutcomes,
    plannedIds: getPlannedIds(TEST_CASES_PATH),
    label: "Test IDs",
    ranWith: browsers.length ? `, each run on ${formatList(browsers)}` : "",
    durationSec: (results.stats?.duration ?? 0) / 1000,
    extraLines: [
      `- [View the full Playwright report](https://cncalumpad.github.io/Playwright-Test-Portfolio/) for step-by-step traces on any failure.`,
    ],
  });

  // API
  const apiRun = getApiRun();
  const apiOutcomes = apiRun ? getApiOutcomes(apiRun.runsById) : new Map();
  const apiStatusUpdates = getApiStatusUpdates(apiOutcomes);
  const apiLines = apiRun
    ? buildSuiteLines({
        outcomes: apiOutcomes,
        plannedIds: getPlannedIds(API_TEST_CASES_PATH),
        label: "API Test IDs",
        ranWith: ", run with Postman CLI",
        durationSec: apiRun.durationSec,
      })
    : ["- No API test results from this run."];
  if (!apiRun) console.log("README snapshot: no Postman output found.");

  // UI and API IDs never collide, so one map covers both tables and docs.
  const statusUpdates = new Map([...uiStatusUpdates, ...apiStatusUpdates]);

  const readmeFile = readLines(README_PATH);
  let readmeLines = updateReadmeSnapshot(readmeFile.lines, uiLines, apiLines);
  readmeLines = updateReadmeTables(readmeLines, statusUpdates);
  fs.writeFileSync(README_PATH, readmeLines.join(readmeFile.eol));

  updateTestCaseStatuses(TEST_CASES_PATH, uiStatusUpdates);
  updateTestCaseStatuses(API_TEST_CASES_PATH, apiStatusUpdates);
}

main();
