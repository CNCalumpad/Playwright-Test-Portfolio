import { type Locator, type Page } from "@playwright/test";

// The "/" route. The header nav links live here and are shared across the site.
export class HomePage {
  readonly page: Page;

  readonly signupLoginLink: Locator;
  // Only rendered in the header once a user is logged in.
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
  }

  async goto() {
    await this.page.goto("/");
  }

  loggedInAs(name: string): Locator {
    return this.page.getByText(`Logged in as ${name}`);
  }
}
