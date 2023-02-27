import { OrderId } from "../valueObjects/OrderId";
import { Price } from "../valueObjects/Price";
import { ProductId } from "../valueObjects/ProductId";
import { OrderEvent } from "./OrderEvent";

export class OrderProductChanged implements OrderEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly orderId: OrderId
  ) {}
}
