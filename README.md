# Playwright-Test-Portfolio

## Current Snapshot

<!-- SNAPSHOT:START -->
Snapshot updated: **2026-10-14**.

### UI Tests (Playwright)

- **13 of 26** planned Test IDs automated (50%).
- **13 passed / 0 failed / 0 flaky / 0 skipped** out of **13** automated Test IDs, each run on Chromium, Firefox, and WebKit.
- Last run duration: **175.9s**.
- [View the full Playwright report](https://cncalumpad.github.io/Playwright-Test-Portfolio/) for step-by-step traces on any failure.

### API Tests (Postman)

- **3 of 16** planned API Test IDs automated (19%).
- **2 passed / 1 failed / 0 flaky / 0 skipped** out of **3** automated API Test IDs, run with Postman CLI.
- Failing: API-003.
- Last run duration: **0.8s**.
- [View the full Postman report](https://cncalumpad.github.io/Playwright-Test-Portfolio/api/) for request-by-request results on any failure.
<!-- SNAPSHOT:END -->

## Automated Scenarios

Full details (steps, test data, preconditions) live in [`docs/TEST_CASES.md`](./docs/TEST_CASES.md). This table is a scannable summary of status only.

| ID | Scenario | Module | Severity | Status |
| --- | --- | --- | --- | --- |
| TID-001 | Register User | Authentication | Critical | Automated |
| TID-002 | Login User with correct email and password | Authentication | Critical | Automated |
| TID-003 | Login User with incorrect email and password | Authentication | High | Automated |
| TID-004 | Logout User | Authentication | High | Automated |
| TID-005 | Register User with existing email | Authentication | High | Automated |
| TID-006 | Contact Us Form | Contact | Medium | Automated |
| TID-007 | Verify Test Cases Page | Navigation | Low | Automated |
| TID-008 | Verify All Products and product detail page | Products | High | Automated |
| TID-009 | Search Product | Products | High | Automated |
| TID-010 | Verify Subscription in home page | Subscription | Medium | Automated |
| TID-011 | Verify Subscription in Cart page | Subscription | Medium | Automated |
| TID-012 | Add Products in Cart | Cart | Critical | Automated |
| TID-013 | Verify Product quantity in Cart | Cart | High | Automated |
| TID-014 | Place Order: Register while Checkout | Checkout | Critical | Not Started |
| TID-015 | Place Order: Register before Checkout | Checkout | Critical | Not Started |
| TID-016 | Place Order: Login before Checkout | Checkout | Critical | Not Started |
| TID-017 | Remove Products From Cart | Cart | High | Not Started |
| TID-018 | View Category Products | Products | Medium | Not Started |
| TID-019 | View & Cart Brand Products | Products | Medium | Not Started |
| TID-020 | Search Products and Verify Cart After Login | Cart | Critical | Not Started |
| TID-021 | Add review on product | Products | Medium | Not Started |
| TID-022 | Add to cart from Recommended items | Cart | Medium | Not Started |
| TID-023 | Verify address details in checkout page | Checkout | Critical | Not Started |
| TID-024 | Download Invoice after purchase order | Checkout | High | Not Started |
| TID-025 | Verify Scroll Up using 'Arrow' button and Scroll Down functionality | Navigation | Low | Not Started |
| TID-026 | Verify Scroll Up without 'Arrow' button and Scroll Down functionality | Navigation | Low | Not Started |

## Automated API Scenarios

Full details (requests, test data, expected responses) live in [`docs/API_TEST_CASES.md`](./docs/API_TEST_CASES.md). This table is a scannable summary of status only.

| ID | Scenario | Module | Severity | Status |
| --- | --- | --- | --- | --- |
| API-001 | Get All Products List | Products | High | Automated |
| API-002 | POST To All Products List | Products | Medium | Automated |
| API-003 | Get All Brands List | Brands | Medium | Started |
| API-004 | PUT To All Brands List | Brands | Medium | Not Started |
| API-005 | POST To Search Product | Search | High | Not Started |
| API-006 | POST To Search Product without search_product parameter | Search | Medium | Not Started |
| API-007 | POST To Verify Login with valid details | Authentication | Critical | Not Started |
| API-008 | POST To Verify Login without email parameter | Authentication | High | Not Started |
| API-009 | DELETE To Verify Login | Authentication | Medium | Not Started |
| API-010 | POST To Verify Login with invalid details | Authentication | High | Not Started |
| API-011 | POST To Create/Register User Account | Account | Critical | Not Started |
| API-012 | DELETE METHOD To Delete User Account | Account | Critical | Not Started |
| API-013 | PUT METHOD To Update User Account | Account | High | Not Started |
| API-014 | GET user account detail by email | Account | High | Not Started |
| API-015 | POST To Create User Account with existing email | Account | High | Not Started |
| API-016 | GET user account detail without email parameter | Account | Medium | Not Started |

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
> **Limitation:** MacOS Ventura support for Playwright browsers is discontinued on the latest versions. I've set up a script that initializes a legacy version of Playwright for this specific MacOS, to be able to perform tests. It's located under `/scripts/setup-legacy-macos.sh`

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
