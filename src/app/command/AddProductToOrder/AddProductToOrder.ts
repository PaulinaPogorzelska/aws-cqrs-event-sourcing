import { Command } from "@castore/core";
import { orderEventStore } from "../../../adapters/database/OrderEventStore/orderEventStore";
import { OrderFactory } from "../../../domain/factories/OrderFactory";
import { OrderId } from "../../../domain/valueObjects/OrderId";
import { ProductRepository } from "../../../ports/database/ProductRepository";
import { OrderAggregate } from "../../aggregate";

interface Input {
  orderId: string;
  productId: string;
}

interface Context {
  productRepository: ProductRepository;
}

const getOrder = (id: OrderId, aggregate: OrderAggregate) => {
  return OrderFactory.create(
    id,
    aggregate.customerEmail,
    aggregate.price,
    aggregate.comment,
    aggregate.products
  );
};

export const addProductToOrderCommand = new Command({
  commandId: "ADD_PRODUCT_TO_ORDER",
  requiredEventStores: [orderEventStore],
  handler: async (
    { orderId, productId }: Input,
    [orderEventStore],
    { productRepository }: Context
  ) => {
    const { aggregate } = await orderEventStore.getAggregate(orderId);

    if (!aggregate) {
      throw new Error("Aggregate not found");
    }

    const { version } = aggregate;

    const product = await productRepository.findById(productId);

    const order = getOrder(orderId, aggregate);

    order.addOrderItem(product);

    await orderEventStore.pushEvent({
      type: "PRODUCT_ADDED_TO_ORDER",
      payload: {
        productId,
        productPrice: product.price.valueOf(),
      },
      aggregateId: orderId,
      version: version + 1,
    });
  },
});
