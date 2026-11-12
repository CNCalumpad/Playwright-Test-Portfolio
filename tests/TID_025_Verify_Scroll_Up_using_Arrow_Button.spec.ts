import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";

test("TID-025: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({ page }) => {
  const homePage = new HomePage(page);

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.heroText).toBeInViewport();
  });

  // Scroll down to the bottom of the page
  await test.step("Scroll down to the bottom of the page", async () => {
    await homePage.scrollToBottom();
  });

  // Verify that the "Subscription" section is visible
  await test.step('Verify that the "Subscription" section is visible', async () => {
    await expect(homePage.subscriptionHeading).toBeInViewport();
    await expect(homePage.heroText).not.toBeInViewport();
  });

  // Click the scroll-to-top arrow button
  await test.step("Click the scroll-to-top arrow button", async () => {
    await expect(homePage.scrollUpButton).toBeVisible();
    await homePage.scrollUpButton.click();
  });

  // Verify that the page scrolls back to the top and the header text is visible
  await test.step("Verify that the page scrolls back to the top and the header text is visible", async () => {
    await expect(homePage.heroText).toBeInViewport();
    await expect(homePage.subscriptionHeading).not.toBeInViewport();
  });
});
