import { type Locator, type Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;

  readonly viewProductLink: Locator;

  readonly categoryHeading: Locator;
  readonly categoryProducts: Locator;
  readonly categoryWomenLink: Locator;
  readonly categoryMenLink: Locator;
  readonly categoryKidsLink: Locator;

  readonly brandsHeading: Locator;
  readonly brandProducts: Locator;

  readonly productCards: Locator;

  // The "Added!" popup shown after clicking "Add to cart"
  readonly cartModal: Locator;
  readonly cartModalHeading: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByRole("textbox", { name: "Search Product" });
    this.searchButton = page.locator("#submit_search");
    this.allProductsHeading = page.getByRole("heading", {
      name: "All Products",
    });
    this.searchedProductsHeading = page.getByRole("heading", {
      name: "Searched Products",
    });
    this.viewProductLink = page.getByRole("link", { name: "View Product" });

    this.categoryHeading = page.getByRole("heading", { name: "Category" });
    this.categoryProducts = page.locator(".category-products");
    this.categoryWomenLink = page.getByRole("link", { name: "Women" });
    this.categoryMenLink = page.getByRole("link", { name: "Men" });
    this.categoryKidsLink = page.getByRole("link", { name: "Kids" });

    this.brandsHeading = page.getByRole("heading", { name: "Brands" });
    this.brandProducts = page.locator(".brand-products");

    this.productCards = page.locator(".product-image-wrapper");

    this.cartModal = page.locator("#cartModal");
    this.cartModalHeading = this.cartModal.getByRole("heading", {
      name: "Added!",
    });
    this.continueShoppingButton = this.cartModal.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  /**
   * Hovers the product card at the given zero-based index and clicks its "Add to cart".
   * Each card has two "Add to cart" buttons; this targets the one in the hover overlay.
   */
  async addToCartAt(index: number) {
    const product = this.productCards.nth(index);
    await product.hover();
    await product.locator(".product-overlay .add-to-cart").click();
  }

  /**
   * Returns the "View Product" link at the given zero-based index.
   * e.g. viewProductLinkAt(0) === first product, viewProductLinkAt(2) === third product.
   */
  viewProductLinkAt(index: number): Locator {
    return this.viewProductLink.nth(index);
  }

  /**
   * Returns the "View Product" link belonging to the product card with the given name.
   * e.g. viewProductLinkFor("Blue Top")
   */
  viewProductLinkFor(productName: string): Locator {
    return this.page
      .locator(".product-image-wrapper")
      .filter({
        has: this.page.locator(".productinfo p", { hasText: productName }),
      })
      .getByRole("link", { name: "View Product" });
  }
}
