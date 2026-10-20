import { test as base, expect } from "@playwright/test";

const AD_DOMAINS = [
  "doubleclick.net",
  "googlesyndication.com",
  "adservice.google.com",
  "ads.pubmatic.com",
  "securepubads.g.doubleclick.net",
  "pagead2.googlesyndication.com",
  "ads.google.com",
];

// Overrides the built-in `page` fixture so every test that imports this
// `test` gets ad requests aborted automatically, with no per-spec setup.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("**/*", async (route) => {
      const url = route.request().url();

      if (AD_DOMAINS.some((domain) => url.includes(domain))) {
        await route.abort();
      } else {
        await route.continue();
      }
    });

    await use(page);
  },
});

export { expect };
