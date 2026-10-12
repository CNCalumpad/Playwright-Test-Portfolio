# API Test Cases

This is the test case doc for the API tests I will be automating with Postman CLI against the [AutomationExercise API list](https://automationexercise.com/api_list). Each case's ID matches the prefix of the matching request or test name in the Postman collection (e.g. `API-001: Get All Products List`). The UI test cases live in [`TEST_CASES.md`](./TEST_CASES.md).

**Status legend:** `Not Started` · `Started` · `Automated` · `Blocked` · `Deprecated`

**Base URL:** `https://automationexercise.com/api`

> **Important:** this API always responds with **HTTP 200**, even for errors. The real result is the `responseCode` field in the JSON body (e.g. `{"responseCode": 404, "message": "User not found!"}`). Every case below asserts on `responseCode` and `message`, not the HTTP status.
>
> All `POST` / `PUT` / `DELETE` parameters are sent as form fields (`x-www-form-urlencoded`), not JSON.

## Products

### API-001: Get All Products List

- **Severity:** High
- **Type:** Positive
- **Related UI case:** TID-008
- **Objective:** Verify that the products endpoint returns the full product list with the expected fields.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `GET {{baseUrl}}/productsList`
- **Test Data:** None
- **Steps:**
  1. Send a `GET` request to `/productsList`
  2. Confirm the response body is valid JSON
  3. Confirm `responseCode` is `200`
  4. Confirm `products` is a non-empty array
  5. Confirm each product has `id`, `name`, `price`, `brand`, and `category`
- **Expected Result:** `responseCode` is `200` and a non-empty `products` list is returned, each item containing `id`, `name`, `price`, `brand`, and `category`.
- **Status:** Not Started

### API-002: POST To All Products List

- **Severity:** Medium
- **Type:** Negative
- **Related UI case:** None
- **Objective:** Verify that the products endpoint rejects an unsupported request method.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `POST {{baseUrl}}/productsList`
- **Test Data:** None
- **Steps:**
  1. Send a `POST` request to `/productsList`
  2. Confirm `responseCode` is `405`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `405` with message `This request method is not supported.`
- **Status:** Not Started

## Brands

### API-003: Get All Brands List

- **Severity:** Medium
- **Type:** Positive
- **Related UI case:** TID-019
- **Objective:** Verify that the brands endpoint returns the full brand list with the expected fields.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `GET {{baseUrl}}/brandsList`
- **Test Data:** None
- **Steps:**
  1. Send a `GET` request to `/brandsList`
  2. Confirm `responseCode` is `200`
  3. Confirm `brands` is a non-empty array
  4. Confirm each brand has `id` and `brand`
- **Expected Result:** `responseCode` is `200` and a non-empty `brands` list is returned, each item containing `id` and `brand`.
- **Status:** Not Started

### API-004: PUT To All Brands List

- **Severity:** Medium
- **Type:** Negative
- **Related UI case:** None
- **Objective:** Verify that the brands endpoint rejects an unsupported request method.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `PUT {{baseUrl}}/brandsList`
- **Test Data:** None
- **Steps:**
  1. Send a `PUT` request to `/brandsList`
  2. Confirm `responseCode` is `405`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `405` with message `This request method is not supported.`
- **Status:** Not Started

## Search

### API-005: POST To Search Product

- **Severity:** High
- **Type:** Positive
- **Related UI case:** TID-009
- **Objective:** Verify that searching by a keyword returns only matching products.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `POST {{baseUrl}}/searchProduct`
- **Test Data:** `search_product` = `top` (other valid examples: `tshirt`, `jean`)
- **Steps:**
  1. Send a `POST` request to `/searchProduct` with `search_product=top`
  2. Confirm `responseCode` is `200`
  3. Confirm `products` is a non-empty array
  4. Confirm every returned product is related to the search term (e.g. its name or category contains "top")
- **Expected Result:** `responseCode` is `200` and only products matching the search term are returned.
- **Status:** Not Started

### API-006: POST To Search Product without search_product parameter

- **Severity:** Medium
- **Type:** Negative
- **Related UI case:** None
- **Objective:** Verify that a search request without the required parameter is rejected.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `POST {{baseUrl}}/searchProduct`
- **Test Data:** None (parameter intentionally omitted)
- **Steps:**
  1. Send a `POST` request to `/searchProduct` with no body
  2. Confirm `responseCode` is `400`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `400` with message `Bad request, search_product parameter is missing in POST request.`
- **Status:** Not Started

## Authentication

### API-007: POST To Verify Login with valid details

- **Severity:** Critical
- **Type:** Positive
- **Related UI case:** TID-002
- **Objective:** Verify that a registered user's credentials are accepted.
- **Preconditions:** Postman CLI installed; internet connection; API accessible; a user account exists (created by API-011 in the same run).
- **Request:** `POST {{baseUrl}}/verifyLogin`
- **Test Data:** `email`, `password` of the account created in API-011
- **Steps:**
  1. Send a `POST` request to `/verifyLogin` with the valid `email` and `password`
  2. Confirm `responseCode` is `200`
  3. Confirm the success message
- **Expected Result:** `responseCode` is `200` with message `User exists!`
- **Status:** Not Started

### API-008: POST To Verify Login without email parameter

- **Severity:** High
- **Type:** Negative
- **Related UI case:** None
- **Objective:** Verify that a login request missing the email parameter is rejected.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `POST {{baseUrl}}/verifyLogin`
- **Test Data:** `password` only (`email` intentionally omitted)
- **Steps:**
  1. Send a `POST` request to `/verifyLogin` with only `password`
  2. Confirm `responseCode` is `400`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `400` with message `Bad request, email or password parameter is missing in POST request.`
- **Status:** Not Started

### API-009: DELETE To Verify Login

- **Severity:** Medium
- **Type:** Negative
- **Related UI case:** None
- **Objective:** Verify that the login endpoint rejects an unsupported request method.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `DELETE {{baseUrl}}/verifyLogin`
- **Test Data:** None
- **Steps:**
  1. Send a `DELETE` request to `/verifyLogin`
  2. Confirm `responseCode` is `405`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `405` with message `This request method is not supported.`
- **Status:** Not Started

### API-010: POST To Verify Login with invalid details

- **Severity:** High
- **Type:** Negative
- **Related UI case:** TID-003
- **Objective:** Verify that credentials for a non-existent user are rejected.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `POST {{baseUrl}}/verifyLogin`
- **Test Data:** An unregistered `email` (e.g. `nobody.<timestamp>@example.com`) and any `password`
- **Steps:**
  1. Send a `POST` request to `/verifyLogin` with the invalid `email` and `password`
  2. Confirm `responseCode` is `404`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `404` with message `User not found!`
- **Status:** Not Started

## Account

These cases run in order as one lifecycle in the collection: **API-011 → API-015 → API-007 → API-014 → API-013 → API-012**. A fresh, timestamped email is generated in API-011's pre-request script so every run starts clean, and API-012 deletes the account last so test users don't pile up (same approach as the UI tests' `fixtures/testUser.ts`).

### API-011: POST To Create/Register User Account

- **Severity:** Critical
- **Type:** Positive
- **Related UI case:** TID-001
- **Objective:** Verify that a new user account can be created through the API.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `POST {{baseUrl}}/createAccount`
- **Test Data:** `name`, `email` (unique per run, e.g. `qatest.<timestamp>@example.com`), `password`, `title` (Mr/Mrs/Miss), `birth_date`, `birth_month`, `birth_year`, `firstname`, `lastname`, `company`, `address1`, `address2`, `country`, `zipcode`, `state`, `city`, `mobile_number`
- **Steps:**
  1. Generate a unique email and save it, with the password, as collection variables
  2. Send a `POST` request to `/createAccount` with all account fields
  3. Confirm `responseCode` is `201`
  4. Confirm the success message
- **Expected Result:** `responseCode` is `201` with message `User created!`
- **Status:** Not Started

### API-012: DELETE METHOD To Delete User Account

- **Severity:** Critical
- **Type:** Positive
- **Related UI case:** TID-001
- **Objective:** Verify that an existing user account can be deleted and is no longer retrievable afterward.
- **Preconditions:** Postman CLI installed; internet connection; API accessible; the account from API-011 exists.
- **Request:** `DELETE {{baseUrl}}/deleteAccount`
- **Test Data:** `email`, `password` of the account created in API-011
- **Steps:**
  1. Send a `DELETE` request to `/deleteAccount` with `email` and `password`
  2. Confirm `responseCode` is `200`
  3. Confirm the success message
  4. Send a `GET` request to `/getUserDetailByEmail` with the same `email`
  5. Confirm `responseCode` is `404`
- **Expected Result:** `responseCode` is `200` with message `Account deleted!`, and looking the user up afterward returns `responseCode` `404` with message `Account not found with this email, try another email!`
- **Status:** Not Started

### API-013: PUT METHOD To Update User Account

- **Severity:** High
- **Type:** Positive
- **Related UI case:** None
- **Objective:** Verify that an existing user's details can be updated and that the change persists.
- **Preconditions:** Postman CLI installed; internet connection; API accessible; the account from API-011 exists.
- **Request:** `PUT {{baseUrl}}/updateAccount`
- **Test Data:** Same fields as API-011, with at least one value changed (e.g. a new `name`)
- **Steps:**
  1. Send a `PUT` request to `/updateAccount` with the same `email` and `password` and a changed `name`
  2. Confirm `responseCode` is `200`
  3. Confirm the success message
  4. Send a `GET` request to `/getUserDetailByEmail` with the same `email`
  5. Confirm the returned `user.name` matches the new value
- **Expected Result:** `responseCode` is `200` with message `User updated!`, and the user's details reflect the updated values.
- **Status:** Not Started

### API-014: GET user account detail by email

- **Severity:** High
- **Type:** Positive
- **Related UI case:** None
- **Objective:** Verify that a user's account details can be retrieved by email and match the data used to create the account.
- **Preconditions:** Postman CLI installed; internet connection; API accessible; the account from API-011 exists.
- **Request:** `GET {{baseUrl}}/getUserDetailByEmail?email={{email}}`
- **Test Data:** `email` of the account created in API-011
- **Steps:**
  1. Send a `GET` request to `/getUserDetailByEmail` with the `email` query parameter
  2. Confirm `responseCode` is `200`
  3. Confirm the `user` object is returned
  4. Confirm `user.email`, `user.name`, and `user.first_name` / `user.last_name` match the values sent in API-011
- **Expected Result:** `responseCode` is `200` and the returned `user` object matches the account's details. Note that some response field names differ from the create request: `birth_date` → `birth_day`, `firstname` → `first_name`, `lastname` → `last_name`, and `mobile_number` is not returned.
- **Status:** Not Started

### API-015: POST To Create User Account with existing email

- **Severity:** High
- **Type:** Negative
- **Related UI case:** TID-005
- **Objective:** Verify that registering with an email that is already in use is rejected.
- **Preconditions:** Postman CLI installed; internet connection; API accessible; the account from API-011 exists.
- **Request:** `POST {{baseUrl}}/createAccount`
- **Test Data:** The same account fields and `email` used in API-011
- **Steps:**
  1. Send a `POST` request to `/createAccount` with the already-registered `email`
  2. Confirm `responseCode` is `400`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `400` with message `Email already exists!`
- **Status:** Not Started

### API-016: GET user account detail without email parameter

- **Severity:** Medium
- **Type:** Negative
- **Related UI case:** None
- **Objective:** Verify that a user lookup request missing the email parameter is rejected.
- **Preconditions:** Postman CLI installed; internet connection; API accessible.
- **Request:** `GET {{baseUrl}}/getUserDetailByEmail`
- **Test Data:** None (parameter intentionally omitted)
- **Steps:**
  1. Send a `GET` request to `/getUserDetailByEmail` with no query parameters
  2. Confirm `responseCode` is `400`
  3. Confirm the error message
- **Expected Result:** `responseCode` is `400` with message `Bad request, email parameter is missing in GET request.`
- **Status:** Not Started
