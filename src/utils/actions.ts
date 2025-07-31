import { Locator, Page } from "@playwright/test";

export class Actions {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async dragAndDrop(
    sourceElement: Locator,
    targetElement: Locator,
  ): Promise<void> {
    await sourceElement.dragTo(targetElement);
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }
}
