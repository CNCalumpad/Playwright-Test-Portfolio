import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";

test("TID-012: Add Products in Cart", async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(page).toHaveURL(/.*$/);
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Navigate to the Products page and verify that it loads successfully
  await test.step("Navigate to the Products page and verify that it loads successfully", async () => {
    await expect(homePage.productsLink).toBeVisible();
    await homePage.productsLink.click();
    await expect(page).toHaveURL(/.*\/products$/);
    await expect(productsPage.allProductsHeading).toBeVisible();
  });

  // Hover over product and click 'add to cart' button
  await test.step('Hover over product and click "add to cart" button', async () => {
    await productsPage.addToCartAt(0);
  });

  // Verify that the product is added to the cart successfully
  await test.step("Verify that the product is added to the cart successfully", async () => {
    await expect(productsPage.cartModalHeading).toBeVisible();
    await productsPage.continueShoppingButton.click();
    await expect(productsPage.cartModal).toBeHidden();
  });

  await test.step("Add another product to the cart and verify that it is added successfully", async () => {
    await productsPage.addToCartAt(1);
    await expect(productsPage.cartModalHeading).toBeVisible();
    await productsPage.continueShoppingButton.click();
    await expect(productsPage.cartModal).toBeHidden();
  });

  // Navigate to the cart page and verify that both products are present
  await test.step("Navigate to the cart page and verify that both products are present", async () => {
    await expect(homePage.cartLink).toBeVisible();
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.shoppingCartText).toBeVisible();
    await expect(cartPage.cartProducts).toHaveCount(2);
  });

  // Verify that the price, total quantity, and total price is correct
  await test.step("Verify that the price, total quantity, and total price is correct", async () => {
    await expect(cartPage.cartRows).toHaveCount(2);

    for (let i = 0; i < 2; i++) {
      const { price, quantity, total } = await cartPage.rowValues(i);

      expect(price).toBeGreaterThan(0);
      expect(quantity).toBe(1);
      expect(total).toBe(price * quantity);
    }
  });
});
