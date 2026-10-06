# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TID_007_Verify_Test_Cases.spec.ts >> TID-007: Verify Test Cases Page
- Location: tests/TID_007_Verify_Test_Cases.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Test Cases' })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: 'Test Cases' }) resolved to 3 elements:
    1) <h2 class="title text-center">…</h2> aka getByRole('heading', { name: 'Test Cases', exact: true })
    2) <h5>…</h5> aka getByRole('heading', { name: 'Below is the list of test' })
    ...

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Test Cases' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Test Cases' })

```

# Page snapshot

```yaml
- generic [active] [ref=f13e1]:
  - banner [ref=f13e2]:
    - generic [ref=f13e5]:
      - link [ref=f13e8] [cursor=pointer]:
        - /url: /
        - img "Website for practice automation" [ref=f13e9]
      - list [ref=f13e12]:
        - listitem [ref=f13e13]:
          - link " Home" [ref=f13e14] [cursor=pointer]:
            - /url: /
            - generic [ref=f13e15]: 
            - text: Home
        - listitem [ref=f13e16]:
          - link " Products" [ref=f13e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=f13e18]: 
            - text: Products
        - listitem [ref=f13e19]:
          - link " Cart" [ref=f13e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=f13e21]: 
            - text: Cart
        - listitem [ref=f13e22]:
          - link " Signup / Login" [ref=f13e23] [cursor=pointer]:
            - /url: /login
            - generic [ref=f13e24]: 
            - text: Signup / Login
        - listitem [ref=f13e25]:
          - link " Test Cases" [ref=f13e26] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=f13e27]: 
            - text: Test Cases
        - listitem [ref=f13e28]:
          - link " API Testing" [ref=f13e29] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=f13e30]: 
            - text: API Testing
        - listitem [ref=f13e31]:
          - link " Video Tutorials" [ref=f13e32] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=f13e33]: 
            - text: Video Tutorials
        - listitem [ref=f13e34]:
          - link " Contact us" [ref=f13e35] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=f13e36]: 
            - text: Contact us
  - generic [ref=f13e38]:
    - heading "Test Cases" [level=2] [ref=f13e41]
    - generic [ref=f13e42]:
      - heading "Below is the list of test Cases for you to practice the Automation. Click on the scenario for detailed Test Steps:" [level=5] [ref=f13e43]
      - heading [level=4] [ref=f13e46]:
        - 'link "Test Case 1: Register User" [ref=f13e47] [cursor=pointer]':
          - /url: "#collapse1"
    - heading [level=4] [ref=f13e51]:
      - 'link "Test Case 2: Login User with correct email and password" [ref=f13e52] [cursor=pointer]':
        - /url: "#collapse2"
    - heading [level=4] [ref=f13e56]:
      - 'link "Test Case 3: Login User with incorrect email and password" [ref=f13e57] [cursor=pointer]':
        - /url: "#collapse3"
    - heading [level=4] [ref=f13e61]:
      - 'link "Test Case 4: Logout User" [ref=f13e62] [cursor=pointer]':
        - /url: "#collapse4"
    - heading [level=4] [ref=f13e66]:
      - 'link "Test Case 5: Register User with existing email" [ref=f13e67] [cursor=pointer]':
        - /url: "#collapse5"
    - heading [level=4] [ref=f13e71]:
      - 'link "Test Case 6: Contact Us Form" [ref=f13e72] [cursor=pointer]':
        - /url: "#collapse6"
    - heading [level=4] [ref=f13e76]:
      - 'link "Test Case 7: Verify Test Cases Page" [ref=f13e77] [cursor=pointer]':
        - /url: "#collapse7"
    - heading [level=4] [ref=f13e81]:
      - 'link "Test Case 8: Verify All Products and product detail page" [ref=f13e82] [cursor=pointer]':
        - /url: "#collapse8"
    - heading [level=4] [ref=f13e86]:
      - 'link "Test Case 9: Search Product" [ref=f13e87] [cursor=pointer]':
        - /url: "#collapse9"
    - heading [level=4] [ref=f13e91]:
      - 'link "Test Case 10: Verify Subscription in home page" [ref=f13e92] [cursor=pointer]':
        - /url: "#collapse10"
    - heading [level=4] [ref=f13e96]:
      - 'link "Test Case 11: Verify Subscription in Cart page" [ref=f13e97] [cursor=pointer]':
        - /url: "#collapse11"
    - heading [level=4] [ref=f13e101]:
      - 'link "Test Case 12: Add Products in Cart" [ref=f13e102] [cursor=pointer]':
        - /url: "#collapse12"
    - heading [level=4] [ref=f13e106]:
      - 'link "Test Case 13: Verify Product quantity in Cart" [ref=f13e107] [cursor=pointer]':
        - /url: "#collapse13"
    - heading [level=4] [ref=f13e111]:
      - 'link "Test Case 14: Place Order: Register while Checkout" [ref=f13e112] [cursor=pointer]':
        - /url: "#collapse14"
    - heading [level=4] [ref=f13e116]:
      - 'link "Test Case 15: Place Order: Register before Checkout" [ref=f13e117] [cursor=pointer]':
        - /url: "#collapse15"
    - heading [level=4] [ref=f13e121]:
      - 'link "Test Case 16: Place Order: Login before Checkout" [ref=f13e122] [cursor=pointer]':
        - /url: "#collapse16"
    - heading [level=4] [ref=f13e126]:
      - 'link "Test Case 17: Remove Products From Cart" [ref=f13e127] [cursor=pointer]':
        - /url: "#collapse17"
    - heading [level=4] [ref=f13e131]:
      - 'link "Test Case 18: View Category Products" [ref=f13e132] [cursor=pointer]':
        - /url: "#collapse18"
    - heading [level=4] [ref=f13e136]:
      - 'link "Test Case 19: View & Cart Brand Products" [ref=f13e137] [cursor=pointer]':
        - /url: "#collapse19"
    - heading [level=4] [ref=f13e141]:
      - 'link "Test Case 20: Search Products and Verify Cart After Login" [ref=f13e142] [cursor=pointer]':
        - /url: "#collapse20"
    - heading [level=4] [ref=f13e146]:
      - 'link "Test Case 21: Add review on product" [ref=f13e147] [cursor=pointer]':
        - /url: "#collapse21"
    - heading [level=4] [ref=f13e151]:
      - 'link "Test Case 22: Add to cart from Recommended items" [ref=f13e152] [cursor=pointer]':
        - /url: "#collapse22"
    - heading [level=4] [ref=f13e156]:
      - 'link "Test Case 23: Verify address details in checkout page" [ref=f13e157] [cursor=pointer]':
        - /url: "#collapse23"
    - heading [level=4] [ref=f13e161]:
      - 'link "Test Case 24: Download Invoice after purchase order" [ref=f13e162] [cursor=pointer]':
        - /url: "#collapse24"
    - heading [level=4] [ref=f13e166]:
      - 'link "Test Case 25: Verify Scroll Up using ''Arrow'' button and Scroll Down functionality" [ref=f13e167] [cursor=pointer]':
        - /url: "#collapse25"
    - heading [level=4] [ref=f13e171]:
      - 'link "Test Case 26: Verify Scroll Up without ''Arrow'' button and Scroll Down functionality" [ref=f13e172] [cursor=pointer]':
        - /url: "#collapse26"
    - generic [ref=f13e174]:
      - heading [level=4] [ref=f13e176]:
        - link "Feedback for Us" [ref=f13e177] [cursor=pointer]:
          - /url: "#feedback"
      - list [ref=f13e179]:
        - listitem [ref=f13e180]: We have identified above scenarios and added in the list.
        - listitem [ref=f13e181]: You can explore more test cases in the website and if you find new test scenario that is not covered in above list, do let us know. We will definitely add that in above list.
        - listitem [ref=f13e182]:
          - text: If you think, this website should cover up any particular feature, kindly share with us at
          - link "feedback@automationexercise.com" [ref=f13e183] [cursor=pointer]:
            - /url: mailto:feedback@automationexercise.com
          - text: . We will work on that part. Your feedback matters a lot.
  - contentinfo [ref=f13e184]:
    - generic [ref=f13e189]:
      - heading "Subscription" [level=2] [ref=f13e190]
      - generic [ref=f13e191]:
        - textbox "Your email address" [ref=f13e192]
        - button "" [ref=f13e193] [cursor=pointer]
        - paragraph [ref=f13e195]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=f13e199]: Copyright © 2021 All rights reserved
  - text: 
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("TID-007: Verify Test Cases Page", async ({ page }) => {
  4  |   await page.goto("/");
  5  |   await expect(page.getByRole("button", { name: "Test Cases" })).toBeVisible();
  6  |   await page.getByRole("button", { name: "Test Cases" }).click();
  7  |   await expect(page).toHaveURL(/.*test_cases/);
> 8  |   await expect(page.getByRole("heading", { name: "Test Cases" })).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  9  | });
  10 | 
```