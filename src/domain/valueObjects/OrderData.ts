import { EmailAddress } from "./EmailAddress";
import { OrderId } from "./OrderId";
import { Price } from "./Price";

export class OrderData {
  constructor(
    public readonly orderId: OrderId,
    public readonly customerEmail: EmailAddress,
    public readonly price: Price,
    public readonly comment: string,
    public readonly isDiscountApplied: boolean
  ) {}
}
