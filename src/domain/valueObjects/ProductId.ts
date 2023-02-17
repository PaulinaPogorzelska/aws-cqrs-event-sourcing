import { Uuid } from "../../shared/utils/Uuid";

export class ProductId extends Uuid {
  static generate(): ProductId {
    return super.generate();
  }
}
