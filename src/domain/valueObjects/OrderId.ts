import { Uuid } from "../../shared/utils/Uuid";

export class OrderId extends Uuid {
  static generate(): OrderId {
    return super.generate();
  }
}
