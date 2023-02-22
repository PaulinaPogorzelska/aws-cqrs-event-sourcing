import { Command } from "@castore/core";
import { orderEventStore } from "../../../adapters/database/OrderEventStore/orderEventStore";
import { Order } from "../../../domain/Order";

interface Input {
  customerEmail: string;
}

export const createOrderCommand = new Command({
  commandId: "CREATE_ORDER",
  requiredEventStores: [orderEventStore],
  handler: async ({ customerEmail }: Input, [orderEventStore]) => {
    const order = Order.create(customerEmail);

    const {
      comment,
      customerEmail: validatedCustomerEmail,
      isDiscountApplied,
      price,
      orderId,
    } = order;

    await orderEventStore.pushEvent({
      type: "ORDER_CREATED",
      payload: {
        comment: comment,
        customerEmail: validatedCustomerEmail.valueOf(),
        isDiscountApplied,
        price: price.valueOf(),
      },
      aggregateId: orderId as string,
      version: 1,
    });

    return { id: orderId };
  },
});
