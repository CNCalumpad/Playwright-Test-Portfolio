# Test Case Sheet

This is the test case doc for the automated tests I will be doing. Each case's ID matches the prefix of the matching test title in `tests/*.spec.ts` (e.g. `test('TID_001_ ...')`).

**Status legend:** `Not Started` · `Automated` · `Blocked` · `Deprecated`

## Authentication

### TID-001: Register User

- **Severity:** Critical
- **Type:** Positive
- **Objective:** Verify that a new user can successfully register an account, that all confirmation messages display correctly, and that the account can be deleted afterward.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click the 'Signup / Login' button
  4. Confirm the 'New User Signup!' section is visible
  5. Enter a name and email address, then click 'Signup'
  6. Confirm the account information form is visible
  7. Fill in account details (title, name, email, password, date of birth)
  8. Check the newsletter and special offers checkboxes
  9. Fill in address details (name, company, address, country, state, city, zipcode, mobile number)
  10. Click 'Create Account'
  11. Confirm the account-created message appears, then click 'Continue'
  12. Confirm the user is logged in (username shown)
  13. Click 'Delete Account'
  14. Confirm the account-deleted message appears and click 'Continue'
- **Expected Result:** User account is created successfully, a registration confirmation message is displayed, and the account is successfully deleted when requested.
- **Status:** Automated

### TID-002: Login User with correct email and password

- **Severity:** Critical
- **Type:** Positive
- **Objective:** Verify that a registered user can log in with valid credentials, that appropriate confirmation messages appear, and that the account can be deleted afterward.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Confirm the login form is visible
  5. Enter a valid email and password, then click 'Login'
  6. Confirm the user is logged in (username shown)
  7. Click 'Delete Account'
  8. Confirm the account-deleted message appears
- **Expected Result:** User is logged in successfully, a login confirmation message is displayed, and the account is successfully deleted when requested.
- **Status:** Not Started

### TID-003: Login User with incorrect email and password

- **Severity:** High
- **Type:** Negative
- **Objective:** Verify that logging in with invalid credentials keeps the user on the home page, displays visible confirmation messages, and shows an appropriate error message.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Confirm the login form is visible
  5. Enter an invalid email and password, then click 'Login'
  6. Confirm an error message indicating incorrect credentials appears
- **Expected Result:** User remains on the home page, is not logged in, and an appropriate error message indicating incorrect email or password is displayed.
- **Status:** Not Started

### TID-004: Logout User

- **Severity:** High
- **Type:** Positive
- **Objective:** Verify that a logged-in user can log out successfully, the Signup/Login button becomes functional again, and the correct confirmation messages display.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Confirm the login form is visible
  5. Enter a valid email and password, then click 'Login'
  6. Confirm the user is logged in (username shown)
  7. Click 'Logout'
  8. Confirm the user is returned to the login page
- **Expected Result:** User is logged out successfully, the Signup/Login button reappears on the home page, and a logout confirmation message is displayed.
- **Status:** Not Started

### TID-005: Register User with existing email

- **Severity:** High
- **Type:** Negative
- **Objective:** Verify that attempting to register with an already-used email keeps the Signup button functional, displays the signup message, and shows an appropriate error message.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Confirm the signup form is visible
  5. Enter a name and an already-registered email, then click 'Signup'
  6. Confirm an error indicating the email already exists appears
- **Expected Result:** Registration is blocked and an 'email already exists' error message is displayed.
- **Status:** Not Started

## Contact

### TID-006: Contact Us Form

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that the Contact Us form can be completed, submitted, and successfully confirmed.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Contact Us'
  4. Confirm the contact form section is visible
  5. Fill in name, email, subject, and message
  6. Attach a file
  7. Click 'Submit', then confirm the dialog
  8. Confirm a success message appears
  9. Click 'Home' and confirm the home page loads
- **Expected Result:** The Contact Us form submits successfully and a confirmation message is displayed.
- **Status:** Not Started

## Navigation

### TID-007: Verify Test Cases Page

- **Severity:** Low
- **Type:** Positive
- **Objective:** Verify that navigating to the Test Cases page loads it correctly.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Test Cases'
  4. Confirm the Test Cases page loads successfully
- **Expected Result:** User is navigated to the Test Cases page and it loads correctly.
- **Status:** Not Started

## Products

### TID-008: Verify All Products and product detail page

- **Severity:** High
- **Type:** Positive
- **Objective:** Verify that the full product list displays correctly and that key product-detail information is accurate on the product detail page.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Products'
  4. Confirm the All Products page loads successfully
  5. Confirm the product list is visible
  6. Click 'View Product' on the first item
  7. Confirm the product detail page loads
  8. Confirm product name, category, price, availability, condition, and brand are displayed
- **Expected Result:** The product list displays all available products, and the product detail page shows accurate name, price, category, and description information.
- **Status:** Not Started

### TID-009: Search Product

- **Severity:** High
- **Type:** Positive/Functional
- **Objective:** Verify that searching for a product returns accurate and relevant visible results.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Products'
  4. Confirm the All Products page loads successfully
  5. Enter a product name in the search box and click search
  6. Confirm the searched-products section is visible
  7. Confirm the returned products match the search term
- **Expected Result:** Search results display only products relevant to the entered search term.
- **Status:** Not Started

## Subscription

### TID-010: Verify Subscription in home page

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that a user can successfully subscribe via email from the home page footer.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Scroll to the footer
  4. Confirm the 'Subscription' section is visible
  5. Enter an email address and click the subscribe arrow
  6. Confirm a subscription success message appears
- **Expected Result:** The email is accepted and a subscription success message is displayed on the home page.
- **Status:** Not Started

### TID-011: Verify Subscription in Cart page

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that a user can successfully subscribe via email from the Cart page.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Cart'
  4. Scroll to the footer
  5. Confirm the 'Subscription' section is visible
  6. Enter an email address and click the subscribe arrow
  7. Confirm a subscription success message appears
- **Expected Result:** The email is accepted and a subscription success message is displayed on the Cart page.
- **Status:** Not Started

## Cart

### TID-012: Add Products in Cart

- **Severity:** Critical
- **Type:** Positive
- **Objective:** Verify that multiple products can be added to the cart and that the cart's pricing and quantity information is accurate.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Products'
  4. Hover over the first product and click 'Add to cart'
  5. Click 'Continue Shopping'
  6. Hover over a second product and click 'Add to cart'
  7. Click 'View Cart'
  8. Confirm both products appear in the cart
  9. Confirm prices, quantities, and total are correct
- **Expected Result:** All selected products appear in the cart with correct prices, quantities, and total amount.
- **Status:** Not Started

### TID-013: Verify Product quantity in Cart

- **Severity:** High
- **Type:** Positive
- **Objective:** Verify that a selected product's quantity is correctly preserved when added to the cart.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'View Product' on any item
  4. Confirm the product detail page opens
  5. Increase the quantity to 4
  6. Click 'Add to cart'
  7. Click 'View Cart'
  8. Confirm the product appears in the cart with the correct quantity
- **Expected Result:** The quantity selected on the product page matches the quantity shown in the cart.
- **Status:** Not Started

## Checkout

### TID-014: Place Order: Register while Checkout

- **Severity:** Critical
- **Type:** End-to-End
- **Objective:** Verify that a user who registers during the checkout flow can successfully complete the order.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Add products to the cart
  4. Click 'Cart' and confirm the cart page loads
  5. Click 'Proceed To Checkout'
  6. Click 'Register / Login'
  7. Complete the signup form and create an account
  8. Confirm the account is created, then click 'Continue'
  9. Confirm the user is logged in
  10. Click 'Cart', then 'Proceed To Checkout' again
  11. Review the address details and order summary
  12. Enter an order comment and click 'Place Order'
  13. Enter payment details (card name, number, CVC, expiration)
  14. Click 'Pay and Confirm Order'
  15. Confirm the order success message appears
  16. Click 'Delete Account' and confirm deletion
- **Expected Result:** The user successfully registers mid-checkout, the order is placed, and an order confirmation is displayed.
- **Status:** Not Started

### TID-015: Place Order: Register before Checkout

- **Severity:** Critical
- **Type:** End-to-End
- **Objective:** Verify that a user who registers before adding items to the cart can successfully complete checkout.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Complete the signup form and create an account
  5. Confirm the account is created, then click 'Continue'
  6. Confirm the user is logged in
  7. Add products to the cart
  8. Click 'Cart' and confirm the cart page loads
  9. Click 'Proceed To Checkout'
  10. Review the address details and order summary
  11. Enter an order comment and click 'Place Order'
  12. Enter payment details and click 'Pay and Confirm Order'
  13. Confirm the order success message appears
  14. Click 'Delete Account' and confirm deletion
- **Expected Result:** The user successfully registers, completes checkout, and receives an order confirmation.
- **Status:** Not Started

### TID-016: Place Order: Login before Checkout

- **Severity:** Critical
- **Type:** End-to-End
- **Objective:** Verify that an already logged-in user can successfully complete the checkout flow.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Enter valid credentials and click 'Login'
  5. Confirm the user is logged in
  6. Add products to the cart
  7. Click 'Cart' and confirm the cart page loads
  8. Click 'Proceed To Checkout'
  9. Review the address details and order summary
  10. Enter an order comment and click 'Place Order'
  11. Enter payment details and click 'Pay and Confirm Order'
  12. Confirm the order success message appears
  13. Click 'Delete Account' and confirm deletion
- **Expected Result:** The logged-in user successfully completes checkout and receives an order confirmation.
- **Status:** Not Started

## Cart

### TID-017: Remove Products From Cart

- **Severity:** High
- **Type:** Positive
- **Objective:** Verify that a selected product can be successfully removed from the cart and the cart updates accordingly.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Add products to the cart
  4. Click 'Cart' and confirm the cart page loads
  5. Click the 'X' next to a product
  6. Confirm the product is removed from the cart
- **Expected Result:** The selected product is removed from the cart, and the cart total and quantity update accordingly.
- **Status:** Not Started

## Products

### TID-018: View Category Products

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that navigating a product category and its sub-categories displays the expected products.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm categories are visible on the sidebar
  3. Click a top-level category (e.g., 'Women')
  4. Click a sub-category link under it (e.g., 'Dress')
  5. Confirm the category page loads with the matching heading text
  6. Click a sub-category link under another category (e.g., 'Men')
  7. Confirm the corresponding category page loads
- **Expected Result:** The selected category and sub-category display only products belonging to that category.
- **Status:** Not Started

### TID-019: View & Cart Brand Products

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that browsing a brand page displays the correct associated products and that they can be added to the cart.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Click 'Products'
  3. Confirm brand links are visible on the sidebar
  4. Click a brand name
  5. Confirm the brand page loads with matching products
  6. Click a different brand link
  7. Confirm that brand's page loads with its products
- **Expected Result:** The selected brand page displays only products belonging to that brand, and selected products are added to the cart successfully.
- **Status:** Not Started

## Cart

### TID-020: Search Products and Verify Cart After Login

- **Severity:** Critical
- **Type:** End-to-End
- **Objective:** Verify that products added to the cart via search remain in the cart after the user logs in.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Click 'Products'
  3. Confirm the All Products page loads successfully
  4. Enter a product name in search and click search
  5. Confirm search results are relevant
  6. Add the resulting products to the cart
  7. Click 'Cart' and confirm the products are visible
  8. Log in via 'Signup / Login'
  9. Return to the Cart page
  10. Confirm the products are still present after login
- **Expected Result:** Cart items added via search remain present and unchanged after the user logs in.
- **Status:** Not Started

## Products

### TID-021: Add review on product

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that a user can successfully submit a review on a product's detail page.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Click 'Products'
  3. Confirm the All Products page loads successfully
  4. Click 'View Product' on any item
  5. Confirm the review form is visible
  6. Enter name, email, and review text
  7. Click 'Submit'
  8. Confirm a thank-you/success message appears
- **Expected Result:** The review is submitted successfully and a confirmation message is displayed on the product page.
- **Status:** Not Started

## Cart

### TID-022: Add to cart from Recommended items

- **Severity:** Medium
- **Type:** Positive
- **Objective:** Verify that a recommended product can be successfully added to the cart from the product detail page.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Scroll to the bottom of the page
  3. Confirm the recommended-items section is visible
  4. Click 'Add To Cart' on a recommended product
  5. Click 'View Cart'
  6. Confirm the product appears in the cart
- **Expected Result:** The recommended product is added to the cart successfully with correct details.
- **Status:** Not Started

## Checkout

### TID-023: Verify address details in checkout page

- **Severity:** Critical
- **Type:** Positive
- **Objective:** Verify that the delivery and billing addresses shown at checkout accurately match the user's registration data.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Click 'Signup / Login'
  4. Complete the signup form and create an account
  5. Confirm the account is created, then click 'Continue'
  6. Confirm the user is logged in
  7. Add products to the cart
  8. Click 'Cart' and confirm the cart page loads
  9. Click 'Proceed To Checkout'
  10. Confirm the delivery address matches the registration address
  11. Confirm the billing address matches the registration address
  12. Click 'Delete Account' and confirm deletion
- **Expected Result:** The delivery and billing addresses displayed at checkout match the addresses entered during registration.
- **Status:** Not Started

### TID-024: Download Invoice after purchase order

- **Severity:** High
- **Type:** End-to-End
- **Objective:** Verify that the order invoice can be successfully downloaded after completing a purchase.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Add products to the cart
  4. Click 'Cart' and confirm the cart page loads
  5. Click 'Proceed To Checkout'
  6. Click 'Register / Login' and create an account
  7. Confirm the account is created, then click 'Continue'
  8. Confirm the user is logged in
  9. Click 'Cart', then 'Proceed To Checkout' again
  10. Review address details and order summary
  11. Enter an order comment and click 'Place Order'
  12. Enter payment details and click 'Pay and Confirm Order'
  13. Confirm the order success message appears
  14. Click 'Download Invoice' and confirm the file downloads
  15. Click 'Continue'
  16. Click 'Delete Account' and confirm deletion
- **Expected Result:** The invoice file downloads successfully after order completion.
- **Status:** Not Started

## Navigation

### TID-025: Verify Scroll Up using 'Arrow' button and Scroll Down functionality

- **Severity:** Low
- **Type:** UI
- **Objective:** Verify that the scroll-to-top arrow button correctly returns the user to the top of the page after scrolling down.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Scroll down to the bottom of the page
  4. Confirm the 'Subscription' section is visible
  5. Click the scroll-to-top arrow button
  6. Confirm the page scrolls back to the top and the header text is visible
- **Expected Result:** Clicking the arrow button scrolls the page back to the top after the user has scrolled down.
- **Status:** Not Started

### TID-026: Verify Scroll Up without 'Arrow' button and Scroll Down functionality

- **Severity:** Low
- **Type:** UI
- **Objective:** Verify that manual scrolling down the page and back to the top functions correctly without using the arrow button.
- **Preconditions:** Browser available; internet connection; test site accessible.
- **Test Data:** Defined during implementation
- **Steps:**
  1. Launch the browser and navigate to the test site
  2. Confirm the home page loads successfully
  3. Scroll down to the bottom of the page
  4. Confirm the 'Subscription' section is visible
  5. Manually scroll back up to the top
  6. Confirm the page returns to the top and the header text is visible
- **Expected Result:** Manual scroll actions correctly move the page down and back to the top without using the arrow button.
- **Status:** Not Started
