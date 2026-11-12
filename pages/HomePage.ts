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
  readonly heroText: Locator;

  // Fixed arrow in the bottom-right corner, shown once the page is scrolled down
  readonly scrollUpButton: Locator;

  readonly recommendedItemsHeading: Locator;
  // Only the cards on the carousel's current slide are visible and clickable
  readonly visibleRecommendedItems: Locator;

  // The "Added!" popup shown after clicking "Add to cart"
  readonly cartModalViewCartLink: Locator;

  // The Subscription box lives in the footer, so it's on every page (Home, Cart...).
  readonly subscriptionHeading: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Every carousel slide repeats the hero heading and text. Only the current
    // slide's copy is visible, except mid-transition when two can be, so take
    // the first visible one.
    this.heroHeading = page
      .getByRole("heading", { name: "AutomationExercise" })
      .filter({ visible: true })
      .first();
    this.heroText = page
      .getByRole("heading", { name: "Full-Fledged practice website for Automation Engineers" })
      .filter({ visible: true })
      .first();

    this.scrollUpButton = page.locator("#scrollUp");

    this.recommendedItemsHeading = page.getByRole("heading", { name: "recommended items" });
    this.visibleRecommendedItems = page
      .locator("#recommended-item-carousel .item.active .productinfo");

    this.cartModalViewCartLink = page
      .locator("#cartModal")
      .getByRole("link", { name: "View Cart" });
    // Scoped to the header nav: on its own, a name match for "Cart" also hits
    // the "Added!" popup's "View Cart" link.
    this.cartLink = page.locator(".shop-menu").getByRole("link", { name: "Cart" });

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

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scrolls back to the top with the keyboard's Home key, like a user would,
   * instead of the arrow button. (The mouse wheel works too, but browsers cap
   * how far each wheel movement scrolls, so it's slow and unreliable on a
   * page this long, especially in Firefox.)
   */
  async scrollToTopManually() {
    await this.page.keyboard.press("Home");
  }

  /**
   * Clicks "Add to cart" on a recommended item on the carousel's current
   * slide and returns that product's name. The carousel rotates on its own,
   * so the click targets that product's id rather than "the nth visible
   * card", which could be a different product by the time it's clicked.
   */
  async addRecommendedItemToCart(index: number): Promise<string> {
    const item = this.visibleRecommendedItems.nth(index);
    const name = (await item.locator("p").innerText()).trim();
    const productId = await item.locator(".add-to-cart").getAttribute("data-product-id");
    await this.page
      .locator(`#recommended-item-carousel .add-to-cart[data-product-id="${productId}"]`)
      .filter({ visible: true })
      .click();
    return name;
  }

  async subscribe(email: string) {
    await this.subscriptionEmailInput.fill(email);
    await this.subscribeButton.click();
  }
}
