import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";

test("TID-013: Verify Product Quantity in Cart", async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);

  // Navigate to the home page and verify that it loads successfully
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

  // Click "View Product" on any item
  await test.step('Click "View Product" on any item', async () => {
    await productsPage.viewProductLinkAt(0).click();
    await productDetailsPage.waitForLoad();
  });

  // Confirm the product detail page opens and verify that the product quantity input field is present
  await test.step("Confirm the product detail page opens and verify that the product quantity input field is present", async () => {
    await expect(productDetailsPage.productName).toBeVisible();
    await expect(productDetailsPage.quantityInput).toBeVisible();
  });

  // Increase the quantity to 4 and click "Add to cart" button
  await test.step('Increase the quantity to 4 and click "Add to cart" button', async () => {
    await productDetailsPage.addToCart(4);
    await expect(productDetailsPage.quantityInput).toHaveValue("4");
  });

  // Click "View Cart" button and verify that the product is displayed in the cart page with the correct quantity
  await test.step('Click "View Cart" button and verify that the product is displayed in the cart page with the correct quantity', async () => {
    await productDetailsPage.viewCartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.cartQuantity).toHaveText("4");
  });
});
