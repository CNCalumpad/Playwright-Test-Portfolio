import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";

test("TID-009: Search Product", async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);

  // Navigate to the home page and search for a product
  await test.step("Navigate to the home page and check if the URL is correct", async () => {
    await homePage.goto();
    await expect(page).toHaveURL(/.*$/);
  });

  await test.step("Click the Products button", async () => {
    await expect(homePage.productsLink).toBeVisible();
    await homePage.productsLink.click();
  });

  await test.step("Enter the product name in the search input and click the search button", async () => {
    await expect(productsPage.searchInput).toBeVisible();
    await expect(productsPage.searchButton).toBeVisible();
    await expect(productsPage.allProductsHeading).toBeVisible();
    await productsPage.searchInput.fill("Blue Top");
    await productsPage.searchButton.click();
  });

  // Verify that the search results are displayed
  await test.step("Verify that the search results are displayed", async () => {
    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(productsPage.viewProductLinkFor("Blue Top")).toBeVisible();
  });
});
