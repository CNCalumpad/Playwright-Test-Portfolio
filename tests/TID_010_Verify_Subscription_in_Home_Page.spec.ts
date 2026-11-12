import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";

test("TID-010: Verify Subscription in Home Page", async ({ page }) => {
  const homePage = new HomePage(page);
  const uniqueEmail = `testuser_${Date.now()}@example.com`;

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(page).toHaveURL(/.*$/);
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Scroll down to the subscription section and verify that it is visible
  await test.step("Scroll down to the subscription section and verify that it is visible", async () => {
    await homePage.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionHeading).toBeVisible();
  });

  // Enter an email address in the subscription input and click the subscribe button
  await test.step("Enter an email address in the subscription input and click the subscribe button", async () => {
    await expect(homePage.subscriptionEmailInput).toBeVisible();
    await expect(homePage.subscribeButton).toBeVisible();
    await homePage.subscribe(uniqueEmail);
  });

  // Verify that the subscription success message is displayed
  await test.step("Verify that the subscription success message is displayed", async () => {
    await expect(homePage.subscriptionSuccessMessage).toBeVisible();
  });
});
