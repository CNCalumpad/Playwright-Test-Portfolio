import { test, expect } from "@playwright/test";

test("TID-002: Login User", async ({ page }) => {
  // TEST STEPS

  // Step 1-2: Launch the browser and navigate to the test site, confirm the home page loads successfully
  await page.goto("/");

  // Step 3: Click on the "Signup / Login" button

  await page.getByRole("link", { name: " Signup / Login" }).click();

  //playwright codegen, to be edited later
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .click();
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .fill("qatest123@example.com");
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("qatest123");
  await page.getByRole("button", { name: "Login" }).click();
});
