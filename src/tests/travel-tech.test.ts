// Test Scenario
// 1.	Open the travel website -> https://blazedemo.com/.
// 2.	Enter From and To cities (e.g., Boston → New York).
// 3.	Click Search Flights.
// 4.	Fetch only Virgin America flights.
// 5.	Sort by lowest price.
// 6.	Select the cheapest Virgin America flight.
// 7.	Confirm booking and verify success message.

import { expect, Locator, test } from "@playwright/test";

test("ui test - navigate -> search flights -> fetch air india -> book cheapest flight -> validate success message", async ({
  page,
}): Promise<void> => {
  // Step 1: Open the travel website.
  await page.goto("https://blazedemo.com/");

  // Step 2: Enter From and To cities.
  await page.locator('select[name="fromPort"]').selectOption("Boston");
  await page.locator('select[name="toPort"]').selectOption("New York");

  // Step 3: Click Search Flights.
  await page.getByRole("button", { name: "Find Flights" }).click();

  // Step 4: Fetch only Virgin America flights.
  const flights: Locator = page.locator("//tbody/tr/td[3]");
  const count: number = await flights.count();
  const virginAmericaFlights: any[] = [];

  for (let i: number = 0; i < count; i++) {
    const airline: string = await flights.nth(i).textContent();
    if (airline.trim().toLowerCase() === "virgin america") {
      const price: string = await page
        .locator(`//tbody/tr[${i + 1}]/td[6]`)
        .textContent();
      const priceNumeric: number = parseFloat(price.replace("$", ""));
      virginAmericaFlights.push(airline, priceNumeric, i);
    }
  }

  // Step 5: Sort by lowest price.
  virginAmericaFlights.sort((a, b): number => a.price - b.price);
  const cheapestIndex: number = virginAmericaFlights[2];

  // Step 6: Select the cheapest Virgin America flight.
  await page.locator(`//tbody/tr[${cheapestIndex + 1}]/td[1]`).click();

  // Step 7: Confirm booking and verify success message.
  await page.getByRole("checkbox", { name: "Remember me" }).check();
  await page.getByRole("button", { name: "Purchase Flight" }).click();
  expect(
    await page
      .getByRole("heading", { name: "Thank you for your purchase" })
      .textContent(),
  ).toContain("Thank you for your purchase");
});
