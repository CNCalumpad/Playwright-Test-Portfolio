import { type Locator, type Page } from "@playwright/test";

// This is for the /payment_done/<order id> route shown after paying for an order
export class PaymentDonePage {
  readonly page: Page;

  readonly orderPlacedHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly downloadInvoiceButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.orderPlacedHeading = page.locator('[data-qa="order-placed"]');
    this.confirmationMessage = page.getByText("Congratulations! Your order has been confirmed!");
    this.downloadInvoiceButton = page.getByRole("link", { name: "Download Invoice" });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }
}
