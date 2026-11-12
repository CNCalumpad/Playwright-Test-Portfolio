import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
import { PaymentDonePage } from "../pages/PaymentDonePage";
import { AccountDeletedPage } from "../pages/AccountDeletedPage";
import { createNewUser, testCard } from "../utils/testData";

test("TID-014: Place Order: Register while Checkout", async ({ page }) => {
  // A full order flow loads ~10 pages; triple the default 30s timeout.
  test.slow();

  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);
  const paymentDonePage = new PaymentDonePage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  const user = createNewUser();

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Add products to the cart
  await test.step("Add products to the cart", async () => {
    await homePage.productsLink.click();
    await expect(productsPage.allProductsHeading).toBeVisible();
    await productsPage.addToCartAndContinueShopping(0);
    await productsPage.addToCartAndContinueShopping(1);
  });

  // Click "Cart" and verify that the cart page loads
  await test.step('Click "Cart" and verify that the cart page loads', async () => {
    await homePage.cartLink.click();
    await expect(page).toHaveURL(/.*\/view_cart$/);
    await expect(cartPage.shoppingCartText).toBeVisible();
    await expect(cartPage.cartProducts).toHaveCount(2);
  });

  // Click "Proceed To Checkout", then "Register / Login" in the popup
  await test.step('Click "Proceed To Checkout", then "Register / Login"', async () => {
    await cartPage.proceedToCheckout();
    await expect(cartPage.checkoutModalRegisterLoginLink).toBeVisible();
    await cartPage.checkoutModalRegisterLoginLink.click();
    await expect(loginPage.signupHeading).toBeVisible();
  });

  // Fill in the signup form and create an account
  await test.step("Fill in the signup form and create an account", async () => {
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

  // Click "Cart", then "Proceed To Checkout" again
  await test.step('Click "Cart", then "Proceed To Checkout" again', async () => {
    await homePage.cartLink.click();
    await expect(cartPage.cartProducts).toHaveCount(2);
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*\/checkout$/);
  });

  // Verify the address details and review the order
  await test.step("Verify the address details and review the order", async () => {
    await expect(checkoutPage.addressDetailsHeading).toBeVisible();
    await expect(checkoutPage.deliveryAddress).toContainText(
      `Mr. ${user.firstName} ${user.lastName}`,
    );
    await expect(checkoutPage.reviewOrderHeading).toBeVisible();
    await expect(checkoutPage.orderProducts).toHaveCount(2);
  });

  // Enter an order comment and click "Place Order"
  await test.step('Enter an order comment and click "Place Order"', async () => {
    await checkoutPage.placeOrder("Please deliver between 9am and 5pm.");
    await expect(page).toHaveURL(/.*\/payment$/);
  });

  // Enter the payment details and click "Pay and Confirm Order"
  await test.step('Enter the payment details and click "Pay and Confirm Order"', async () => {
    await paymentPage.enterCardDetails(testCard);
    await paymentPage.payAndConfirmButton.click();
  });

  // Verify that the order success message is displayed
  await test.step("Verify that the order success message is displayed", async () => {
    await expect(paymentDonePage.orderPlacedHeading).toHaveText("Order Placed!");
    await expect(paymentDonePage.confirmationMessage).toBeVisible();
  });

  // Click "Delete Account" and verify that the account is deleted
  await test.step('Click "Delete Account" and verify that the account is deleted', async () => {
    await homePage.deleteAccountLink.click();
    await expect(accountDeletedPage.accountDeletedHeading).toBeVisible();
    await accountDeletedPage.continueButton.click();
  });
});
