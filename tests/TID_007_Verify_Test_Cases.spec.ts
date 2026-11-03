import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { TestCasesPage } from "../pages/TestCasesPage";

test("TID-007: Verify Test Cases Page", async ({ page }) => {
  const homePage = new HomePage(page);
  const testCasesPage = new TestCasesPage(page);

  // Navigate to the home page and click the Test Cases link
  await test.step("Navigate to the home page and click the Test Cases link", async () => {
    await homePage.goto();
    await expect(homePage.testCasesLink).toBeVisible();
    await homePage.testCasesLink.click();
  });

  // Navigate to the home page and click the Test Cases button
  await test.step("Navigate to the home page and click the Test Cases button", async () => {
    await homePage.goto();
    await expect(homePage.testCasesButton).toBeVisible();
    await homePage.testCasesButton.click();
  });

  // Check that the URL is correct and the Test Cases heading is visible
  await test.step("Check that the URL is correct and the Test Cases heading is visible", async () => {
    await testCasesPage.verifyURLAndHeading();
  });
});
