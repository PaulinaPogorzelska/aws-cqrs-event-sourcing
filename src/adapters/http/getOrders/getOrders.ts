import { APIGatewayProxyHandler } from "aws-lambda";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";
import { httpMiddleware } from "../httpMiddleware/httpMiddleware";
import { getProductsQueryHandler } from "../../../app/query/getProducts/getProducts";
import { instanceToPlain } from "class-transformer";

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: APIGatewayProxyHandler = httpMiddleware(async () => {
  const orders = await getProductsQueryHandler({ orderRepository });

  return orders.map((order) => instanceToPlain(order));
});
