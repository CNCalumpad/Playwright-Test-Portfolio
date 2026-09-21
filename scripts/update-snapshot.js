// Reads test-results/results.json (from Playwright's "json" reporter) and
// rewrites the block in README.md between the SNAPSHOT markers.
//
// Usage:  node scripts/update-snapshot.js
// Run this right after `npx playwright test` (locally or in CI).

const fs = require("fs");
const path = require("path");

const RESULTS_PATH = path.join(__dirname, "..", "test-results", "results.json");
const README_PATH = path.join(__dirname, "..", "README.md");
const START_MARKER = "<!-- SNAPSHOT:START -->";
const END_MARKER = "<!-- SNAPSHOT:END -->";

function main() {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error(
      `No results file found at ${RESULTS_PATH}. Run the tests first.`,
    );
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf-8"));
  const stats = results.stats || {};

  const passed = stats.expected ?? 0;
  const failed = stats.unexpected ?? 0;
  const flaky = stats.flaky ?? 0;
  const skipped = stats.skipped ?? 0;
  const total = passed + failed + flaky + skipped;
  const durationSec = ((stats.duration ?? 0) / 1000).toFixed(1);
  const timestamp = new Date().toISOString().split("T")[0];

  const snapshotBlock = `${START_MARKER}
Snapshot updated: **${timestamp}**.

- **${passed} passed / ${failed} failed / ${flaky} flaky / ${skipped} skipped** out of **${total}** automated scenarios.
- Last run duration: **${durationSec}s**.
- [View the full Playwright report](#) for step-by-step traces on any failure.
${END_MARKER}`;

  const readme = fs.readFileSync(README_PATH, "utf-8");
  const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerRegex.test(readme)) {
    console.error(
      `Could not find ${START_MARKER} / ${END_MARKER} markers in README.md. Add them once, then rerun this script.`,
    );
    process.exit(1);
  }

  const updatedReadme = readme.replace(markerRegex, snapshotBlock);
  fs.writeFileSync(README_PATH, updatedReadme);
  console.log(`README snapshot updated: ${passed}/${total} passed.`);
}

main();
