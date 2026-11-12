import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";

test("TID-021: Add review on product", async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  // Navigate to the home page and click "Products"
  await test.step('Navigate to the home page and click "Products"', async () => {
    await homePage.goto();
    await homePage.productsLink.click();
  });

  // Verify that the All Products page loads successfully
  await test.step("Verify that the All Products page loads successfully", async () => {
    await expect(page).toHaveURL(/.*\/products$/);
    await expect(productsPage.allProductsHeading).toBeVisible();
  });

  // Click "View Product" on any item
  await test.step('Click "View Product" on any item', async () => {
    await productsPage.viewProductLinkAt(0).click();
    // The review form is wired up by a script that runs on load, like "Add to cart"
    await productDetailsPage.waitForLoad();
  });

  // Verify that the "Write Your Review" form is visible
  await test.step('Verify that the "Write Your Review" form is visible', async () => {
    await expect(productDetailsPage.writeYourReviewHeading).toBeVisible();
    await expect(productDetailsPage.reviewNameInput).toBeVisible();
    await expect(productDetailsPage.reviewEmailInput).toBeVisible();
    await expect(productDetailsPage.reviewTextInput).toBeVisible();
  });

  // Enter a name, email and review, then click "Submit"
  await test.step('Enter a name, email and review, then click "Submit"', async () => {
    await productDetailsPage.submitReview(
      "QA Test",
      "qatest.review@example.com",
      "Great quality and fits as expected.",
    );
  });

  // Verify that the thank-you message is displayed
  await test.step("Verify that the thank-you message is displayed", async () => {
    await expect(productDetailsPage.reviewSuccessMessage).toBeVisible();
  });
});
