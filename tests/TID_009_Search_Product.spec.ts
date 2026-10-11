import { test, expect } from "@playwright/test";

test("TID-009: Search Product", async ({ page }) => {
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

  // Navigate to the home page and search for a product
  await test.step("Navigate to the home page and click the Products button", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*$/);
  });

  await test.step("Click the Products button", async () => {
    await expect(page.getByRole("link", { name: " Products" })).toBeVisible();
    await page.getByRole("link", { name: " Products" }).click();
  });

  await test.step("Enter the product name in the search input and click the search button", async () => {
    await expect(page.getByPlaceholder("Search Product")).toBeVisible();
    await page.getByPlaceholder("Search Product").fill("Blue Top");
    await expect(page.locator("#submit_search")).toBeVisible();
    await page.locator("#submit_search").click();
  });

  // Verify that the search results are displayed
  await test.step("Verify that the search results are displayed", async () => {
    await expect(
      page.getByRole("heading", { name: "Searched Products" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: " View Product" }).first(),
    ).toBeVisible();
  });
});
