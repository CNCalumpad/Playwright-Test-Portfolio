import { test, expect } from "@playwright/test";

test("TID-002: Login User", async ({ page }) => {
  // Make login unique each run by using a timestamp.

  const timestamp = Date.now();
  const name = "qatest1234";
  const uniqueEmail = `qatest1234.${timestamp}@example.com`;
  const password = "Test@1234";

  // Store the unique email and password in the test context for later use
  const testContext = { uniqueEmail, password };

  // TEST STEPS

  // Step 1-2: Launch the browser and navigate to the test site, confirm the home page loads successfully
  await page.goto("/");

  // Step 3: Click on the "Signup / Login" button

  await page.getByRole("link", { name: " Signup / Login" }).click();
  await expect(page.getByText("Login to your account")).toBeVisible();
  await expect(page.getByText("New User Signup!")).toBeVisible();

  // Repeat registration steps to create a new user to login
  await page.getByRole("textbox", { name: "Name" }).fill(name);
  await page
    .locator("form")
    .filter({ hasText: "Signup" })
    .getByPlaceholder("Email Address")
    .fill(uniqueEmail);
  await page.getByRole("button", { name: "Signup" }).click();

  // Account information form must be visible
  await expect(page.getByText("ENTER ACCOUNT INFORMATION")).toBeVisible();

  // Fill in account details
  await page.locator("#id_gender1").check(); // Title: Mr
  await page.locator("#password").fill(password);
  await page.locator("#days").selectOption("10");
  await page.locator("#months").selectOption("5");
  await page.locator("#years").selectOption("1995");

  // Newsletter + special offers checkboxes
  await page.locator("#newsletter").check();
  await page.locator("#optin").check();

  // Address details
  await page.locator("#first_name").fill("QA");
  await page.locator("#last_name").fill("Test");
  await page.locator("#company").fill("QA Company");
  await page.locator("#address1").fill("123 Test Street");
  await page.locator("#country").selectOption("United States");
  await page.locator("#state").fill("NY");
  await page.locator("#city").fill("New York");
  await page.locator("#zipcode").fill("10001");
  await page.locator("#mobile_number").fill("5555555555");

  // Create Account
  await page.locator('[data-qa="create-account"]').click();

  // Confirm account created, then Continue
  await expect(page.getByText("ACCOUNT CREATED!")).toBeVisible();
  await page.locator('[data-qa="continue-button"]').click();

  // Logout and login using the newly created credentials
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByText("Login to your account")).toBeVisible();

  // Step 5: Enter a valid email and password, then click 'Login'
  //await page.locator('[data-qa="email-address"]').fill(testContext.uniqueEmail);
  //await page.locator('[data-qa="password"]').fill(testContext.password);
  await page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address")
    .fill(testContext.uniqueEmail);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(testContext.password);
  await page.locator('[data-qa="login-button"]').click();

  // Step 6: Confirm logged in (username should be visible)
  await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

  // Step 7: Delete Account
  await expect(
    page.getByRole("link", { name: "Delete Account" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Delete Account" }).click();

  // Step 8: Confirm account deletion
  await expect(page.getByText("ACCOUNT DELETED!")).toBeVisible();
});
