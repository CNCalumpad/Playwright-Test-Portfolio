import { test, expect } from "../fixtures/testUser";

test("TID-004: Logout User", async ({ page, testUser }) => {
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

  // Check if homepage loads and click on Signup / Login to confirm if redirection works,
  // Verify if the "Login to your account" text is visible, then proceed to login with the test user credentials.
  await page.goto("/");
  await page.getByRole("link", { name: " Signup / Login" }).click();
  await expect(page.getByText("Login to your account")).toBeVisible();

  // Fill in the information via the API fixture testUser
  // Verify the Logged in user is exactly the same as the testUser name, then proceed to logout and confirm if the user is redirected to the login page.
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .fill(testUser.email);
  await page.getByRole("textbox", { name: "Password" }).fill(testUser.password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();

  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByText("Login to your account")).toBeVisible();
});
