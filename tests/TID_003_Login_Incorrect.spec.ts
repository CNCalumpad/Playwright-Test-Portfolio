import { test, expect } from "@playwright/test";

test("TID-003: Login User with Incorrect Credentials", async ({ page }) => {
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
  await expect(page.getByText("Login to your account")).toBeVisible();

  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .fill("invalid@example.com");
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Password")
    .fill("invalidpassword");
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByRole("button", { name: "Login" })
    .click();
  await expect(
    page.getByText("Your email or password is incorrect!"),
  ).toBeVisible();
});
