import { test, expect } from "../fixtures/testUser";

test("TID-002: Login User", async ({ page, testUser }) => {
  // Go to the home page and click on the "Signup / Login" link
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: " Signup / Login" }),
  ).toBeVisible();
  await page.getByRole("link", { name: " Signup / Login" }).click();
  await expect(page.getByText("Login to your account")).toBeVisible();

  // Go to the login form and fill in the email and password fields, then click the login button
  await expect(
    page
      .locator("form")
      .filter({ hasText: "Login" })
      .getByPlaceholder("Email Address"),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .fill(testUser.email);
  await page.getByRole("textbox", { name: "Password" }).fill(testUser.password);
  await page.locator('[data-qa="login-button"]').click();

  // Confirm that the user is logged in by checking for the "Logged in as [username]" text
  await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
});
