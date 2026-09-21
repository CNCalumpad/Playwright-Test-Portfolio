# Playwright-Test-Portfolio

This is a Playwright Test portfolio I made to showcase my progress in upskilling in Automation Testing.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended — v18 or higher)
- npm (bundled with Node.js)
- Git

Clone the repository first, on any OS:

```bash
git clone https://github.com/CNCalumpad/Playwright-Test-Portfolio
cd <repo-folder-name>
```

Then follow the setup steps for your operating system below.

### Windows

1. **Install Node.js** from the [official installer](https://nodejs.org/) (LTS version), or via [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/):

```powershell
   winget install OpenJS.NodeJS.LTS
```

Verify the install (PowerShell or Command Prompt):

```powershell
   node -v
   npm -v
```

2. **Install project dependencies:**

```powershell
   npm install
```

3. **Install Playwright browsers:**

```powershell
   npx playwright install
```

4. **Run the tests:**

```powershell
   npx playwright test
```

### macOS

> [!NOTE]
> For macOS, I will be using macOS 13 (Ventura).

> [!WARNING]
> **Limitation:** MacOS Ventura support for Playwright browsers is discontinued on the latest versions. I've set up a script that initializes a legacy version of Playwright for this specific MacOS, to be able to perform tests. It's located under /scripts/setup-legacy-macos.sh

1. **Install Node.js** (if not already installed).
   - **Recommended:** download the LTS installer (`.pkg`) directly from [nodejs.org](https://nodejs.org/) and run it. This works regardless of your Mac's chip (Intel or Apple Silicon) and sidesteps any package-manager setup.
   - **Alternative (Apple Silicon Macs):** [Homebrew](https://brew.sh/) works fine on Ventura for Apple Silicon:

```bash
     brew install node
```

> [!IMPORTANT]
> **Alternative (Intel Macs):** Homebrew has been phasing out Intel support (downgraded as of Sept 2026, with newer installer versions blocking Intel entirely). If you hit that wall, [MacPorts](https://www.macports.org/install.php) is a working substitute, or just grab the .pkg from the Node.js download page to install it.

```bash
     sudo port install nodejs-lts
```

Verify the install (any method):

```bash
   node -v
   npm -v
```

2. **Install project dependencies:**

```bash
   npm install
```

3. **Install Playwright browsers:**

```bash
   npx playwright install
```

> On macOS you may also be prompted to install additional OS-level dependencies — Playwright will notify you if so. 4. **Run the tests:**

```bash
   npx playwright test
```

### Kubuntu / Linux

1. **Install Node.js.** Recommended via [nvm](https://github.com/nvm-sh/nvm) for easier version management:

```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   nvm install --lts
```

Verify the install:

```bash
   node -v
   npm -v
```

2. **Install project dependencies:**

```bash
   npm install
```

3. **Install Playwright browsers and OS dependencies:**

```bash
   npx playwright install --with-deps
```

> The `--with-deps` flag installs the system libraries Playwright's browsers need on Linux (this usually requires `sudo`). 4. **Run the tests:**

```bash
   npx playwright test
```

---

## Running Tests

```bash
# Run all tests headless
npx playwright test

# Run tests with the UI mode (interactive)
npx playwright test --ui

# Run a specific test file
npx playwright test tests/login.spec.ts

# Run tests in headed mode (visible browser)
npx playwright test --headed

# View the HTML report after a run
npx playwright show-report
```
