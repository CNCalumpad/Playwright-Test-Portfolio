import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ContactUsPage } from "../pages/ContactUsPage";

test("TID-006: Contact Us Form", async ({ page }) => {
  const homePage = new HomePage(page);
  const contactUsPage = new ContactUsPage(page);

  const testName = "Test Name";
  const testEmail = "testemail123@example.com";
  const testSubject = "Test Subject";
  const testMessage = "This is a test message.";

  // Go to the page and check if the Contact Us form is present and clickable
  await test.step("Go to the page and check if the Contact Us form is present and clickable", async () => {
    await homePage.goto();
    await expect(homePage.contactUsLink).toBeVisible();
    await homePage.contactUsLink.click();
  });

  // Verify that GET IN TOUCH is visible
  await test.step("Verify that GET IN TOUCH is visible", async () => {
    await expect(contactUsPage.getInTouchHeading).toBeVisible();
  });

  // Check if the fields are present and can be filled out
  await test.step("Check if the fields are present and can be filled out", async () => {
    await expect(contactUsPage.nameField).toBeVisible();
    await expect(contactUsPage.emailField).toBeVisible();
    await expect(contactUsPage.subjectField).toBeVisible();
    await expect(contactUsPage.messageField).toBeVisible();

    await contactUsPage.nameField.fill(testName);
    await contactUsPage.emailField.fill(testEmail);
    await contactUsPage.subjectField.fill(testSubject);
    await contactUsPage.messageField.fill(testMessage);
  });

  // Try attaching a file
  await test.step("Try attaching a file", async () => {
    await expect(contactUsPage.chooseFileButton).toBeVisible();

    await contactUsPage.chooseFileButton.setInputFiles("./test_files/test.txt");
  });

  // Get dialog message and dismiss it, then submit
  await test.step("Get dialog message and dismiss it, then submit", async () => {
    await contactUsPage.getDialogMessage();
    await expect(contactUsPage.submitButton).toBeVisible();
    await contactUsPage.submitButton.click();
  });

  // Verify that the success message is visible
  await test.step("Verify that the success message is visible", async () => {
    await expect(contactUsPage.dialogMessage).toBeVisible();
    await expect(contactUsPage.dialogMessage).toHaveText(
      "Success! Your details have been submitted successfully.",
    );
  });
});
