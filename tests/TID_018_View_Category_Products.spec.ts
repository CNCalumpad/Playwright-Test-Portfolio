import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";

test("TID-018: View Category Products", async ({ page }) => {
  const homePage = new HomePage(page);
  // The category sidebar is the same on the home page and the Products page
  const productsPage = new ProductsPage(page);

  // Navigate to the home page and verify that the categories are visible on the sidebar
  await test.step("Navigate to the home page and verify that the categories are visible on the sidebar", async () => {
    await homePage.goto();
    await expect(productsPage.categoryHeading).toBeVisible();
    await expect(productsPage.categoryProducts).toBeVisible();
  });

  // Click the "Women" category, then its "Dress" sub-category
  await test.step('Click the "Women" category, then its "Dress" sub-category', async () => {
    await productsPage.categoryToggle("Women").click();
    await expect(productsPage.subCategoryLink("Women", "Dress")).toBeVisible();
    await productsPage.subCategoryLink("Women", "Dress").click();
  });

  // Verify that the category page loads with the matching heading
  await test.step("Verify that the category page loads with the matching heading", async () => {
    await expect(page).toHaveURL(/.*\/category_products\/\d+$/);
    await expect(productsPage.productListHeading).toHaveText("Women - Dress Products");
    await expect(productsPage.productNames.first()).toBeVisible();
  });

  // Click the "Men" category, then its "Tshirts" sub-category
  await test.step('Click the "Men" category, then its "Tshirts" sub-category', async () => {
    await productsPage.categoryToggle("Men").click();
    await expect(productsPage.subCategoryLink("Men", "Tshirts")).toBeVisible();
    await productsPage.subCategoryLink("Men", "Tshirts").click();
  });

  // Verify that the corresponding category page loads
  await test.step("Verify that the corresponding category page loads", async () => {
    await expect(page).toHaveURL(/.*\/category_products\/\d+$/);
    await expect(productsPage.productListHeading).toHaveText("Men - Tshirts Products");
    await expect(productsPage.productNames.first()).toBeVisible();
  });
});
