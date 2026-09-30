import { test as base, expect } from "@playwright/test";

type TestUser = {
  name: string;
  email: string;
  password: string;
};

// Provides a ready-to-use, already-registered account to any test that
// asks for it — created via a single API call instead of the ~15-field
// UI signup form, since tests that aren't *about* registration (like
// login) shouldn't have to pay for driving that whole form every time.
export const test = base.extend<{ testUser: TestUser }>({
  testUser: async ({ request }, use) => {
    const timestamp = Date.now();
    const user: TestUser = {
      name: "qatest1234",
      email: `qatest1234.${timestamp}@example.com`,
      password: "Test@1234",
    };

    const createResponse = await request.post("/api/createAccount", {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: "Mr",
        birth_date: "10",
        birth_month: "5",
        birth_year: "1995",
        firstname: "QA",
        lastname: "Test",
        company: "QA Company",
        address1: "123 Test Street",
        address2: "",
        country: "United States",
        zipcode: "10001",
        state: "NY",
        city: "New York",
        mobile_number: "5555555555",
      },
    });
    const created = await createResponse.json();
    if (created.responseCode !== 201) {
      throw new Error(
        `Failed to create test user via API: ${JSON.stringify(created)}`,
      );
    }

    await use(user);

    // Runs after the test finishes — pass or fail — so accounts never
    // pile up in CI even if an assertion above throws mid-test.
    await request.delete("/api/deleteAccount", {
      form: { email: user.email, password: user.password },
    });
  },
});

export { expect };
