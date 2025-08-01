import { Page } from "@playwright/test";

export class Helpers {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static isAscending(numericPopulation: number[]): boolean {
    for (let i: number = 0; i < numericPopulation.length; i++) {
      if (numericPopulation[i] > numericPopulation[i + 1]) {
        return false;
      }
    }
    return true;
  }

  static isDescending(numericPopulation: number[]): boolean {
    for (let i: number = 0; i < numericPopulation.length; i++) {
      if (numericPopulation[i] < numericPopulation[i + 1]) {
        return false;
      }
    }
    return true;
  }

  isAscending2(numericPopulation: number[]) {
    for (let i: number = 0; i < numericPopulation.length; i++) {
      if (numericPopulation[i] > numericPopulation[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
