import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";
import { AccountDeletedPage } from "../pages/AccountDeletedPage";

test("TID-001: Register User", async ({ page }) => {
  // Make registration unique each run by using a timestamp.

  const timestamp = Date.now();
  const name = "qatest1234";
  const uniqueEmail = `qatest1234.${timestamp}@example.com`;
  const password = "Test@1234";

  // Initialize the page objects
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  // TEST STEPS

  // Steps 1-4: Launch and confirm home page loads, check if the "New User Signup!" text is visible
  // "/login" is the domain for both login and registration, so we can use it to confirm the home page loads.
  await test.step("Launch browser and confirm home page loads", async () => {
    await homePage.goto();
  });

  await test.step("Check if the 'New User Signup!' text is visible", async () => {
    await homePage.signupLoginLink.click();
    await expect(loginPage.signupHeading).toBeVisible();
  });

  // Step 5: Enter name + email in the signup form, click Signup
  await test.step("Enter name + email in the signup form, click Signup", async () => {
    await expect(loginPage.signupHeading).toBeVisible();
    await expect(loginPage.signupNameInput).toBeVisible();
    await expect(loginPage.signupEmailInput).toBeVisible();
    await expect(loginPage.signupButton).toBeVisible();
    await loginPage.signupNameInput.fill(name);
    await loginPage.signupEmailInput.fill(uniqueEmail);
    await loginPage.signupButton.click();
  });

  // Step 6: Confirm the account information form appeared
  await test.step("Confirm the account information form appeared", async () => {
    await expect(registerPage.accountInfoForm).toBeVisible();
    await expect(registerPage.accountInfoHeading).toBeVisible();
  });

  // Step 7: Fill in account details
  await test.step("Fill in account details", async () => {
    await registerPage.titleMrRadio.check(); // Title: Mr.
    await registerPage.passwordInput.fill(password); // Password
    await registerPage.dayDropdown.selectOption("10");
    await registerPage.monthDropdown.selectOption("5");
    await registerPage.yearDropdown.selectOption("1995");
  });

  // Step 8: Newsletter + special offers checkboxes
  await test.step("Newsletter + special offers checkboxes", async () => {
    await registerPage.newsletterCheckbox.check();
    await registerPage.offersCheckbox.check();
  });

  // Step 9: Address details
  await test.step("Address details", async () => {
    await registerPage.firstNameInput.fill("QA");
    await registerPage.lastNameInput.fill("Test");
    await registerPage.companyInput.fill("QA Company");
    await registerPage.address1Input.fill("123 Test Street");
    await registerPage.countryDropdown.selectOption("United States");
    await registerPage.stateInput.fill("NY");
    await registerPage.cityInput.fill("New York");
    await registerPage.zipcodeInput.fill("10001");
    await registerPage.mobileNumberInput.fill("5555555555");
  });

  // Step 10: Create Account
  await test.step("Click Create Account", async () => {
    await registerPage.createAccountButton.click();
  });

  // Step 11: Confirm account created, then Continue
  await test.step("Confirm account created, then Continue", async () => {
    await expect(accountCreatedPage.accountCreatedHeading).toBeVisible();
    await accountCreatedPage.continueButton.click();
  });

  // Step 12: Confirm logged in
  await test.step("Confirm logged in", async () => {
    await expect(homePage.loggedInAs(name)).toBeVisible();
  });

  // Step 13: Delete Account
  // Check if Delete Account button is visible before clicking it
  await test.step("Delete Account", async () => {
    await expect(homePage.deleteAccountLink).toBeVisible();
    await homePage.deleteAccountLink.click();

    // Step 14: Confirm account deleted, then Continue
    await expect(accountDeletedPage.accountDeletedHeading).toBeVisible();
  });
});
