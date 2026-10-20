import { type Locator, type Page } from "@playwright/test";

// This is for the /delete_account route shown after clicking "Delete Account"
export class AccountDeletedPage {
  readonly page: Page;

  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountDeletedHeading = page.getByText("ACCOUNT DELETED!");
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }
}
