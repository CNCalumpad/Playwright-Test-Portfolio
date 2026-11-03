import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

test("TID-005: Register Existing User", async ({ page, testUser }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  // Test Steps
  // Go to the home page and click on the "Signup / Login" link
  await test.step("Go to the home page and click on the 'Signup / Login'", async () => {
    await homePage.goto();
    await expect(homePage.signupLoginLink).toBeVisible();
    await homePage.signupLoginLink.click();
    await expect(loginPage.signupHeading).toBeVisible();
  });

  // Go to the signup form and fill in the name and email fields with existing user credentials, then click the signup button
  await test.step("Go to the signup form and fill in the name and email fields with existing user credentials, then click the signup button", async () => {
    await loginPage.signup(testUser.name, testUser.email);
  });

  await test.step("Confirm that the error message 'Email Address already exist!' is visible", async () => {
    await expect(loginPage.signupError).toBeVisible();
  });
});
