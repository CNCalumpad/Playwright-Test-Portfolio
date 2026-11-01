import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("TID-003: Login User with Incorrect Credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Test Steps
  // Go to the home page and click on the "Signup / Login" link
  await test.step("Go to the home page and click on the 'Signup / Login'", async () => {
    await page.goto("/");
    await expect(homePage.signupLoginLink).toBeVisible();
    await homePage.signupLoginLink.click();
  });

  // Go to the login form and fill in the email and password fields with incorrect credentials, then click the login button
  await test.step("Check if login form loads, then fill in email address and password", async () => {
    await expect(loginPage.loginHeading).toBeVisible();
    await loginPage.login("invalid@example.com", "invalidpassword");
    await expect(loginPage.loginError).toBeVisible();
  });
});
