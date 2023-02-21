import { Price } from "../valueObjects/Price";
import { ProductId } from "../valueObjects/ProductId";

export class Product {
  constructor(
    readonly id: ProductId,
    readonly name: string,
    readonly price: Price
  ) {}
}
