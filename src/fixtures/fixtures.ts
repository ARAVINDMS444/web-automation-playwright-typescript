export { expect } from "@playwright/test";

import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { Actions } from "../utils/actions";

type PageFixtures = {
  loginPage: LoginPage;
  actions: Actions;
};

export const test = baseTest.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  actions: async ({ page }, use) => {
    const actions = new Actions(page);
    await use(actions);
  },
});
