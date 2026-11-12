import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test("TID-022: Add to cart from Recommended items", async ({ page }) => {
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);

  let recommendedProduct = "";

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Scroll to the bottom of the page
  await test.step("Scroll to the bottom of the page", async () => {
    await homePage.scrollToBottom();
  });

  // Verify that the "recommended items" section is visible
  await test.step('Verify that the "recommended items" section is visible', async () => {
    await expect(homePage.recommendedItemsHeading).toBeVisible();
    await expect(homePage.visibleRecommendedItems.first()).toBeVisible();
  });

  // Click "Add To Cart" on a recommended product
  await test.step('Click "Add To Cart" on a recommended product', async () => {
    recommendedProduct = await homePage.addRecommendedItemToCart(0);
  });

  // Click "View Cart"
  await test.step('Click "View Cart"', async () => {
    await expect(homePage.cartModalViewCartLink).toBeVisible();
    await homePage.cartModalViewCartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
  });

  // Verify that the product is displayed in the cart
  await test.step("Verify that the product is displayed in the cart", async () => {
    await expect(cartPage.productNames).toHaveText([recommendedProduct]);
  });
});
