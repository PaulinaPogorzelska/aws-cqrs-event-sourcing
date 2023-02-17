import { InvalidArgumentException } from "../../shared/errors/InvalidArgumentException";

export type SupportedCurrencies = "PLN" | "EUR" | "USD";

export class Price {
  private constructor(
    private readonly amount: number,
    private readonly currency: SupportedCurrencies
  ) {}

  private static validatePrice(amount: number) {
    if (amount <= 0) {
      throw new InvalidArgumentException("Price can't be negative");
    }
  }

  static from(amount: number, currency: SupportedCurrencies) {
    this.validatePrice(amount);

    return new Price(amount, currency);
  }

  valueOf() {
    return { amount: this.amount, currency: this.currency };
  }
}
