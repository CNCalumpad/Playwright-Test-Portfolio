import { test, expect } from "@playwright/test";

test("TID-006: Contact Us Form", async ({ page }) => {
  // Intercept ads using a list of ad domains and abort the request
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (
      url.includes("doubleclick.net") ||
      url.includes("googlesyndication.com") ||
      url.includes("adservice.google.com") ||
      url.includes("ads.pubmatic.com") ||
      url.includes("securepubads.g.doubleclick.net") ||
      url.includes("pagead2.googlesyndication.com") ||
      url.includes("ads.google.com")
    ) {
      await route.abort();
    } else {
      await route.continue();
    }
  });

  // Go to the page and check if the Contact Us form is present and clickable
  await page.goto("/");
  await page.getByRole("link", { name: " Contact us" }).click();

  // Verify that GET IN TOUCH is visible
  await expect(page.getByText("GET IN TOUCH")).toBeVisible();

  // Check if fields are present and can be filled out
  await page.getByRole("textbox", { name: "Name" }).fill("test");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("test@gmail.com");
  await page.getByRole("textbox", { name: "Subject" }).fill("test");
  await page.getByRole("textbox", { name: "Your Message Here" }).fill("test");

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
