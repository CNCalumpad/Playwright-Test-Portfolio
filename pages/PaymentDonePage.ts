import fs from "fs";
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

  // Returns the invoice's file name and text. WebKit on Linux opens a
  // text/plain file as a page instead of downloading it (even when the site
  // marks it as an attachment), so no "download" event ever fires there.
  // On WebKit, fetch the link's file with the same session instead.
  async downloadInvoice(): Promise<{ filename: string; text: string }> {
    const browserName = this.page.context().browser()?.browserType().name();

    if (browserName === "webkit") {
      const href = await this.downloadInvoiceButton.getAttribute("href");
      const response = await this.page.request.get(
        new URL(href ?? "", this.page.url()).toString(),
      );
      const disposition = response.headers()["content-disposition"] ?? "";
      const filename = /filename="?([^";]+)"?/.exec(disposition)?.[1] ?? "";
      return { filename, text: await response.text() };
    }

    const downloadPromise = this.page.waitForEvent("download");
    await this.downloadInvoiceButton.click();
    const download = await downloadPromise;
    return {
      filename: download.suggestedFilename(),
      text: fs.readFileSync(await download.path(), "utf-8"),
    };
  }
}
