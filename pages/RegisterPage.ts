import { type Locator, type Page } from "@playwright/test";

// This is for the /signup route for filling out the registration form

export class RegisterPage {
  readonly page: Page;

  readonly accountInfoForm: Locator;
  readonly accountInfoHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly dayDropdown: Locator;
  readonly monthDropdown: Locator;
  readonly yearDropdown: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countryDropdown: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountInfoForm = page.locator('div').filter({ hasText: 'Enter Account Information' }).nth(2)
    this.accountInfoHeading = page.getByText("ENTER ACCOUNT INFORMATION");
    this.titleMrRadio = page.getByRole("radio", { name: "Mr.", exact: true });
    this.titleMrsRadio = page.getByRole("radio", { name: "Mrs.", exact: true });
    this.passwordInput = page.locator('[data-qa="password"]');
    this.dayDropdown = page.locator('[data-qa="days"]');
    this.monthDropdown = page.locator('[data-qa="months"]');
    this.yearDropdown = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.locator("#newsletter");
    this.offersCheckbox = page.locator("#optin");
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.address1Input = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countryDropdown = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
  }
}
