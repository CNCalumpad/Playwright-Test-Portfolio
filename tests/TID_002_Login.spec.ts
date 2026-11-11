import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("TID-002: Login User", async ({ page, testUser }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  // Go to the home page and click on the "Signup / Login" link
  await test.step("Go to the home page and click on the 'Signup / Login'", async () => {
    await homePage.goto();
    await expect(homePage.signupLoginLink).toBeVisible();
    await homePage.signupLoginLink.click();
  });

  // Go to the login form and fill in the email and password fields, then click the login button
  await test.step("Check if login form loads, then fill in email address and password", async () => {
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toBeVisible();
    await loginPage.login(testUser.email, testUser.password);
  });

  // Confirm that the user is logged in by checking for the "Logged in as [username]" text
  await test.step("Confirm that the user is logged in by checking for the 'Logged in as [username]' text", async () => {
    await expect(homePage.loggedInAs(testUser.name)).toBeVisible();
  });
});
