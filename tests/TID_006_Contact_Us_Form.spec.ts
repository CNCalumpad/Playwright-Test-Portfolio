import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Go to the page and check if the Contact Us form is present and clickable
  await page.goto("/");
  await page.getByRole("link", { name: " Contact us" }).click();

  // Check if fields are present and can be filled out
  await page.getByRole("textbox", { name: "Name" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("test");
  await page.getByRole("textbox", { name: "Email", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("test@gmail.com");
  await page.getByRole("textbox", { name: "Subject" }).click();
  await page.getByRole("textbox", { name: "Subject" }).fill("test");
  await page.getByRole("textbox", { name: "Your Message Here" }).click();
  await page.getByRole("textbox", { name: "Your Message Here" }).fill("test");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("textbox", { name: "Email", exact: true }).click();

  // Try attaching a file
  await page
    .getByRole("button", { name: "Choose File" })
    .setInputFiles("./test_files/test.txt");

  // Get dialog message and dismiss it, then submit
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole("button", { name: "Submit" }).click();
});
