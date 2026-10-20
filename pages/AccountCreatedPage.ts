import { type Locator, type Page } from "@playwright/test";

// This is for the /account_created route shown after submitting the registration form
export class AccountCreatedPage {
  readonly page: Page;

  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountCreatedHeading = page.getByText("ACCOUNT CREATED!");
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }
}
