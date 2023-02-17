import { Price } from "./Price";
import { ProductId } from "./ProductId";

export class Product {
  private constructor(
    private readonly id: ProductId,
    private readonly price: Price
  ) {}

  static from(id: ProductId, price: Price) {
    return new Product(id, price);
  }

  valueOf() {
    return { id: this.id, price: this.price };
  }
}
