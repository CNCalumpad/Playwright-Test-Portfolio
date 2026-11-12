import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";

test("TID-008: Verify All Products and Product Details Page", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  // Navigate to the home page and click the Products button
  await test.step("Navigate to the home page and click the All Products button", async () => {
    await homePage.goto();
    await expect(page).toHaveURL(/.*$/);
    await expect(homePage.productsLink).toBeVisible();
    await homePage.productsLink.click();
  });

  // Check if URL is correct and "All Products" heading is visible
  await test.step("Check that the URL is correct and the All Products heading is visible", async () => {
    await expect(page).toHaveURL(/.*products/);
    await expect(productsPage.allProductsHeading).toBeVisible();
  });

  // Click on 'View Product' of the first product and verify that the user is redirected to the details page
  await test.step("Click on 'View Product' of the first product and verify that the user is redirected to the details page", async () => {
    await expect(productsPage.viewProductLinkAt(0)).toBeVisible();
    await productsPage.viewProductLinkAt(0).click();
    await expect(page).toHaveURL(/.*product_details/);
    await expect(productDetailsPage.productImage).toBeVisible();
  });

  // Verify that the product details are visible on the product details page
  await test.step("Verify that the product details are visible on the product details page", async () => {
    await expect(productDetailsPage.productName).toHaveText("Blue Top");
    await expect(productDetailsPage.category).toHaveText(
      "Category: Women > Tops",
    );
    await expect(productDetailsPage.price).toBeVisible();
    await expect(productDetailsPage.availability).toHaveText(
      "Availability: In Stock",
    );
    await expect(productDetailsPage.brand).toHaveText("Brand: Polo");
  });
});
