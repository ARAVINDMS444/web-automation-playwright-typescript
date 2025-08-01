import { APIResponse, expect, Locator, test } from "@playwright/test";

test.skip("ui test amazon: navigate → search → validate → add to cart → assert", async ({
  page,
}): Promise<void> => {
  // Step 1: Navigate to amazon.in
  await page.goto("amazon_home_url");

  // Step 2: Search for product "iPhone 16 Plus"
  await page.locator("search_textbox").fill("iPhone 16 Plus");
  await page.locator("search_button").click();
  await page.waitForTimeout(3000);

  // Step 3: Validate all the search results has "iPhone 16 Plus"
  const products: Locator = page.locator("all_products_common_locator");
  const count: number = await products.count();

  for (let i: number = 0; i < count; i++) {
    const productName = await products.nth(i).textContent();
    expect(productName).toContain("iPhone 16 Plus");
  }

  // Step 4: Fetch the first item name
  const actualProduct: string = await products.nth(0).textContent();

  // Step 5: Add First item to cart
  await products.nth(1).click();

  // Step 6: Fetch the item from the cart
  const expectedProduct: string = await page
    .locator("added_item")
    .textContent();

  // Step 7: Validate the same first item is displayed in the cart
  expect(actualProduct).toContain(expectedProduct);
});

test.skip("ui test amazon: navigate → search → validate price → add to cart → assert", async ({
  page,
}): Promise<void> => {
  // Step 1: Navigate to amazon.com
  await page.goto("amazon_home_url");

  // Step 2: Search for product "iPhone 16 Plus"
  await page.locator("search_textbox").fill("iPhone 16 Plus");
  await page.locator("search_button").click();
  await page.waitForTimeout(3000);

  // Step 3: Validate all the search results has "iPhone 16 Plus"
  const prices: string[] = await page
    .locator("all_products_common_locator")
    .allTextContents();
  const pricesNumeric: number[] = prices.map((p) => Number(p.replace("$", "")));

  // Step 4: Fetch the first item price
  const actualPrice: number = pricesNumeric[0];

  // Step 5: Add First item to cart
  await page.locator("first_item").click();

  // Step 6: Fetch the item from the cart
  const cartPrice: string = await page.locator("added_item").textContent();
  const expectedPrice: number = parseInt(cartPrice);

  // Step 7: Validate the same price is displayed in the cart
  expect(actualPrice).toBe(expectedPrice);
});

test.skip("api test amazon: login → search → validate name → add to cart → assert", async ({
  request,
}): Promise<void> => {
  const baseUrl: string = "https://amazon.in";
  const bearerToken: string = "dummyBearerToken";

  // Step 1: Login to amazon.in
  const loginResponse: APIResponse = await request.post(`${baseUrl}/login`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });
  const loginResponseBody: any = await loginResponse.json();
  console.log(JSON.stringify(loginResponseBody));
  expect(loginResponseBody).toHaveProperty("email", "testuser123@fake.com");

  // Step 2: Search "iPhone 16 Plus" product
  const searchResponse: APIResponse = await request.get(
    `${baseUrl}/search?product=iPhone16Plus`,
  );
  const searchResponseBody: any = await searchResponse.json();
  console.log(JSON.stringify(searchResponseBody));

  // Step 3: Validate all the products have name "iPhone 16 Plus"
  for (const product of searchResponseBody.products) {
    expect(product.name).toBe("iPhone 16 Plus");
  }

  // Step 4: Fetch the first item name
  const actualName: string = searchResponseBody.products[0].name;

  // Step 5: Add first item to cart
  const addToCartResponse: APIResponse = await request.post(
    `${baseUrl}/addToCart`,
    {
      data: {
        productName: "iPhone 16 Plus",
        quantity: "1",
      },
    },
  );
  const addToCartResponseBody: any = await addToCartResponse.json();
  console.log(JSON.stringify(addToCartResponseBody));

  // Step 6: Fetch the item name from the cart
  const cartResponse: APIResponse = await request.get(`${baseUrl}/cart`);
  const cartResponseBody: any = await cartResponse.json();
  console.log(JSON.stringify(cartResponseBody));
  const expectedName: string = cartResponseBody.product.name;

  // Step 7: Validate the same item is added in the cart
  expect(actualName).toBe(expectedName);
});
