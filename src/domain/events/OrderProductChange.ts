import { OrderId } from "../valueObjects/OrderId";
import { ProductId } from "../valueObjects/ProductId";
import { OrderEvent } from "./OrderEvent";

export class OrderProductChange implements OrderEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly orderId: OrderId
  ) {}
}
