import { OrderProductChanged } from "./events/OrderProductChanged";
import { OrderData } from "./valueObjects/OrderData";
import { OrderId } from "./valueObjects/OrderId";
import { EmailAddress } from "./valueObjects/EmailAddress";
import { Price } from "./valueObjects/Price";
import { OrderCreated } from "./events/OrderCreated";
import { DomainError } from "./error/DomainError";
import { Product } from "../adapters/entities/Product";
import { ProductId } from "./valueObjects/ProductId";

export class Order {
  private static readonly MIN_ORDER_ITEMS_DISCOUNT_COUNT = 5;
  private readonly MAX_ORDER_ITEMS = 10;

  constructor(
    private readonly data: OrderData,
    private readonly products: ProductId[]
  ) {}

  static create(customerEmail: string) {
    return new OrderCreated(
      OrderId.generate(),
      EmailAddress.from(customerEmail),
      Price.from(0, "PLN"),
      "",
      Order.shouldDiscountBeApplied([])
    );
  }

  static shouldDiscountBeApplied = (products: ProductId[]) =>
    products.length + 1 >= this.MIN_ORDER_ITEMS_DISCOUNT_COUNT;

  addOrderItem(productToAdd: Product) {
    if (this.products.length === this.MAX_ORDER_ITEMS) {
      throw new DomainError(
        `Too many items assigned to one order, max items: ${this.MAX_ORDER_ITEMS}`
      );
    }

    return new OrderProductChanged(this.data.id, productToAdd.id);
  }

  removeOrderItem(productToRemove: Product): OrderProductChanged {
    const product = this.products.find(
      (productId) => productId === productToRemove.id
    );

    if (!product) {
      throw new DomainError("Product not found in the order");
    }

    return new OrderProductChanged(this.data.id, productToRemove.id);
  }

  valueOf() {
    return {
      ...this.data,
      products: this.products,
    };
  }
}
