import { type Locator, type Page } from "@playwright/test";

// This is for the /view_cart route shown after clicking "Cart" in the header
export class CartPage {
  readonly page: Page;

  readonly shoppingCartText: Locator;
  readonly cartProducts: Locator;
  readonly cartRows: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    this.page = page;

    this.shoppingCartText = page.getByText("Shopping Cart");
    this.cartProducts = page.locator(".cart_info .cart_product");
    this.cartRows = page.locator(".cart_info tbody tr");
    this.cartQuantity = page.locator(".cart_quantity");
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
}
