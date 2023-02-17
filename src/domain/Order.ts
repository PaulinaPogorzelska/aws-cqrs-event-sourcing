import { DomainEvent } from "./DomainEvent";
import { OrderProductChange } from "./events/OrderProductChange";
import { OrderData } from "./valueObjects/OrderData";
import { Product } from "./valueObjects/Product";

// Max 10 items in order, if over 5 items in order then 10% discount

export class Order {
  private readonly MIN_ORDER_ITEMS_DISCOUNT_COUNT = 5;
  private readonly MAX_ORDER_ITEMS = 10;
  private readonly ORDER_DISCOUNT_RATE = 0.2;

  constructor(
    private readonly data: OrderData,
    private readonly products: Product[]
  ) {}

  createOrder() {
    // order created
  }

  addOrderItem(productToAdd: Product): OrderProductChange {
    // logic

    return new OrderProductChange(this.data.orderId, productToAdd.valueOf().id);
  }

  removeOrderItem() {}
}
