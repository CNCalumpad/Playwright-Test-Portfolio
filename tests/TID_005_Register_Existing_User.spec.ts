import { test, expect } from "../fixtures/testUser";

test("TID-005: Register Existing User", async ({ page, testUser }) => {
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
