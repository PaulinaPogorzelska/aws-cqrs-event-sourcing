import { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { AttributeMap, Converter } from "aws-sdk/clients/dynamodb";
import { ProductId } from "../../../domain/valueObjects/ProductId";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { ProductRepository } from "../../../ports/database/ProductRepository";
import { logger } from "../../../shared/logger/logger";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";
import { DynamoProductRepository } from "../../database/DynamoProductRepository/DynamoProductRepository";
import { orderEventStore } from "../../database/OrderEventStore/orderEventStore";
import { Order } from "../../entities/Order";
import { projectionMiddleware } from "../projectionMiddleware/projectionMiddleware";

const productRepository: ProductRepository = new DynamoProductRepository();
const orderRepository: OrderRepository = new DynamoOrderRepository();

const getOrderProducts = (productIds: ProductId[]) => {
  const productsPromises = productIds.map((productId) =>
    productRepository.findById(productId)
  );

  return Promise.all(productsPromises);
};

const getOrder = async (event: DynamoDBRecord) => {
  const { aggregateId } = Converter.unmarshall(
    event.dynamodb?.Keys as AttributeMap
  );

  const { aggregate } = await orderEventStore.getAggregate(aggregateId);

  if (!aggregate) {
    throw new Error(`Aggregate ${aggregateId} not found`);
  }

  const { amount, currency } = aggregate.price.valueOf();

  const products = await getOrderProducts(aggregate.products);

  return new Order(
    aggregateId,
    aggregate.customerEmail.valueOf(),
    `${amount} ${currency}`,
    aggregate.comment,
    aggregate.isDiscountApplied,
    products
  );
};

export const handler: DynamoDBStreamHandler = projectionMiddleware(
  async (event) => {
    const ordersPromises = event.Records.map(async (event) => getOrder(event));

    const orders = await Promise.all(ordersPromises);

    const putProjectionsPromises = orders.map((order) =>
      orderRepository.put(order)
    );

    const savedProjections = await Promise.all(putProjectionsPromises);

    logger.info({ savedProjections }, "Saved projections");
  }
);
