import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";

test("TID-026: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async ({ page }) => {
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

  // Manually scroll back up to the top, without the arrow button
  await test.step("Manually scroll back up to the top", async () => {
    await homePage.scrollToTopManually();
  });

  // Verify that the page returns to the top and the header text is visible
  await test.step("Verify that the page returns to the top and the header text is visible", async () => {
    await expect(homePage.heroText).toBeInViewport();
    await expect(homePage.subscriptionHeading).not.toBeInViewport();
  });
});
