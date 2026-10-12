import { test, expect } from "@playwright/test";

test("TID-013: Verify Product Quantity in Cart", async ({ page }) => {
  // Intercept ads using a list of ad domains and abort the request
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (
      url.includes("doubleclick.net") ||
      url.includes("googlesyndication.com") ||
      url.includes("adservice.google.com") ||
      url.includes("ads.pubmatic.com") ||
      url.includes("securepubads.g.doubleclick.net") ||
      url.includes("pagead2.googlesyndication.com") ||
      url.includes("ads.google.com")
    ) {
      await route.abort();
    } else {
      await route.continue();
    }
  });

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*$/);
    await expect(
      page.getByRole("heading", { name: "AutomationExercise" }),
    ).toBeVisible();
  });

  // Navigate to the Products page and verify that it loads successfully
  await test.step("Navigate to the Products page and verify that it loads successfully", async () => {
    await expect(page.getByRole("link", { name: " Products" })).toBeVisible();
    await page.getByRole("link", { name: " Products" }).click();
    await expect(page).toHaveURL(/.*\/products$/);
    await expect(
      page.getByRole("heading", { name: "All Products" }),
    ).toBeVisible();
  });

  // Click "Vew Product" on any item
  await test.step('Click "Vew Product" on any item', async () => {
    await page.getByRole("link", { name: "View Product" }).first().click();
    await expect(page).toHaveURL(/.*\/product_details\/[0-9]+$/);
  });

  // Confirm the product detail apge opens and verify that the product quantity input field is present
  await test.step("Confirm the product detail apge opens and verify that the product quantity input field is present", async () => {
    // The detail page has no "Product Details" heading — its heading is the
    // product's own name, inside the .product-information block.
    await expect(
      page.locator(".product-information").getByRole("heading", { level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("spinbutton")).toBeVisible();
  });

  // Increase the quantity to 4 and click "Add to cart" button
  await test.step('Increase the quantity to 4 and click "Add to cart" button', async () => {
    const quantityInput = page.getByRole("spinbutton");
    await quantityInput.fill("4");
    await expect(quantityInput).toHaveValue("4");
    await page.getByRole("button", { name: "Add to cart" }).click();
  });

  // Click "View Cart" button and verify that the product is displayed in the cart page with the correct quantity
  await test.step('Click "View Cart" button and verify that the product is displayed in the cart page with the correct quantity', async () => {
    await page.getByRole("link", { name: "View Cart" }).click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    const cartQuantity = page.locator(".cart_quantity");
    await expect(cartQuantity).toHaveText("4");
  });
});
