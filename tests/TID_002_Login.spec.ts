import { test, expect } from "../fixtures/testUser";

test("TID-002: Login User", async ({ page, testUser }) => {
  await page.goto("/");
  await page.getByRole("link", { name: " Signup / Login" }).click();
  await expect(page.getByText("Login to your account")).toBeVisible();

  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .fill(testUser.email);
  await page.getByRole("textbox", { name: "Password" }).fill(testUser.password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
});
