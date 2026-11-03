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
    await contactUsPage.waitForLoad();
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

  // Submit the form and accept the confirmation dialog
  await test.step("Submit the form and accept the confirmation dialog", async () => {
    await expect(contactUsPage.submitButton).toBeVisible();
    const dialogMessage = await contactUsPage.submitAndAcceptDialog();
    expect(dialogMessage).toBe("Press OK to proceed!");
  });

  // Verify that the success message is visible
  await test.step("Verify that the success message is visible", async () => {
    await expect(contactUsPage.successMessage).toBeVisible();
    await expect(contactUsPage.successMessage).toHaveText(
      "Success! Your details have been submitted successfully.",
    );
  });
});
