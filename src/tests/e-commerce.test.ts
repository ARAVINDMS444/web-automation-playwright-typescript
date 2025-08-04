import { expect, Locator, test } from "@playwright/test";
import { readdirSync, readFileSync } from "fs";
import * as path from "node:path";

test("ui test e2e shopping flow: navigate -> login -> search -> addToCart -> checkout -> payment -> downloadInvoice", async ({
  page,
}): Promise<void> => {
  // Step 1: Navigate to application
  await page.goto("https://automationexercise.com/");

  // Step 2: Login to application
  await page.locator("//a[normalize-space()='Signup / Login']").click();
  await page
    .locator("//input[@data-qa='login-email']")
    .fill("testuser123@fake.com");
  await page.locator("//input[@placeholder='Password']").fill("testuser123");
  await page.locator("//button[normalize-space()='Login']").click();
  expect(
    await page.locator("//b[normalize-space()='TestUser']").textContent(),
  ).toEqual("TestUser");

  // Step 3: Search Product 'T-Shirt' and validate
  await page.locator("(//a[@href='/products'])[1]").click();
  await page.locator("(//input[@id='search_product'])[1]").fill("T-Shirt");
  await page.locator("(//i[@class='fa fa-search'])[1]").click();

  // Step 4: Validate Product list contains items with "T-Shirt" in the name or description
  const products: Locator = page.locator("//p[contains(text(),'T-Shirt')]");
  const count: number = await products.count();
  const productsTitle: string[] = [];

  for (let i: number = 0; i < count; i++) {
    const productName: string = await products.nth(i).textContent();
    expect(productName).toContain("T-Shirt");
    productsTitle.push(productName);
  }

  // Step 5: Add Two T-Shirts to cart
  await page.locator("(//img[@alt='ecommerce website products'])[1]").hover();
  await page.locator("(//a[contains(text(),'Add to cart')])[1]").click();
  await page.locator("//button[normalize-space()='Continue Shopping']").click();
  await page.waitForTimeout(2000);
  await page.locator("(//img[@alt='ecommerce website products'])[2]").hover();
  await page.locator("(//a[contains(text(),'Add to cart')])[3]").click();
  await page.locator("//u[normalize-space()='View Cart']").click();
  await page.waitForTimeout(2000);

  // Step 6: Validate cart list contains items with "T-Shirt" in the name or description
  const cartProducts: Locator = page.locator("//a[contains(text(),'T-Shirt')]");
  const cartCount: number = await cartProducts.count();
  const cartProductsTitle: string[] = [];

  for (let i: number = 0; i < cartCount; i++) {
    const cartProductName: string = await cartProducts.nth(i).textContent();
    expect(cartProductName).toContain("T-Shirt");
    cartProductsTitle.push(cartProductName);
  }

  // Step 7: Validate same products are displayed in the cart
  expect(cartProductsTitle[0]).toEqual(productsTitle[0]);
  expect(cartProductsTitle[1]).toEqual(productsTitle[2]);

  // Step 8: Fetch the total price of the products
  const cartAmounts: Locator = page.locator("//p[contains(.,'Rs.')]");
  const cartAmountCount: number = await cartAmounts.count();
  const cartPricesString: string[] = [];

  for (let i: number = 0; i < cartAmountCount; i += 2) {
    const cartAmount: string = await cartAmounts.nth(i).textContent();
    cartPricesString.push(cartAmount);
  }

  let cartTotalPrice: number = 0;
  const cartPricesNumeric: number[] = cartPricesString
    .map((p) => p.replace("Rs. ", ""))
    .map(Number);

  for (let i: number = 0; i < cartPricesNumeric.length; i++) {
    cartTotalPrice += cartPricesNumeric[i];
  }

  // Step 9: Checkout products
  await page
    .locator("(//a[normalize-space()='Proceed To Checkout'])[1]")
    .click();
  await page
    .locator("(//textarea[@name='message'])[1]")
    .fill("Please deliver ASAP");
  await page.locator("(//a[normalize-space()='Place Order'])[1]").click();
  await page.waitForTimeout(2000);

  // Step 10: Payment flow
  await page.locator("(//input[@name='name_on_card'])[1]").fill("Test User");
  await page.locator("(//input[@name='card_number'])[1]").fill("11111111111");
  await page.locator("(//input[@placeholder='ex. 311'])[1]").fill("123");
  await page.locator("(//input[@placeholder='MM'])[1]").fill("12");
  await page.locator("(//input[@placeholder='YYYY'])[1]").fill("2030");
  expect(
    await page
      .locator(
        "(//div[contains(text(),'Your order has been placed successfully!')])[1]",
      )
      .textContent(),
  ).toContain("Your order has been placed successfully!");
  await page
    .locator("(//button[normalize-space()='Pay and Confirm Order'])[1]")
    .click();
  await page.waitForTimeout(2000);
  expect(
    await page
      .locator(
        "(//p[normalize-space()='Congratulations! Your order has been confirmed!'])[1]",
      )
      .textContent(),
  ).toContain("Congratulations! Your order has been confirmed!");

  // Step 11: Download invoice
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    await page
      .locator("(//a[normalize-space()='Download Invoice'])[1]")
      .click(),
  ]);

  const fileName: string = download.suggestedFilename();
  const filePath: string = path.resolve("src/artifacts/downloads");
  await download.saveAs(path.join(filePath, fileName));
  await page.waitForTimeout(2000);

  // Step 12: Logout from application
  await page.locator("(//a[normalize-space()='Logout'])[1]").click();
  expect(
    await page
      .locator("(//h2[normalize-space()='Login to your account'])[1]")
      .textContent(),
  ).toContain("Login to your account");

  // Step 13: Extract Total price from invoice
  const downloadDir = "src/artifacts/downloads";

  const files: string[] = readdirSync(downloadDir);
  const txtFile: string = files.find((file) => file.endsWith(".txt"));

  const filePath2: string = path.join(downloadDir, txtFile);
  const content: string = readFileSync(filePath2, "utf-8");

  const match: RegExpMatchArray = content.match(/amount is (\d+)/);
  const totalInvoiceAmount: number = parseInt(match[1]);

  // Step 14: Validate Total prices in the cart and invoice are equal
  expect(cartTotalPrice).toBe(totalInvoiceAmount);
});
