import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {

  const timestamp = Date.now();
  const name = "qatest1234";

  await page.goto("/");
  await page.getByRole("link", { name: " Contact us" }).click();
  await page.getByRole("textbox", { name: "Name" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("test");
  await page.getByRole("textbox", { name: "Email", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("testemail.com");
  await page.getByRole("textbox", { name: "Subject" }).click();
  await page.getByRole("textbox", { name: "Subject" }).fill("test");
  await page.getByRole("textbox", { name: "Your Message Here" }).click();
  await page.getByRole("textbox", { name: "Your Message Here" }).fill("test");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("textbox", { name: "Email", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("test@email.com");
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole("button", { name: "Submit" }).click();
});
