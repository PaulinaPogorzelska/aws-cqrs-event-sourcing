import { Command } from "@castore/core";
import { orderEventStore } from "../../eventStore";
import { Result } from "../Result";
import { Order } from "../../../domain/Order";

interface Input {
  orderId: string;
  productId: string;
}

interface Context {
  order: Order;
}

export const addProductToOrderCommand = new Command({
  commandId: "ADD_PRODUCT_TO_ORDER",
  requiredEventStores: [orderEventStore],
  handler: async (
    commandInput: Input,
    [orderEventStore],
    { order }: Context
  ) => {
    const { orderId, productId } = commandInput;

    order.addOrderItem();

    await orderEventStore.pushEvent({
      aggregateId: "",
      version: 1,
      type: "PRODUCT_ADDED_TO_ORDER",
      payload: { orderId, productId },
    });

    return { result: Result.Success };
  },
});
