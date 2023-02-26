import { EventBridgeHandler } from "aws-lambda";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { asyncMiddleware } from "../../../shared/asyncMiddleware/asyncMiddleware";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { logger } from "../../../shared/logger/logger";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";
import { Order } from "../../entities/Order";

const orderRepository: OrderRepository = new DynamoOrderRepository();

interface Detail {
  data: {
    price: {
      amount: number;
      currency: string;
    };
    customerEmail: string;
    comment: string;
    isDiscountApplied: boolean;
  };
  version: number;
  orderId: string;
}

export const handler: EventBridgeHandler<"onProductCreated", Detail, void> =
  asyncMiddleware(async (event) => {
    logger.info({ event }, "Event");

    const {
      version,
      orderId,
      data: { customerEmail, comment, price, isDiscountApplied },
    } = event.detail;

    try {
      await orderRepository.findById(orderId);

      logger.warn("Order already created");
    } catch (err) {
      if ((err as IllegalArgumentException).message === "Order not found") {
        await orderRepository.create(
          new Order(
            orderId,
            customerEmail,
            `${price.amount} ${price.currency}`,
            comment,
            isDiscountApplied,
            [],
            version
          )
        );
      }

      throw new Error((err as Error).message);
    }
  });
