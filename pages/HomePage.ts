import { type Locator, type Page } from "@playwright/test";

// The "/" route. The header nav links live here and are shared across the site.
export class HomePage {
  readonly page: Page;

  readonly signupLoginLink: Locator;
  readonly contactUsLink: Locator;
  readonly testCasesLink: Locator;
  readonly testCasesButton: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  // Only rendered in the header once a user is logged in.
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

  readonly heroHeading: Locator;

  // The Subscription box lives in the footer, so it's on every page (Home, Cart...).
  readonly subscriptionHeading: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heroHeading = page.getByRole("heading", { name: "AutomationExercise" });
    this.cartLink = page.getByRole("link", { name: " Cart" });

    this.subscriptionHeading = page.getByRole("heading", { name: "Subscription" });
    this.subscriptionEmailInput = page.getByPlaceholder("Your email address");
    this.subscribeButton = page.locator("#subscribe");
    this.subscriptionSuccessMessage = page.getByText(
      "You have been successfully subscribed!",
    );

    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.contactUsLink = page.getByRole("link", { name: " Contact us" });
    this.testCasesLink = page.getByRole("link", { name: " Test Cases" });
    this.testCasesButton = page.getByRole("button", { name: "Test Cases" });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    this.productsLink = page.getByRole("link", { name: " Products" });
  }

  async goto() {
    await this.page.goto("/");
  }

  loggedInAs(name: string): Locator {
    return this.page.getByText(`Logged in as ${name}`);
  }

  async subscribe(email: string) {
    await this.subscriptionEmailInput.fill(email);
    await this.subscribeButton.click();
  }
}
