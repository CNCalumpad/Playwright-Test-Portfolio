import { type Locator, type Page } from "@playwright/test";

// This is for the /checkout route shown after clicking "Proceed To Checkout"
// in the cart while logged in.
export class CheckoutPage {
  readonly page: Page;

  readonly addressDetailsHeading: Locator;
  readonly reviewOrderHeading: Locator;

  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;

  readonly orderProducts: Locator;
  readonly orderCommentInput: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addressDetailsHeading = page.getByRole("heading", { name: "Address Details" });
    this.reviewOrderHeading = page.getByRole("heading", { name: "Review Your Order" });

    this.deliveryAddress = page.locator("#address_delivery");
    this.billingAddress = page.locator("#address_invoice");

    this.orderProducts = page.locator("#cart_info tbody tr[id^='product-']");
    this.orderCommentInput = page.locator("#ordermsg textarea");
    this.placeOrderButton = page.getByRole("link", { name: "Place Order" });
  }

  /**
   * Returns an address box's lines, without its "Your ... address" title.
   * e.g. ["Mr. QA Test", "QA Company", "123 Test Street", "Suite 4",
   *       "New York NY 10001", "United States", "5555555555"]
   */
  async addressLines(address: Locator): Promise<string[]> {
    const lines = await address.locator("li:not(.address_title)").allInnerTexts();
    return lines.map((line) => line.trim());
  }

  async placeOrder(comment: string) {
    await this.orderCommentInput.fill(comment);
    await this.placeOrderButton.click();
  }
}
