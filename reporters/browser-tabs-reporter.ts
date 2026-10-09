import fs from "fs";
import path from "path";
import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";

// Customizes the built-in HTML report after it's written:
//   1. Adds Chromium / Firefox / WebKit filter buttons right beside the
//      report's own All / Passed / Failed / Flaky / Skipped buttons, styled
//      the same way. Each one drives the report's own project filter
//      (`p:<project>`), so test details, steps, and traces work as before.
//      One browser is always selected (Chromium by default), so each test
//      is listed once rather than once per browser.
//   2. Hides the per-test browser labels (the "chromium" / "firefox" /
//      "webkit" badges), since the buttons above already cover that.
//   3. In each spec file's dropdown, replaces the "file.spec.ts:line" line
//      under every test with the test.step()s it ran. Tests without any
//      test.step() keep the original line.
//
// Must be listed AFTER "html" in playwright.config.ts. The HTML reporter
// writes index.html in onEnd, and onExit only runs once every reporter's
// onEnd has finished, so the file is guaranteed to exist by then.

type ProjectStats = {
  name: string;
  total: number;
  failed: number;
};

type StepSummary = {
  title: string;
  status: "passed" | "failed";
  duration: number;
};

const MARKER = "<!-- BROWSER-TABS -->";

class BrowserTabsReporter implements Reporter {
  private reportDir = "";
  private rootSuite: Suite | undefined;
  private stats: ProjectStats[] = [];
  // Keyed by test id, which is also the report's own `testId` URL param.
  private steps: Record<string, StepSummary[]> = {};

  onBegin(config: FullConfig, suite: Suite) {
    this.rootSuite = suite;
    this.reportDir = resolveHtmlOutputDir(config);
  }

  // Called once per attempt, so on a retry the last attempt's steps win.
  onTestEnd(test: TestCase, result: TestResult) {
    this.steps[test.id] = result.steps
      .filter((step: TestStep) => step.category === "test.step")
      .map((step: TestStep) => ({
        title: step.title,
        status: step.error ? "failed" : "passed",
        duration: step.duration,
      }));
  }

  onEnd() {
    if (!this.rootSuite) return;

    // Top-level suites under the root are one per project.
    this.stats = this.rootSuite.suites.map((projectSuite) => {
      const tests = projectSuite.allTests();
      return {
        name: projectSuite.title,
        total: tests.length,
        failed: tests.filter((t) => t.outcome() === "unexpected").length,
      };
    });
  }

  onExit() {
    const indexPath = path.join(this.reportDir, "index.html");
    if (!fs.existsSync(indexPath) || this.stats.length === 0) return;

    let html = fs.readFileSync(indexPath, "utf-8");
    if (html.includes(MARKER)) return; // already injected

    if (!html.includes("</body>")) {
      console.warn(
        "browser-tabs-reporter: couldn't find </body> in the report — skipping tabs.",
      );
      return;
    }

    html = html.replace("</body>", buildInjectedMarkup(this.stats, this.steps) + "</body>");
    fs.writeFileSync(indexPath, html);
  }

  printsToStdio() {
    return false;
  }
}

function resolveHtmlOutputDir(config: FullConfig): string {
  const configDir = config.configFile
    ? path.dirname(config.configFile)
    : process.cwd();

  if (process.env.PLAYWRIGHT_HTML_OUTPUT_DIR) {
    return path.resolve(configDir, process.env.PLAYWRIGHT_HTML_OUTPUT_DIR);
  }

  const htmlEntry = config.reporter.find(([name]) => name === "html");
  const options = (htmlEntry?.[1] ?? {}) as { outputFolder?: string };
  return path.resolve(configDir, options.outputFolder ?? "playwright-report");
}

function buildInjectedMarkup(
  stats: ProjectStats[],
  steps: Record<string, StepSummary[]>,
): string {
  // `<` is escaped so a name or step title can never close the <script> early.
  const toScript = (value: unknown) =>
    JSON.stringify(value).replace(/</g, "\\u003c");

  // The report is a React app that re-renders on every navigation, so a
  // MutationObserver keeps re-attaching the browser nav, re-hiding the
  // browser labels, and re-adding step lists whenever React redraws them.
  return `${MARKER}
<style>
  #browser-tabs { margin-left: 8px; }
  #browser-tabs .label { margin: 0 8px 0 0; cursor: inherit; }
  .bt-hidden { display: none !important; }
  .bt-steps { list-style: none; margin: 4px 0 0; padding: 0; font-size: 12px; flex: 1 1 auto; width: 100%; }
  .bt-steps li { display: flex; align-items: baseline; gap: 6px; padding: 1px 0; color: var(--color-fg-muted); }
  .bt-steps .bt-icon { width: 12px; flex: none; text-align: center; font-weight: 700; }
  .bt-steps .bt-passed .bt-icon { color: var(--color-success-fg, #1a7f37); }
  .bt-steps .bt-failed .bt-icon,
  .bt-steps .bt-failed .bt-title { color: var(--color-danger-fg, #cf222e); }
  .bt-steps .bt-duration { margin-left: auto; padding-left: 12px; }
</style>
<script>
(function () {
  var stats = ${toScript(stats)};
  var stepsByTest = ${toScript(steps)};
  var names = stats.map(function (p) { return p.name; });
  var LABELS = { chromium: "Chromium", firefox: "Firefox", webkit: "WebKit" };

  function label(name) {
    return LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1);
  }

  function currentParams() {
    return new URLSearchParams(location.hash.slice(1).replace(/^\\?/, ""));
  }

  function tokens(params) {
    return (params.get("q") || "").split(/\\s+/).filter(Boolean);
  }

  function activeProject() {
    var t = tokens(currentParams());
    for (var i = 0; i < t.length; i++) {
      if (t[i].indexOf("p:") === 0) return t[i].slice(2);
    }
    return "";
  }

  function withProject(params, name) {
    var t = tokens(params).filter(function (x) { return x.indexOf("p:") !== 0; });
    t.push("p:" + name);
    params.set("q", t.join(" ") + " ");
    return "#?" + params.toString();
  }

  // Like the report's own status buttons: keep any other filters
  // (e.g. "Failed") and just swap the browser.
  function hrefFor(name) {
    var params = currentParams();
    params.delete("testId");
    params.delete("speedboard");
    return withProject(params, name);
  }

  // Exactly one browser is always selected, so each test is listed once
  // instead of once per browser. When the hash loses its browser filter
  // (first load, or the report's "All" button resetting it), put back the
  // last browser picked, starting with the first project (Chromium).
  var lastProject = names[0];
  function ensureProjectSelected() {
    var params = currentParams();
    if (params.has("testId") || params.has("speedboard")) return false;
    var active = activeProject();
    if (names.indexOf(active) !== -1) {
      lastProject = active;
      return false;
    }
    location.replace(withProject(params, lastProject));
    return true;
  }

  function formatDuration(ms) {
    return ms < 1000 ? ms + "ms" : (ms / 1000).toFixed(1) + "s";
  }

  function buildSteps(steps) {
    var list = document.createElement("ol");
    list.className = "bt-steps";
    steps.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "bt-" + s.status;
      [
        ["bt-icon", s.status === "failed" ? "✗" : "✓"],
        ["bt-title", s.title],
        ["bt-duration", formatDuration(s.duration)],
      ].forEach(function (part) {
        var span = document.createElement("span");
        span.className = part[0];
        span.textContent = part[1];
        li.appendChild(span);
      });
      list.appendChild(li);
    });
    return list;
  }

  function buildNav() {
    var nav = document.createElement("nav");
    nav.id = "browser-tabs";
    nav.setAttribute("aria-label", "Browser");
    stats.forEach(function (p, index) {
      var a = document.createElement("a");
      a.className = "subnav-item";
      a.dataset.project = p.name;
      a.style.cssText = "text-decoration: none; color: var(--color-fg-default); cursor: pointer;";
      a.title = p.failed ? p.failed + " failed" : "All passed";

      var text = document.createElement("span");
      // Same colored pill the report used for this browser's labels — it
      // colors projects by their order in the config, 6 colors in a cycle.
      text.className = "subnav-item-label label label-color-" + (index % 6);
      text.textContent = label(p.name);
      a.appendChild(text);

      var counter = document.createElement("span");
      counter.className = "d-inline counter";
      counter.textContent = p.total;
      a.appendChild(counter);

      a.addEventListener("click", function (e) {
        e.preventDefault();
        location.hash = hrefFor(p.name).slice(1);
      });
      nav.appendChild(a);
    });
    return nav;
  }

  function sync() {
    if (ensureProjectSelected()) return; // the hashchange re-runs sync
    var container = document.querySelector(".header-view-status-container");
    var nav = document.getElementById("browser-tabs");
    if (container) {
      if (!nav) nav = buildNav();
      if (nav.parentElement !== container) container.appendChild(nav);
      var active = activeProject();
      Array.prototype.forEach.call(nav.children, function (a) {
        a.setAttribute("aria-selected", String(a.dataset.project === active));
        a.href = hrefFor(a.dataset.project);
      });
    }

    // Hide the per-test browser badges (and their link wrappers).
    document.querySelectorAll(".label:not(#browser-tabs .label)").forEach(function (el) {
      if (names.indexOf(el.textContent.trim()) === -1) return;
      var target = el.closest("a") || el;
      if (!target.classList.contains("bt-hidden")) target.classList.add("bt-hidden");
    });

    // Swap each test row's "file.spec.ts:line" link for its step list.
    document.querySelectorAll(".test-file-test").forEach(function (row) {
      var details = row.querySelector(".test-file-details-row");
      var pathLink = row.querySelector(".test-file-path-link");
      if (!details || !pathLink) return;
      var match = /testId=([^&]+)/.exec(pathLink.getAttribute("href") || "");
      var steps = match && stepsByTest[decodeURIComponent(match[1])];
      if (!steps || !steps.length) return;

      var existing = details.querySelector(".bt-steps");
      if (existing && existing.dataset.testId === match[1]) return;
      if (existing) existing.remove(); // React reused this row for another test

      var list = buildSteps(steps);
      list.dataset.testId = match[1];
      details.appendChild(list);
      pathLink.classList.add("bt-hidden");
    });
  }

  var scheduled = false;
  new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;
    // setTimeout rather than requestAnimationFrame, which never fires while
    // the tab is in the background.
    setTimeout(function () { scheduled = false; sync(); }, 0);
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", sync);
  sync();
})();
</script>
`;
}

export default BrowserTabsReporter;
