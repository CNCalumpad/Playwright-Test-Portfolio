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

  readonly dialogMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getInTouchHeading = page.getByText("GET IN TOUCH");
    this.nameField = page.getByRole("textbox", { name: "Name" });
    this.emailField = page.getByRole("textbox", { name: "Email", exact: true });
    this.subjectField = page.getByRole("textbox", { name: "Subject" });
    this.messageField = page.getByRole("textbox", { name: "Your Message Here" });

    this.chooseFileButton = page.getByRole("button", { name: "Choose File" });
    this.submitButton = page.getByRole("button", { name: "Submit" });

    this.dialogMessage = page.getByRole("alertdialog");
  }

  async chooseFile(filePath: string) {
    await this.chooseFileButton.setInputFiles(filePath);
    await this.submitButton.click();
  }

  async submitForm(name: string, email: string, subject: string, message: string) {
    await this.nameField.fill(name);
    await this.emailField.fill(email);
    await this.subjectField.fill(subject);
    await this.messageField.fill(message);
    await this.submitButton.click();
  }

  async getDialogMessage(): Promise<string> {
    const dialog = await this.page.waitForEvent("dialog");
    const message = dialog.message();
    await dialog.dismiss();
    return message;
  }

}