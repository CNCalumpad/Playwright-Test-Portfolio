import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("TID-004: Logout User", async ({ page, testUser }) => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Check if homepage loads and click on Signup / Login to confirm if redirection works,
  // Verify if the "Login to your account" text is visible, then proceed to login with the test user credentials.
  await test.step("Check if homepage loads and click on Signup / Login to confirm if redirection works", async () => {
    await homePage.goto();
    await expect(homePage.signupLoginLink).toBeVisible();
    await homePage.signupLoginLink.click();
    await expect(loginPage.loginHeading).toBeVisible();
  });

  // Fill in the information via the API fixture testUser
  // Verify the Logged in user is exactly the same as the testUser name, then proceed to logout and confirm if the user is redirected to the login page.
  await test.step("Fill in the information via the API fixture testUser", async () => {
    await loginPage.login(testUser.email, testUser.password);
  });

  // Confirm that the user is logged in by checking for the "Logged in as [username]" text
  await test.step("Confirm that the user is logged in by checking for the 'Logged in as [username]' text", async () => {
    await expect(homePage.loggedInAs(testUser.name)).toBeVisible();
 });

  // Click on the Logout button and confirm if the user is redirected to the login page
  await test.step("Click on the Logout button and confirm if the user is redirected to the login page", async () => {
    await expect(homePage.logoutLink).toBeVisible();
    await homePage.logoutLink.click();
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(homePage.logoutLink).toBeHidden();
  });
});
