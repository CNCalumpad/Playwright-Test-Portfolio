import { test, expect } from "../fixtures";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
import { PaymentDonePage } from "../pages/PaymentDonePage";
import { AccountDeletedPage } from "../pages/AccountDeletedPage";
import { testCard } from "../utils/testData";

test("TID-016: Place Order: Login before Checkout", async ({ page, testUser }) => {
  // A full order flow loads ~10 pages; triple the default 30s timeout.
  test.slow();

  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);
  const paymentDonePage = new PaymentDonePage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  // Navigate to the home page and verify that it loads successfully
  await test.step("Navigate to the home page and verify that it loads successfully", async () => {
    await homePage.goto();
    await expect(homePage.heroHeading).toBeVisible();
  });

  // Click "Signup / Login", enter valid credentials and click "Login"
  // (the account is created beforehand through the API by the testUser fixture)
  await test.step('Click "Signup / Login", enter valid credentials and click "Login"', async () => {
    await homePage.signupLoginLink.click();
    await expect(loginPage.loginHeading).toBeVisible();
    await loginPage.login(testUser.email, testUser.password);
  });

  // Verify that the user is logged in
  await test.step("Verify that the user is logged in", async () => {
    await expect(homePage.loggedInAs(testUser.name)).toBeVisible();
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

  // Click "Proceed To Checkout"
  await test.step('Click "Proceed To Checkout"', async () => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*\/checkout$/);
  });

  // Verify the address details and review the order
  await test.step("Verify the address details and review the order", async () => {
    await expect(checkoutPage.addressDetailsHeading).toBeVisible();
    await expect(checkoutPage.deliveryAddress).toBeVisible();
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
