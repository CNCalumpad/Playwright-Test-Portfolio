import { type Locator, type Page } from "@playwright/test";

// This is for the /contact_us route shown after clicking "Contact Us"
export class ContactUsPage {
  readonly page: Page;

  readonly getInTouchHeading: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly subjectField: Locator;
  readonly messageField: Locator;

  readonly chooseFileButton: Locator;
  readonly submitButton: Locator;

  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getInTouchHeading = page.getByText("GET IN TOUCH");
    this.nameField = page.getByRole("textbox", { name: "Name" });
    this.emailField = page.getByRole("textbox", { name: "Email", exact: true });
    this.subjectField = page.getByRole("textbox", { name: "Subject" });
    this.messageField = page.getByRole("textbox", {
      name: "Your Message Here",
    });

    this.chooseFileButton = page.getByRole("button", { name: "Choose File" });
    this.submitButton = page.getByRole("button", { name: "Submit" });

    // Shown on the page after the form submits. It's a plain <div>, not a
    // browser dialog and not an ARIA alert, so it's located by its class.
    this.successMessage = page.locator(".status.alert-success");
  }

  async chooseFile(filePath: string) {
    await this.chooseFileButton.setInputFiles(filePath);
  }

  async submitForm(
    name: string,
    email: string,
    subject: string,
    message: string,
  ) {
    await this.nameField.fill(name);
    await this.emailField.fill(email);
    await this.subjectField.fill(subject);
    await this.messageField.fill(message);
    await this.submitAndAcceptDialog();
  }

  // The form's confirm dialog is wired up by an inline script at the very
  // bottom of the page, after several slow scripts (Google Maps among them).
  // Until it runs, Submit posts the form natively with no dialog, so call
  // this after navigating here and before submitting.
  async waitForLoad() {
    await this.page.waitForURL("**/contact_us", {
      waitUntil: "domcontentloaded",
    });
  }

  // Clicking Submit opens a "Press OK to proceed!" confirm dialog, and the form
  // only submits once it's accepted (dismissing it is pressing Cancel). The
  // dialog wait starts before the click, because the dialog only appears
  // after it, and gives up after 10s instead of hanging until the test
  // timeout. Returns the dialog's message.
  async submitAndAcceptDialog(): Promise<string> {
    const [message] = await Promise.all([
      this.page
        .waitForEvent("dialog", { timeout: 10_000 })
        .then(async (dialog) => {
          const message = dialog.message();
          await dialog.accept();
          return message;
        }),
      this.submitButton.click(),
    ]);
    return message;
  }
}
