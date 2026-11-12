import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";

test("TID-019: View & Cart Brand Products", async ({ page }) => {
  // Loads five pages and adds to cart; triple the default 30s timeout.
  test.slow();

  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  let brandProduct = "";

  // Navigate to the home page and click "Products"
  await test.step('Navigate to the home page and click "Products"', async () => {
    await homePage.goto();
    await homePage.productsLink.click();
    await expect(productsPage.allProductsHeading).toBeVisible();
  });

  // Verify that the brands are visible on the sidebar
  await test.step("Verify that the brands are visible on the sidebar", async () => {
    await expect(productsPage.brandsHeading).toBeVisible();
    await expect(productsPage.brandLink("Polo")).toBeVisible();
  });

  // Click a brand name and verify that the brand page loads with its products
  await test.step("Click a brand name and verify that the brand page loads with its products", async () => {
    await productsPage.brandLink("Polo").click();
    await expect(page).toHaveURL(/.*\/brand_products\/Polo$/);
    await expect(productsPage.productListHeading).toHaveText("Brand - Polo Products");
    await expect(productsPage.productNames.first()).toBeVisible();
  });

  // Click a different brand and verify that its page loads with its products
  await test.step("Click a different brand and verify that its page loads with its products", async () => {
    await productsPage.brandLink("H&M").click();
    await expect(page).toHaveURL(/.*\/brand_products\/H&M$/);
    await expect(productsPage.productListHeading).toHaveText("Brand - H&M Products");
    await expect(productsPage.productNames.first()).toBeVisible();
  });

  // Add a product from the brand page to the cart and verify that it is in the cart
  await test.step("Add a product from the brand page to the cart and verify that it is in the cart", async () => {
    brandProduct = (await productsPage.productNames.first().innerText()).trim();
    await productsPage.addToCartAt(0);
    await expect(productsPage.cartModalHeading).toBeVisible();
    await productsPage.cartModalViewCartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.productNames).toHaveText([brandProduct]);
  });
});
