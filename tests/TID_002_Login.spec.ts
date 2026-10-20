import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/LoginPage";

test("TID-002: Login User", async ({ page, testUser }) => {
  const loginPage = new LoginPage(page);

  // Go to the home page and click on the "Signup / Login" link
  await test.step("Go to the home page and click on the 'Signup / Login'", async () => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: " Signup / Login" }),
    ).toBeVisible();
    await page.getByRole("link", { name: " Signup / Login" }).click();
    await expect(loginPage.loginHeading).toBeVisible();
  });

  // Go to the login form and fill in the email and password fields, then click the login button
  await test.step("Check if login form loads, then fill in email address and password", async () => {
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toBeVisible();
    await loginPage.login(testUser.email, testUser.password);
  });

  // Confirm that the user is logged in by checking for the "Logged in as [username]" text
  await test.step("Confirm that the user is logged in by checking for the 'Logged in as [username]' text", async () => {
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
  });
});
