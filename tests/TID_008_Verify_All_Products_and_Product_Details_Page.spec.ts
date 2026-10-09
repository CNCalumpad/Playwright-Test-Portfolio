import { test, expect } from "@playwright/test";

test("TID-008: Verify All Products and Product Details Page", async ({
  page,
}) => {
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

  // Navigate to the home page and click the Products button
  await test.step("Navigate to the home page and click the All Products button", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*$/);
    await expect(page.getByRole("link", { name: " Products" })).toBeVisible();
    await page.getByRole("link", { name: " Products" }).click();
  });

  // Check if URL is correct and "All Products" heading is visible
  await test.step("Check that the URL is correct and the All Products heading is visible", async () => {
    await expect(page).toHaveURL(/.*products/);
    await expect(
      page.getByRole("heading", { name: "All Products", exact: true }),
    ).toBeVisible();
  });

  // Click on 'View Product' of the first product and verify that the user is redirected to the details page
  await test.step("Click on 'View Product' of the first product and verify that the user is redirected to the details page", async () => {
    await expect(
      page.getByRole("link", { name: " View Product" }).first(),
    ).toBeVisible();
    await page.getByRole("link", { name: " View Product" }).first().click();
    await expect(page).toHaveURL(/.*product_details/);
    await expect(
      page.getByRole("img", { name: "ecommerce website products" }).first(),
    ).toBeVisible();
  });

  // Verify that the product details are visible on the product details page
  await test.step("Verify that the product details are visible on the product details page", async () => {
    await expect(page.getByRole("heading", { name: "Blue Top" })).toBeVisible();
    await expect(page.getByText("Category: Women > Tops")).toBeVisible();
    await expect(page.getByText("Rs.")).toBeVisible();
    await expect(page.getByText("Availability: In Stock")).toBeVisible();
    await expect(page.getByText("Availability: In Stock")).toBeVisible();
    await expect(page.getByText("Brand: Polo")).toBeVisible();
  });
});
