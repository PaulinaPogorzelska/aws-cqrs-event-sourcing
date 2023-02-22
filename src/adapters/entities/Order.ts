import { Product } from "./Product";

export class Order {
  constructor(
    readonly id: string,
    readonly customerEmail: string,
    readonly price: string,
    readonly comment: string,
    readonly isDiscountApplied: boolean,
    readonly products: Product[]
  ) {}
}
