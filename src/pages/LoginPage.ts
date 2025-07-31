import { expect, Locator, Page } from "@playwright/test";
import { Constants } from "../utils/constants";

export class LoginPage {
  private readonly page: Page;
  private readonly usernameTextbox: Locator;
  private readonly passwordTextbox: Locator;
  private readonly loginButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameTextbox = page.locator("//input[@id='username']");
    this.passwordTextbox = page.locator("//input[@id='password']");
    this.loginButton = page.locator("(//i[@class='fa fa-2x fa-sign-in'])[1]");
    this.successMessage = page.locator("(//div[@id='flash'])[1]");
  }

  async validLogin(username: string, password: string): Promise<void> {
    await this.page.goto("https://the-internet.herokuapp.com/login");
    await this.usernameTextbox.fill(username);
    await this.passwordTextbox.fill(password);
    await this.loginButton.click();
    await this.page.waitForTimeout(2000);
    expect(await this.successMessage.textContent()).toContain(
      Constants.successMessage,
    );
  }

  async invalidLogin(username: string, password: string): Promise<void> {
    await this.page.goto("https://the-internet.herokuapp.com/login");
    await this.usernameTextbox.fill(username);
    await this.passwordTextbox.fill(password);
    await this.loginButton.click();
    await this.page.waitForTimeout(2000);
    expect(await this.successMessage.textContent()).toContain(
      Constants.errorMessage,
    );
  }
}
