import { test, expect } from "@playwright/test";

test("TID-003: Login User with Incorrect Credentials", async ({ page }) => {
  await page.goto("/login");
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
  await expect(page.getByText("Your email or password is incorrect!")).toBeVisible();
});
