import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { AccountDeletedPage } from "../pages/AccountDeletedPage";
import { createNewUser } from "../utils/testData";

test("TID-023: Verify address details in checkout page", async ({ page }) => {
  // Registration + checkout loads several pages; triple the default 30s timeout.
  test.slow();

  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const user = createNewUser();
  // How the checkout page lays out the address entered at registration
  const expectedAddress = [
    `Mr. ${user.firstName} ${user.lastName}`,
    user.company,
    user.address1,
    user.address2,
    `${user.city} ${user.state} ${user.zipcode}`,
    user.country,
    user.mobileNumber,
  ];

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Click "Signup / Login", fill in the signup form and create an account
  await test.step('Click "Signup / Login", fill in the signup form and create an account', async () => {
    await homePage.signupLoginLink.click();
    await expect(loginPage.signupHeading).toBeVisible();
    await loginPage.signup(user.name, user.email);
    await expect(registerPage.accountInfoHeading).toBeVisible();
    await registerPage.createAccount(user);
  });

  // Verify that the account is created, then click "Continue"
  await test.step('Verify that the account is created, then click "Continue"', async () => {
    await expect(accountCreatedPage.accountCreatedHeading).toBeVisible();
    await accountCreatedPage.continueButton.click();
  });

  // Verify that the user is logged in
  await test.step("Verify that the user is logged in", async () => {
    await expect(homePage.loggedInAs(user.name)).toBeVisible();
  });

  // Add products to the cart
  await test.step("Add products to the cart", async () => {
    await homePage.productsLink.click();
    await expect(productsPage.allProductsHeading).toBeVisible();
    await productsPage.addToCartAndContinueShopping(0);
  });

  // Click "Cart" and verify that the cart page loads
  await test.step('Click "Cart" and verify that the cart page loads', async () => {
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.shoppingCartText).toBeVisible();
  });

  // Click "Proceed To Checkout"
  await test.step('Click "Proceed To Checkout"', async () => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*\/checkout$/);
    await expect(checkoutPage.addressDetailsHeading).toBeVisible();
  });

  // Verify that the delivery address matches the address entered at registration
  await test.step("Verify that the delivery address matches the registration address", async () => {
    expect(await checkoutPage.addressLines(checkoutPage.deliveryAddress)).toEqual(expectedAddress);
  });

  // Verify that the billing address matches the address entered at registration
  await test.step("Verify that the billing address matches the registration address", async () => {
    expect(await checkoutPage.addressLines(checkoutPage.billingAddress)).toEqual(expectedAddress);
  });

  // Click "Delete Account" and verify that the account is deleted
  await test.step('Click "Delete Account" and verify that the account is deleted', async () => {
    await homePage.deleteAccountLink.click();
    await expect(accountDeletedPage.accountDeletedHeading).toBeVisible();
    await accountDeletedPage.continueButton.click();
  });
});
