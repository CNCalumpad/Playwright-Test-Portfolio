import { test, expect } from "@playwright/test";

test("TID-001: Register User", async ({ page }) => {
  // Make registration unique each run by using a timestamp.

  const timestamp = Date.now();
  const name = "qatest1234";
  const uniqueEmail = `qatest1234.${timestamp}@example.com`;
  const password = "Test@1234";

  // TEST STEPS

  // Steps 1-2: Launch and confirm home page loads
  // "/login" is the domain for both login and registration, so we can use it to confirm the home page loads.
  await page.goto("/login");
  await expect(page.getByText("New User Signup!")).toBeVisible();
});
