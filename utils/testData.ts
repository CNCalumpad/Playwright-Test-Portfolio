// Shared test data for tests that register an account through the UI signup
// form (rather than the API-created `testUser` fixture) or pay for an order.

export type NewUser = {
  name: string;
  email: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

// A fresh, unique account each call, so parallel runs and reruns never
// collide on "Email Address already exist!".
export function createNewUser(): NewUser {
  const timestamp = Date.now();
  return {
    name: "qatest1234",
    email: `qatest1234.${timestamp}@example.com`,
    password: "Test@1234",
    birthDay: "10",
    birthMonth: "5",
    birthYear: "1995",
    firstName: "QA",
    lastName: "Test",
    company: "QA Company",
    address1: "123 Test Street",
    address2: "Suite 4",
    country: "United States",
    state: "NY",
    city: "New York",
    zipcode: "10001",
    mobileNumber: "5555555555",
  };
}

// The site accepts any card details; nothing is charged.
export const testCard = {
  nameOnCard: "QA Test",
  number: "4111111111111111",
  cvc: "123",
  expiryMonth: "12",
  expiryYear: "2030",
};
