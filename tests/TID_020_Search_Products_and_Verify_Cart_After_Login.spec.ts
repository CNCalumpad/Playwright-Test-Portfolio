import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";

test("TID-020: Search Products and Verify Cart After Login", async ({ page, testUser }) => {
  // Adds every search result to the cart and logs in; triple the default 30s timeout.
  test.slow();

  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const loginPage = new LoginPage(page);

  const searchTerm = "Jeans";
  let searchResults: string[] = [];

  // Navigate to the home page and click "Products"
  await test.step('Navigate to the home page and click "Products"', async () => {
    await homePage.goto();
    await homePage.productsLink.click();
  });

  // Verify that the All Products page loads successfully
  await test.step("Verify that the All Products page loads successfully", async () => {
    await expect(page).toHaveURL(/.*\/products$/);
    await expect(productsPage.allProductsHeading).toBeVisible();
  });

  // Enter a product name in the search input and click search
  await test.step("Enter a product name in the search input and click search", async () => {
    await productsPage.search(searchTerm);
    await expect(productsPage.searchedProductsHeading).toBeVisible();
  });

  // Verify that the search results are relevant
  await test.step("Verify that the search results are relevant", async () => {
    await expect(productsPage.productNames.first()).toBeVisible();
    searchResults = (await productsPage.productNames.allInnerTexts()).map((n) => n.trim());
    for (const name of searchResults) {
      expect(name.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  // Add the search results to the cart
  await test.step("Add the search results to the cart", async () => {
    for (let i = 0; i < searchResults.length; i++) {
      await productsPage.addToCartAndContinueShopping(i);
    }
  });

  // Click "Cart" and verify that the products are visible
  await test.step('Click "Cart" and verify that the products are visible', async () => {
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.productNames).toHaveText(searchResults);
  });

  // Log in via "Signup / Login"
  // (the account is created beforehand through the API by the testUser fixture)
  await test.step('Log in via "Signup / Login"', async () => {
    await homePage.signupLoginLink.click();
    await expect(loginPage.loginHeading).toBeVisible();
    await loginPage.login(testUser.email, testUser.password);
    await expect(homePage.loggedInAs(testUser.name)).toBeVisible();
  });

  // Go back to the cart and verify that the products are still there after login
  await test.step("Go back to the cart and verify that the products are still there after login", async () => {
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.productNames).toHaveText(searchResults);
  });
});
