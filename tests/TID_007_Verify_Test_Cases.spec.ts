import { test, expect } from "@playwright/test";

test("TID-007: Verify Test Cases Page", async ({ page }) => {
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

  // Navigate to the home page and click the Test Cases button
  await test.step("Navigate to the home page and click the Test Cases button", async () => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Test Cases" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Test Cases" }).click();
  });

  // Check that the URL is correct and the Test Cases heading is visible
  await test.step("Check that the URL is correct and the Test Cases heading is visible", async () => {
    await expect(page).toHaveURL(/.*test_cases/);
    await expect(
      page.getByRole("heading", { name: "Test Cases", exact: true }),
    ).toBeVisible();
  });
});
