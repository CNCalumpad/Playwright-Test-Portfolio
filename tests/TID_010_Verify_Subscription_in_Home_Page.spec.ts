import { test, expect } from "@playwright/test";

test("TID-010: Verify Subscription in Home Page", async ({ page }) => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;

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

  // Scroll down to the subscription section and verify that it is visible
  await test.step("Scroll down to the subscription section and verify that it is visible", async () => {
    await page.evaluate(() => {
      window.scrollBy(1500, window.innerHeight);
    });
    await expect(
      page.getByRole("heading", { name: "Subscription" }),
    ).toBeVisible();
  });

  // Enter an email address in the subscription input and click the subscribe button
  await test.step("Enter an email address in the subscription input and click the subscribe button", async () => {
    await expect(page.getByPlaceholder("Your email address")).toBeVisible();
    await page.getByPlaceholder("Your email address").fill(uniqueEmail);
    await expect(page.locator("#subscribe")).toBeVisible();
    await page.locator("#subscribe").click();
  });

  // Verify that the subscription success message is displayed
  await test.step("Verify that the subscription success message is displayed", async () => {
    await expect(
      page.getByText("You have been successfully subscribed!"),
    ).toBeVisible();
  });
});
