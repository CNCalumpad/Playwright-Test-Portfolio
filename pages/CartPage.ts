import { type Locator, type Page } from "@playwright/test";

// This is for the /view_cart route shown after clicking "Cart" in the header
export class CartPage {
  readonly page: Page;

  readonly shoppingCartText: Locator;
  readonly cartProducts: Locator;
  readonly cartRows: Locator;
  readonly cartQuantity: Locator;
  readonly productNames: Locator;

  readonly proceedToCheckoutButton: Locator;
  // Popup shown instead of the checkout page when no one is logged in
  readonly checkoutModal: Locator;
  readonly checkoutModalRegisterLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.shoppingCartText = page.getByText("Shopping Cart");
    this.cartProducts = page.locator(".cart_info .cart_product");
    this.cartRows = page.locator(".cart_info tbody tr");
    this.cartQuantity = page.locator(".cart_quantity");
    this.productNames = page.locator(".cart_info .cart_description h4 a");

    this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
    this.checkoutModal = page.locator("#checkoutModal");
    this.checkoutModalRegisterLoginLink = this.checkoutModal.getByRole("link", {
      name: "Register / Login",
    });
  }

  // Prices are rendered like "Rs. 500"; strip everything except digits
  private toNumber(text: string | null): number {
    return Number((text ?? "").replace(/[^\d]/g, ""));
  }

  /** Reads price, quantity and total from the cart row at the given zero-based index. */
  async rowValues(index: number) {
    const row = this.cartRows.nth(index);
    return {
      price: this.toNumber(await row.locator(".cart_price").textContent()),
      quantity: this.toNumber(
        await row.locator(".cart_quantity button").textContent(),
      ),
      total: this.toNumber(await row.locator(".cart_total_price").textContent()),
    };
  }

  /** Returns the cart row for the product with the given name. */
  rowFor(productName: string): Locator {
    return this.cartRows.filter({
      has: this.page.locator(".cart_description h4 a", { hasText: productName }),
    });
  }

  // The "X" delete buttons and "Proceed To Checkout" have no href; scripts at
  // the bottom of the page wire them up. Until those run, clicking does
  // nothing, so both actions below wait for the page to finish loading.
  private async waitForLoad() {
    await this.page.waitForURL(/.*\/view_cart$/, { waitUntil: "load" });
  }

  /** Clicks the "X" that removes the product with the given name from the cart. */
  async removeProduct(productName: string) {
    await this.waitForLoad();
    await this.rowFor(productName).locator(".cart_quantity_delete").click();
  }

  /** Clicks "Proceed To Checkout" (opens a Register / Login popup when logged out). */
  async proceedToCheckout() {
    await this.waitForLoad();
    await this.proceedToCheckoutButton.click();
  }
}
