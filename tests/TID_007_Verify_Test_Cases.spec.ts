import { test, expect } from "@playwright/test";

test("TID-007: Verify Test Cases Page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Test Cases" })).toBeVisible();
  await page.getByRole("button", { name: "Test Cases" }).click();
  await expect(page).toHaveURL(/.*test_cases/);
  await expect(page.getByRole("heading", { name: "Test Cases" })).toBeVisible();
});
