import { EventBridgeHandler } from "aws-lambda";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { ProductRepository } from "../../../ports/database/ProductRepository";
import { asyncMiddleware } from "../../../shared/asyncMiddleware/asyncMiddleware";
import { logger } from "../../../shared/logger/logger";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";
import { DynamoProductRepository } from "../../database/DynamoProductRepository/DynamoProductRepository";

interface Detail {
  data: {
    productId: string;
    isDiscountApplied: boolean;
    price: {
      amount: number;
      currency: string;
    };
  };
  version: number;
  orderId: string;
}

const orderRepository: OrderRepository = new DynamoOrderRepository();
const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: EventBridgeHandler<
  "PRODUCT_ADDED_TO_ORDER",
  Detail,
  void
> = asyncMiddleware(async (event) => {
  logger.info({ event }, "event");

  const {
    orderId,
    version,
    data: { productId, isDiscountApplied, price },
  } = event.detail;

  const storedOrder = await orderRepository.findById(orderId);

  if (version <= storedOrder.version) {
    return logger.warn("Product has been already added");
  }

  const product = await productRepository.findById(productId);
  await orderRepository.addProduct(
    orderId,
    product,
    isDiscountApplied,
    `${price.amount} ${price.currency}`,
    version
  );
});
