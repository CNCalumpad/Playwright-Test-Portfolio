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

  readonly brandsHeading: Locator;
  readonly brandProducts: Locator;

  readonly productCards: Locator;
  // The heading above the product grid, e.g. "All Products",
  // "Women - Dress Products" or "Brand - Polo Products"
  readonly productListHeading: Locator;
  readonly productNames: Locator;

  // The "Added!" popup shown after clicking "Add to cart"
  readonly cartModal: Locator;
  readonly cartModalHeading: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartModalViewCartLink: Locator;

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

    this.brandsHeading = page.getByRole("heading", { name: "Brands" });
    this.brandProducts = page.locator(".brands_products");

    this.productCards = page.locator(".product-image-wrapper");
    this.productListHeading = page.locator(".features_items h2.title");
    this.productNames = page.locator(".features_items .productinfo p");

    this.cartModal = page.locator("#cartModal");
    this.cartModalHeading = this.cartModal.getByRole("heading", {
      name: "Added!",
    });
    this.continueShoppingButton = this.cartModal.getByRole("button", {
      name: "Continue Shopping",
    });
    this.cartModalViewCartLink = this.cartModal.getByRole("link", {
      name: "View Cart",
    });
  }

  /**
   * Hovers the product card at the given zero-based index and clicks its "Add to cart".
   * Each card has two "Add to cart" buttons; this targets the one in the hover overlay.
   * The buttons have no href; a script near the bottom of the page wires them
   * up, so clicking before the page finishes loading does nothing (the
   * "Added!" popup never shows). Hence the wait first.
   */
  async addToCartAt(index: number) {
    await this.page.waitForLoadState("load");
    const product = this.productCards.nth(index);
    await product.hover();
    await product.locator(".product-overlay .add-to-cart").click();
  }

  /** Adds the product card at the given index to the cart and closes the "Added!" popup. */
  async addToCartAndContinueShopping(index: number) {
    await this.addToCartAt(index);
    await this.continueShoppingButton.click();
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

  /** Searches for products by name. */
  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /**
   * Returns the sidebar link that expands a top-level category, e.g. "Women".
   * Matched by its target rather than its name, because a name match for
   * "Men" would also hit "Women".
   */
  categoryToggle(category: "Women" | "Men" | "Kids"): Locator {
    return this.categoryProducts.locator(`a[href="#${category}"]`);
  }

  /** Returns a sub-category link under an expanded category, e.g. ("Women", "Dress"). */
  subCategoryLink(category: "Women" | "Men" | "Kids", subCategory: string): Locator {
    return this.categoryProducts
      .locator(`#${category}`)
      .getByRole("link", { name: subCategory, exact: true });
  }

  /**
   * Returns a sidebar brand link, e.g. "Polo". Matched by its target, because
   * the link text also holds the product count, like "(6)Polo".
   */
  brandLink(brand: string): Locator {
    return this.brandProducts.locator(`a[href="/brand_products/${brand}"]`);
  }
}
