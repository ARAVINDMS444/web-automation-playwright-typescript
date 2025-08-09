// Test Scenario
// 1.	Open the demo qa website -> https://demoqa.com/books
// 2.	Search JavaScript course
// 3.	Fetch the JavaScript book with Publisher 'No Starch Press'
// 4.   Validate the book contains JavaScript

import { expect, Locator, test } from "@playwright/test";

test("ui test - navigate -> search javascript course -> fetch the book -> validate", async ({
  page,
}): Promise<void> => {
  // Step 1: Open the demo qa website
  await page.goto("https://demoqa.com/books");

  // Step 2: Search JavaScript course
  await page.locator("//input[@id='searchBox']").fill("JavaScript");

  // Step 3: Fetch the JavaScript book with Publisher 'No Starch Press'
  const book: any[] = [];
  const booksCells: Locator = page.locator(
    "//a[contains(text(),'JavaScript')]",
  );
  const publisherCells: Locator = page.locator("//div[@class='rt-td'][4]");
  const count: number = await booksCells.count();

  for (let i: number = 0; i < count; i++) {
    const bookTitle: string =
      (await booksCells.nth(i).textContent())?.trim() || "";
    const publisher: string =
      (await publisherCells.nth(i).textContent())?.trim() || "";

    if (publisher.toLowerCase() === "no starch press") {
      book.push(bookTitle, publisher);
    }
  }

  // Step 4: Validate the book contains JavaScript
  expect(book[0]).toContain("JavaScript");
});
