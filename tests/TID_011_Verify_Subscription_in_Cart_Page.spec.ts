import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test("TID-011: Verify Subscription in Cart Page", async ({ page }) => {
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);
  const uniqueEmail = `testuser_${Date.now()}@example.com`;

  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(page).toHaveURL(/.*$/);
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Navigate to the cart page and verify that it loads successfully
  await test.step("Navigate to the cart page and verify that it loads successfully", async () => {
    await expect(homePage.cartLink).toBeVisible();
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.shoppingCartText).toBeVisible();
  });

  // Scroll down to the subscription section and verify that it is visible.
  // The Subscription box is in the shared footer, so HomePage owns it.
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
