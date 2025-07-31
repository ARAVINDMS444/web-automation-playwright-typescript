import { test } from "../fixtures/fixtures";
import { DataProviders } from "../utils/dataProviders";
import { Locator } from "@playwright/test";

test("ui test - fixtures", async ({ loginPage }): Promise<void> => {
  await loginPage.validLogin("tomsmith", "SuperSecretPassword!");
});

test("ui test - actions", async ({ page, actions }): Promise<void> => {
  await actions.navigate("https://practice-automation.com/gestures/");
  const sourceElement: Locator = page.locator("//img[@id='dragMe']");
  const targetElement: Locator = page.locator("(//div[@id='div2'])[1]");
  await actions.dragAndDrop(sourceElement, targetElement);
  await actions.waitForTimeout(2000);
});

DataProviders.invalidLoginData.forEach(({ username, password }): void => {
  test(`ui test - data provider with ${username} & ${password}`, async ({
    loginPage,
  }): Promise<void> => {
    await loginPage.invalidLogin(username, password);
  });
});
