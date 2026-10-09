import { test, expect } from "../fixtures/testUser";

test("TID-005: Register Existing User", async ({ page, testUser }) => {
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

  await page.goto("/");
  await page.getByRole("link", { name: " Signup / Login" }).click();
  await expect(page.getByText("New User Signup!")).toBeVisible();

  await page
    .locator("form")
    .filter({ hasText: "Signup" })
    .getByPlaceholder("Name")
    .fill(testUser.name);
  await page
    .locator("form")
    .filter({ hasText: "Signup" })
    .getByPlaceholder("Email Address")
    .fill(testUser.email);
  await page.locator('[data-qa="signup-button"]').click();

  await expect(page.getByText("Email Address already exist!")).toBeVisible();
});
