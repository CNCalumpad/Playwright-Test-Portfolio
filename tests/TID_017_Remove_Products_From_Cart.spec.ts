import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";

test("TID-017: Remove Products From Cart", async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  let productToRemove = "";
  let productToKeep = "";

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Add products to the cart
  await test.step("Add products to the cart", async () => {
    await homePage.productsLink.click();
    await expect(productsPage.allProductsHeading).toBeVisible();
    productToRemove = (await productsPage.productNames.nth(0).innerText()).trim();
    productToKeep = (await productsPage.productNames.nth(1).innerText()).trim();
    await productsPage.addToCartAndContinueShopping(0);
    await productsPage.addToCartAndContinueShopping(1);
  });

  // Click "Cart" and verify that the cart page loads
  await test.step('Click "Cart" and verify that the cart page loads', async () => {
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.shoppingCartText).toBeVisible();
    await expect(cartPage.productNames).toHaveText([productToRemove, productToKeep]);
  });

  // Click the "X" next to a product
  await test.step('Click the "X" next to a product', async () => {
    await cartPage.removeProduct(productToRemove);
  });

  // Verify that the product is removed from the cart and the other one remains
  await test.step("Verify that the product is removed from the cart", async () => {
    await expect(cartPage.rowFor(productToRemove)).toHaveCount(0);
    await expect(cartPage.productNames).toHaveText([productToKeep]);
  });
});
