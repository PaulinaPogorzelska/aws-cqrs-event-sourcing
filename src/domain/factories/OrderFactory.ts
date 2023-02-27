import { Order } from "../Order";
import { EmailAddress } from "../valueObjects/EmailAddress";
import { OrderData } from "../valueObjects/OrderData";
import { OrderId } from "../valueObjects/OrderId";
import { Price } from "../valueObjects/Price";
import { ProductId } from "../valueObjects/ProductId";

export class OrderFactory {
  static create(
    orderId: OrderId,
    customerEmail: EmailAddress,
    price: Price,
    comment: string,
    products: ProductId[]
  ): Order {
    return new Order(
      new OrderData(
        orderId,
        customerEmail,
        price,
        comment,
        Order.shouldDiscountBeApplied(products)
      ),
      products
    );
  }
}
