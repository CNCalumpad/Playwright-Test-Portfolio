import { expect, type Locator, type Page } from "@playwright/test";

// This page is for the /test_cases route, which is reached by clicking the Test Cases link in the header nav.
export class TestCasesPage {
  readonly page: Page;

  readonly testCasesHeading: Locator;

  readonly testCase1Link: Locator;
  readonly testCase2Link: Locator;
  readonly testCase3Link: Locator;
  readonly testCase4Link: Locator;
  readonly testCase5Link: Locator;
  readonly testCase6Link: Locator;
  readonly testCase7Link: Locator;
  readonly testCase8Link: Locator;
  readonly testCase9Link: Locator;
  readonly testCase10Link: Locator;
  readonly testCase11Link: Locator;
  readonly testCase12Link: Locator;
  readonly testCase13Link: Locator;
  readonly testCase14Link: Locator;
  readonly testCase15Link: Locator;
  readonly testCase16Link: Locator;
  readonly testCase17Link: Locator;
  readonly testCase18Link: Locator;
  readonly testCase19Link: Locator;
  readonly testCase20Link: Locator;
  readonly testCase21Link: Locator;
  readonly testCase22Link: Locator;
  readonly testCase23Link: Locator;
  readonly testCase24Link: Locator;
  readonly testCase25Link: Locator;
  readonly testCase26Link: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: role names match case-insensitive substrings by default, which
    // also hits "Below is the list of test Cases..." and "Test Case 7: Verify
    // Test Cases Page" on this page.
    this.testCasesHeading = page.getByRole("heading", { name: "Test Cases", exact: true });

    this.testCase1Link = page.getByRole("link", { name: /^Test Case 1:/ });
    this.testCase2Link = page.getByRole("link", { name: /^Test Case 2:/ });
    this.testCase3Link = page.getByRole("link", { name: /^Test Case 3:/ });
    this.testCase4Link = page.getByRole("link", { name: /^Test Case 4:/ });
    this.testCase5Link = page.getByRole("link", { name: /^Test Case 5:/ });
    this.testCase6Link = page.getByRole("link", { name: /^Test Case 6:/ });
    this.testCase7Link = page.getByRole("link", { name: /^Test Case 7:/ });
    this.testCase8Link = page.getByRole("link", { name: /^Test Case 8:/ });
    this.testCase9Link = page.getByRole("link", { name: /^Test Case 9:/ });
    this.testCase10Link = page.getByRole("link", { name: /^Test Case 10:/ });
    this.testCase11Link = page.getByRole("link", { name: /^Test Case 11:/ });
    this.testCase12Link = page.getByRole("link", { name: /^Test Case 12:/ });
    this.testCase13Link = page.getByRole("link", { name: /^Test Case 13:/ });
    this.testCase14Link = page.getByRole("link", { name: /^Test Case 14:/ });
    this.testCase15Link = page.getByRole("link", { name: /^Test Case 15:/ });
    this.testCase16Link = page.getByRole("link", { name: /^Test Case 16:/ });
    this.testCase17Link = page.getByRole("link", { name: /^Test Case 17:/ });
    this.testCase18Link = page.getByRole("link", { name: /^Test Case 18:/ });
    this.testCase19Link = page.getByRole("link", { name: /^Test Case 19:/ });
    this.testCase20Link = page.getByRole("link", { name: /^Test Case 20:/ });
    this.testCase21Link = page.getByRole("link", { name: /^Test Case 21:/ });
    this.testCase22Link = page.getByRole("link", { name: /^Test Case 22:/ });
    this.testCase23Link = page.getByRole("link", { name: /^Test Case 23:/ });
    this.testCase24Link = page.getByRole("link", { name: /^Test Case 24:/ });
    this.testCase25Link = page.getByRole("link", { name: /^Test Case 25:/ });
    this.testCase26Link = page.getByRole("link", { name: /^Test Case 26:/ });
  }

  async verifyURLAndHeading() {
    await expect(this.page).toHaveURL(/.*test_cases/);
    await expect(this.testCasesHeading).toBeVisible();
  }
}
