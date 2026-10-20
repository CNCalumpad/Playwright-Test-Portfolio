import { mergeTests, expect } from "@playwright/test";
import { test as adBlockTest } from "./adBlock";
import { test as testUserInput } from "./testUser";

export const test = mergeTests(adBlockTest, testUserInput);
export { expect };
