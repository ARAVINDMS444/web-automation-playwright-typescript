import { APIResponse, expect, test } from "@playwright/test";

test("api test - GET user account detail by email", async ({
  request,
}): Promise<void> => {
  const baseUrl = "https://automationexercise.com";
  const email = "testuser123@fake.com";

  const response: APIResponse = await request.get(
    `${baseUrl}/api/getUserDetailByEmail?email=${email}`,
  );
  const responseBody: any = await response.json();

  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty("responseCode", 200);
  expect(responseBody.responseCode).toBe(200);
  expect(responseBody.user.id).toBe(858134);
  expect(responseBody.user.name).toBe("TestUser");
  expect(responseBody.user.email).toBe("testuser123@fake.com");
  expect(responseBody).toHaveProperty("user.name", "TestUser");
});

test("api test - search for 'tshirt'", async ({ request }) => {
  const response: APIResponse = await request.post(
    "https://automationexercise.com/api/searchProduct",
    {
      form: {
        search_product: "tshirt",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  const responseBody: any = await response.json();

  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty("products[0].id", 2);
});

test("api test - POST To Verify Login with valid details", async ({
  request,
}) => {
  const baseUrl = "https://automationexercise.com";
  const response: APIResponse = await request.post(
    `${baseUrl}/api/verifyLogin`,
    { form: { email: "testuser123@fake.com", password: "testuser123" } },
  );
  const responseBody: any = await response.json();
  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty("responseCode", 200);
  expect(responseBody).toHaveProperty("message", "User exists!");
});
