import { InvalidArgumentException } from "../../shared/errors/InvalidArgumentException";

export class EmailAddress {
  constructor(private readonly address: string) {}

  private static isValidAddress(address: string) {
    const [_, domain] = address.split("@");

    // We only support gmail com addresses
    return domain === "gmail.com";
  }

  static from(address: string) {
    if (!this.isValidAddress(address)) {
      throw new InvalidArgumentException();
    }

    return new EmailAddress(address);
  }

  valueOf() {
    return this.address;
  }
}
