import { type Locator, type Page } from "@playwright/test";

// This is for the /product_details/<id> route shown after clicking "View Product"
export class ProductDetailsPage {
  readonly page: Page;

  readonly productImage: Locator;
  // The page has no "Product Details" heading; its heading is the product's own name.
  readonly productName: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly availability: Locator;
  readonly brand: Locator;

  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  // Inside the "Added!" popup shown after clicking "Add to cart"
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productImage = page
      .getByRole("img", { name: "ecommerce website products" })
      .first();
    this.productName = page
      .locator(".product-information")
      .getByRole("heading", { level: 2 });
    // Each info line is a <p> like "Brand: Polo", found by its label
    const infoLine = page.locator(".product-information p");
    this.category = infoLine.filter({ hasText: "Category:" });
    this.price = page.getByText("Rs.");
    this.availability = infoLine.filter({ hasText: "Availability:" });
    this.brand = infoLine.filter({ hasText: "Brand:" });

    this.quantityInput = page.getByRole("spinbutton");
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.viewCartLink = page.getByRole("link", { name: "View Cart" });
  }

  // "Add to cart" is wired up by a script near the bottom of the page. Until
  // it runs, clicking the button does nothing, so the "Added!" popup never
  // shows. Call this after navigating here and before adding to cart.
  async waitForLoad() {
    await this.page.waitForURL(/.*\/product_details\/[0-9]+$/, {
      waitUntil: "load",
    });
  }

  async addToCart(quantity: number) {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
  }
}
