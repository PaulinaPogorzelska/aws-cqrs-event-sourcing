import { EmailAddress } from "../valueObjects/EmailAddress";
import { OrderId } from "../valueObjects/OrderId";
import { Price } from "../valueObjects/Price";
import { OrderEvent } from "./OrderEvent";

export class OrderCreated implements OrderEvent {
  constructor(
    readonly orderId: OrderId,
    readonly customerEmail: EmailAddress,
    readonly price: Price,
    readonly comment: string,
    readonly isDiscountApplied: boolean
  ) {}
}
