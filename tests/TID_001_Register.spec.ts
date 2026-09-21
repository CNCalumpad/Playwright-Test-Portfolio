import { test, expect } from "@playwright/test";

test("TID-001: Register User", async ({ page }) => {
  // Make registration unique each run by using a timestamp.

  const timestamp = Date.now();
  const name = "qatest1234";
  const uniqueEmail = `qatest1234.${timestamp}@example.com`;
  const password = "Test@1234";

  // TEST STEPS

  // Steps 1-4: Launch and confirm home page loads, check if the "New User Signup!" text is visible
  // "/login" is the domain for both login and registration, so we can use it to confirm the home page loads.
  await page.goto("/login");
  await expect(page.getByText("New User Signup!")).toBeVisible();

  // Step 5: Enter name + email in the signup form, click Signup
  await page.locator('[data-qa="signup-name"]').fill(name);
  await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
  await page.locator('[data-qa="signup-button"]').click();

  // Step 6: Confirm the account information form appeared
  await expect(page.getByText("ENTER ACCOUNT INFORMATION")).toBeVisible();

  // Step 7: Fill in account details
  await page.locator("#id_gender1").check(); // Title: Mr
  await page.locator("#password").fill(password);
  await page.locator("#days").selectOption("10");
  await page.locator("#months").selectOption("5");
  await page.locator("#years").selectOption("1995");

  // Step 8: Newsletter + special offers checkboxes
  await page.locator("#newsletter").check();
  await page.locator("#optin").check();

  // Step 9: Address details
  await page.locator("#first_name").fill("QA");
  await page.locator("#last_name").fill("Test");
  await page.locator("#company").fill("QA Company");
  await page.locator("#address1").fill("123 Test Street");
  await page.locator("#country").selectOption("United States");
  await page.locator("#state").fill("NY");
  await page.locator("#city").fill("New York");
  await page.locator("#zipcode").fill("10001");
  await page.locator("#mobile_number").fill("5555555555");

  // Step 10: Create Account
  await page.locator('[data-qa="create-account"]').click();

  // Step 11: Confirm account created, then Continue
  await expect(page.getByText("ACCOUNT CREATED!")).toBeVisible();
  await page.locator('[data-qa="continue-button"]').click();

  // Step 12: Confirm logged in
  await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

  // Step 13: Delete Account
  // Check if Delete Account button is visible before clicking it
  await expect(page.getByRole("link", { name: "Delete Account" })).toBeVisible();
  await page.getByRole("link", { name: "Delete Account" }).click();

  // Step 14: Confirm account deleted, then Continue
  await expect(page.getByText("ACCOUNT DELETED!")).toBeVisible();
});
