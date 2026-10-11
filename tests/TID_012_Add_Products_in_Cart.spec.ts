import { test, expect } from "@playwright/test";

test("TID-012: Add Products in Cart", async ({ page }) => {
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

  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*$/);
    await expect(
      page.getByRole("heading", { name: "AutomationExercise" }),
    ).toBeVisible();
  });

  // Navigate to the Products page and verify that it loads successfully
  await test.step("Navigate to the Products page and verify that it loads successfully", async () => {
    await expect(page.getByRole("link", { name: " Products" })).toBeVisible();
    await page.getByRole("link", { name: " Products" }).click();
    await expect(page).toHaveURL(/.*\/products$/);
    await expect(
      page.getByRole("heading", { name: "All Products" }),
    ).toBeVisible();
  });

  // Hover over product and click 'add to cart' button
  await test.step('Hover over product and click "add to cart" button', async () => {
    const product = page.locator(".product-image-wrapper").first();
    await product.hover();
    // Each card has two "Add to cart" buttons; target the one in the hover overlay
    const addToCart = product.locator(".product-overlay .add-to-cart");
    await expect(addToCart).toBeVisible();
    await addToCart.click();
  });

  // Verify that the product is added to the cart successfully
  await test.step("Verify that the product is added to the cart successfully", async () => {
    const modal = page.locator("#cartModal");
    await expect(modal.getByRole("heading", { name: "Added!" })).toBeVisible();
    await modal.getByRole("button", { name: "Continue Shopping" }).click();
    await expect(modal).toBeHidden();
  });

  await test.step("Add another product to the cart and verify that it is added successfully", async () => {
    const secondProduct = page.locator(".product-image-wrapper").nth(1);
    await secondProduct.hover();
    const addToCartSecond = secondProduct.locator(
      ".product-overlay .add-to-cart",
    );
    await expect(addToCartSecond).toBeVisible();
    await addToCartSecond.click();

    const modal = page.locator("#cartModal");
    await expect(modal.getByRole("heading", { name: "Added!" })).toBeVisible();
    await modal.getByRole("button", { name: "Continue Shopping" }).click();
    await expect(modal).toBeHidden();
  });

  // Navigate to the cart page and verify that both products are present
  await test.step("Navigate to the cart page and verify that both products are present", async () => {
    await expect(page.getByRole("link", { name: " Cart" })).toBeVisible();
    await page.getByRole("link", { name: " Cart" }).click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(page.getByText("Shopping Cart")).toBeVisible();
    await expect(page.locator(".cart_info .cart_product")).toHaveCount(2);
  });

  // Verify that the price, total quantity, and total price is correct
  await test.step("Verify that the price, total quantity, and total price is correct", async () => {
    // Prices are rendered like "Rs. 500"; strip everything except digits
    const toNumber = (text: string | null) =>
      Number((text ?? "").replace(/[^\d]/g, ""));

    const cartRows = page.locator(".cart_info tbody tr");
    await expect(cartRows).toHaveCount(2);

    for (const row of await cartRows.all()) {
      const price = toNumber(await row.locator(".cart_price").textContent());
      const quantity = toNumber(
        await row.locator(".cart_quantity button").textContent(),
      );
      const rowTotal = toNumber(
        await row.locator(".cart_total_price").textContent(),
      );

      expect(price).toBeGreaterThan(0);
      expect(quantity).toBe(1);
      expect(rowTotal).toBe(price * quantity);
    }
  });
});
