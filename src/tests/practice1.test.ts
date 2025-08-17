import {
  APIResponse,
  Dialog,
  expect,
  FrameLocator,
  Locator,
  test,
} from "@playwright/test";
import * as path from "path";
import { Helpers } from "../utils/helpers";
import { TestData } from "../utils/testData";
import { LoginPage } from "../pages/LoginPage";

test.skip("ui test - amazon - search and add product to cart", async ({
  page,
}): Promise<void> => {
  // Go to Amazon
  await page.goto("https://www.amazon.in/");
  await page.waitForLoadState("domcontentloaded");

  // Search for product
  const searchInput: Locator = page.locator(
    "//input[@id='twotabsearchtextbox']",
  );
  await searchInput.fill("iphone 16 plus");
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  // Validate search results
  const productList: Locator = page.locator(
    "//span[contains(text(),'iPhone 16 Plus 128 GB')]",
  );
  const count: number = await productList.count();
  await page.waitForTimeout(3000);

  for (let i: number = 0; i < count; i++) {
    const title: string = await productList.nth(i).textContent();
    expect(title.toLowerCase()).toContain("iphone");
  }

  // Open product and fetch the product name
  await productList.nth(7).click();
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);
  const actualProductName: string = await page
    .locator("(//span[@id='productTitle'])[1]")
    .textContent();
  const actualText: string = actualProductName
    .trim()
    .toLowerCase()
    .slice(0, 30);

  // Add to cart
  await page.waitForLoadState("domcontentloaded");
  const addToCartButton: Locator = page
    .getByRole("button", { name: "Add to Cart" })
    .first();
  await addToCartButton.click();
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  // Validate success message
  const successMessage: Locator = page.locator(
    "(//h1[normalize-space()='Added to cart'])[1]",
  );
  await expect(successMessage).toBeVisible();
  const message: string = await successMessage.textContent();
  expect(message.toLowerCase()).toContain("added to cart");
  await page.waitForTimeout(3000);

  // Confirm same item is added
  await page.locator("(//span[@class='a-button-inner'])[4]").click();
  const expectedProductName: string = await page
    .locator("(//span[@class='a-truncate-cut'])[1]")
    .textContent();
  const expectedText: string = expectedProductName
    .trim()
    .toLowerCase()
    .slice(0, 30);
  expect(actualText).toContain(expectedText);
});

test.skip("api test - amazon - search and add product to cart", async ({
  request,
}): Promise<void> => {
  const baseUrl: string = `https://www.amazon.in`;
  const bearerToken: string = "bearerToken";

  // Login to amazon
  const loginResponse: APIResponse = await request.post(
    `${baseUrl}/api/login`,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
    },
  );
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody: any = await loginResponse.json();
  expect(loginResponseBody.email).toContain("@gmail.com");

  // Search products
  const searchResponse: APIResponse = await request.get(
    `${baseUrl}/api/search?query=iphone16Plus`,
  );
  expect(searchResponse.status()).toBe(200);

  const searchResponseBody: any = await searchResponse.json();

  // Validate all products contain 'iphone'
  for (const product of searchResponseBody.products) {
    expect(product.title.toLowerCase()).toContain("iphone");
  }

  // Add product to cart
  const addResponse: APIResponse = await request.post(`${baseUrl}/api/add`, {
    data: { productId: "iphone-16-plus", quantity: 1 },
  });
  expect(addResponse.status()).toBe(200);

  // Validate the message in the cart
  const addResponseBody: any = await addResponse.json();
  expect(addResponseBody.message.toLowerCase()).toContain("added to cart");
});

test("sorting test - swag labs - search product and sort and validate", async ({
  page,
}): Promise<void> => {
  // Navigate to sauce demo
  await page.goto("https://www.saucedemo.com/v1/");

  // Login to swag labs application
  await page.locator("//input[@id='user-name']").fill("standard_user");
  await page.locator("//input[@id='password']").fill("secret_sauce");
  await page.locator("//input[@id='login-button']").click();

  // Click on product sort dropdown
  await page
    .locator("(//select[@class='product_sort_container'])[1]")
    .waitFor();
  await page.locator("(//select[@class='product_sort_container'])[1]").click();
  await page.getByRole("combobox").selectOption("lohi");

  // Fetch all the prices and store in an array
  const prices: string[] = await page
    .locator("//div[contains(text(),'$')]")
    .allTextContents();
  const sortedPrices: number[] = prices
    .map((p) => p.replace("$", ""))
    .map(Number);

  const flag: boolean = Helpers.isAscending(sortedPrices);

  // Validate the sorted array is in ascending order
  expect(flag).toBeTruthy();
});

test.skip("api test", async ({ request }): Promise<void> => {
  // Base Url
  const baseUrl: string = `https://www.amazon.in`;
  const bearerToken: string = "bearerToken";

  // Login api
  const loginResponse: APIResponse = await request.post(`${baseUrl}/login`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const loginResponseBody: any = await loginResponse.json();
  expect(loginResponse.status()).toBe(200);
  expect(loginResponseBody.email).toContain("@gmail.com");

  // Search api
  const searchResponse: APIResponse = await request.get(
    `${baseUrl}/search?query=iphone16Plus`,
  );
  const searchResponseBody: any = await searchResponse.json();
  expect(searchResponse.status()).toBe(200);

  for (const product of searchResponseBody.products) {
    expect(product.title.toLowerCase()).toContain("iphone");
  }

  // Add to cart api
  const addToCartResponse: APIResponse = await request.post(
    `${baseUrl}/addToCart`,
    { data: { productTitle: "iphone 16", quantity: 1 } },
  );
  const addToCartResponseBody: any = await addToCartResponse.json();
  expect(addToCartResponse.status()).toBe(200);
  expect(addToCartResponseBody.productTitle).toContain("iphone 16");

  // cart api
  const cartResponse: APIResponse = await request.get(`${baseUrl}/cart`);
  const cartResponseBody: any = await cartResponse.json();
  expect(cartResponse.status()).toBe(200);
  expect(cartResponseBody.productTitle).toContain("iphone 16");
});

test("ui test - windows", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/window-operations/");
  const [page1] = await Promise.all([
    page.waitForEvent("popup"),
    await page.locator("(//b[normalize-space()='New Tab'])[1]").click(),
  ]);
  await page1.bringToFront();
  await page1.waitForTimeout(2000);

  const page1Text: string = await page1
    .locator("//strong[normalize-space()='Start learning']")
    .textContent();
  expect(page1Text).toContain("Start learning");

  await page1.close();
  await page.bringToFront();
  await page.waitForTimeout(2000);

  const pageText: string = await page
    .locator("//h1[normalize-space()='Window Operations']")
    .textContent();
  expect(pageText).toContain("Window Operations");
});

test("ui test - dropdowns", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/form-fields/");
  await page.locator("//select[@id='automation']").selectOption("No");
  await page.waitForTimeout(5000);
});

test("ui test - alerts", async ({ page }) => {
  await page.goto("https://practice-automation.com/popups/");
  await page.locator("//b[normalize-space()='Prompt Popup']").click();

  page.on("dialog", async (dialog: Dialog): Promise<void> => {
    console.log(dialog.message());
    await dialog.accept("@gmail.com");
  });
});

test("ui test - drag and drop", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/gestures/");
  await page
    .locator("//img[@id='dragMe']")
    .dragTo(page.locator("(//div[@id='div2'])[1]"));
  await page.waitForTimeout(2000);
});

test("ui test - frames", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/iframes/");
  const frame: FrameLocator = page.frameLocator("(//iframe)[1]");
  await frame.locator("//a[text()='Get started']").click();
  await frame.locator("//h2[text()='Introduction']").click();
  await expect(frame.locator("//h2[text()='Introduction']")).toHaveText(
    "Introduction",
  );
  await page.waitForTimeout(2000);
});

test("ui test - ads", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/ads/");
  const ads: Locator = page.locator(
    "//div[@id='popmake-1272']//button[@aria-label='Close'][normalize-space()='×']",
  );
  await ads.waitFor({ state: "visible" });
  await ads.click();
  await page.waitForTimeout(2000);
});

test("ui test - tables", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/tables/");
  await page
    .locator("(//span[normalize-space()='Population (million)'])[1]")
    .click();
  await page.waitForTimeout(2000);
  const stringPopulation: string[] = await page
    .locator("(//table[@id='tablepress-1'])[1]/tbody/tr/td[3]")
    .allTextContents();
  const numericPopulation: number[] = stringPopulation.map((p) => Number(p));

  function isAscending(numericPopulation: number[]): boolean {
    for (let i: number = 0; i < numericPopulation.length; i++) {
      if (numericPopulation[i] > numericPopulation[i + 1]) {
        return false;
      }
    }
    return true;
  }

  expect(isAscending(numericPopulation)).toBeTruthy();
});

test("ui test - screenshots", async ({ page }): Promise<void> => {
  const pageScreenshotPath: string = path.join(
    "src/artifacts/screenshots",
    "pageScreenshot.png",
  );
  const elementScreenshotPath: string = path.join(
    "src/artifacts/screenshots",
    "elementScreenshot.png",
  );
  await page.goto("https://practice-automation.com/javascript-delays/");
  await page.locator("//b[normalize-space()='Start']").click();
  const element: Locator = page.locator("img[alt='liftoff']");
  await element.screenshot({ path: elementScreenshotPath });
  await page
    .locator("//div[contains(text(),'Liftoff!')]")
    .waitFor({ state: "visible" });
  expect(
    await page.locator("//div[contains(text(),'Liftoff!')]").textContent(),
  ).toContain("Liftoff!");
  await page.screenshot({ path: pageScreenshotPath, fullPage: true });
});

test("ui test - uploads", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/file-upload/");
  const filePath: any = path.resolve("src/artifacts/uploads/test.pdf");
  await page.locator("(//input[@id='file-upload'])[1]").setInputFiles(filePath);
  await page.waitForTimeout(3000);
  await page.locator("//input[@id='upload-btn']").click();
  expect(
    await page
      .locator(
        "//div[contains(text(),'Thank you for your message. It has been sent.')]",
      )
      .textContent(),
  ).toContain("Thank you for your message. It has been sent.");
});

test("ui test - downloads", async ({ page }): Promise<void> => {
  await page.goto("https://practice-automation.com/file-download/");
  await page.waitForTimeout(2000);
  const filePath: any = path.resolve("src/artifacts/downloads");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    (async (): Promise<void> => {
      await page
        .locator(
          "(//a[@class='wpdm-download-link wpdm-download-locked btn btn-primary '])[1]",
        )
        .click();
      await page
        .locator("#wpdm-lock-frame")
        .contentFrame()
        .getByRole("textbox", { name: "Enter Password" })
        .fill("automateNow");
      await page
        .locator("#wpdm-lock-frame")
        .contentFrame()
        .getByRole("button", { name: "Submit" })
        .click();
    })(),
  ]);
  const fileName: string = download.suggestedFilename();
  await download.saveAs(path.join(filePath, fileName));
});

test("ui test - broken links", async ({ page, request }): Promise<void> => {
  await page.goto("https://practice-automation.com/broken-links/");
  await page.waitForLoadState("domcontentloaded");
  const linksLocator: Locator = page.locator(
    `//a[contains(@href, 'https://')]`,
  );
  const count: number = await linksLocator.count();

  for (let i: number = 0; i < count; i++) {
    const link: string = await linksLocator.nth(i).getAttribute("href");
    const response: APIResponse = await request.get(link);
    try {
      if (response.status() >= 400) {
        console.log(
          `🔴 Broken link: ${link} , Status code: ${response.status()}`,
        );
      }
    } catch (e) {
      console.log(`Error getting link: ${e}`);
    }
  }
});

test("ui test - broken images", async ({ page, request }): Promise<void> => {
  await page.goto("https://practice-automation.com/broken-images/");
  await page.waitForLoadState("domcontentloaded");
  const imagesLocator: Locator = page.locator("//img");
  const count: number = await imagesLocator.count();

  for (let i: number = 0; i < count; i++) {
    const image: string = await imagesLocator.nth(i).getAttribute("src");
    const imageUrl: any = image.startsWith("http")
      ? image
      : new URL(image, page.url()).href;
    const response: APIResponse = await request.get(imageUrl);
    try {
      if (response.status() != 200) {
        console.log(
          `🔴 Broken image: ${image} , Status code: ${response.status()}`,
        );
      }
    } catch (e) {
      console.log(`Error getting image: ${e}`);
    }
  }
});

test.skip("api test - real scenario with tuple", async ({
  request,
}): Promise<void> => {
  const tuples: [number, string, number, string, number][] = [];
  const response: APIResponse = await request.get(
    "https://fakestoreapi.in/api/products",
  );
  const responseBody: any = await response.json();
  expect(response.status()).toBe(200);
  expect(responseBody.status).toEqual("SUCCESS");
  expect(responseBody.message).toContain("Here you go!");

  for (const product of responseBody.products) {
    tuples.push([
      product.id,
      product.title,
      product.price,
      product.brand,
      product.discount,
    ]);
  }

  for (const [id, title, price, brand, discount] of tuples) {
    expect(id).toBeGreaterThan(0);
    expect(price).toBeGreaterThan(0);
  }
});

test("ui test - pom", async ({ page }): Promise<void> => {
  const loginPage = new LoginPage(page);
  await loginPage.validLogin(TestData.username, TestData.password);
});
