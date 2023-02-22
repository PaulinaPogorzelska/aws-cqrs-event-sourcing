import { Price } from "../../domain/valueObjects/Price";
import { ProductId } from "../../domain/valueObjects/ProductId";

export class Product {
  constructor(
    readonly id: ProductId,
    readonly name: string,
    readonly price: Price
  ) {}
}
