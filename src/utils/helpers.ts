export class Helpers {
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
}
