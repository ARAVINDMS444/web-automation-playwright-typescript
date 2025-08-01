import { test } from "../fixtures/fixtures";
import { DataProviders } from "../utils/dataProviders";
import { expect, Locator } from "@playwright/test";

test("ui test - fixtures", async ({ loginPage }): Promise<void> => {
  await loginPage.validLogin("tomsmith", "SuperSecretPassword!");
});

test("ui test - helpers", async ({ page, helpers }): Promise<void> => {
  await page.goto("https://practice-automation.com/tables/");
  await page
    .locator("(//span[normalize-space()='Population (million)'])[1]")
    .click();
  await page.waitForTimeout(2000);
  const stringPopulation: string[] = await page
    .locator("(//table[@id='tablepress-1'])[1]/tbody/tr/td[3]")
    .allTextContents();
  const numericPopulation: number[] = stringPopulation.map((p) => Number(p));

  const flag: boolean = helpers.isAscending2(numericPopulation);

  expect(flag).toBeTruthy();
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
