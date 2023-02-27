import { APIGatewayProxyHandler } from "aws-lambda";
import joi from "joi";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";
import { httpMiddleware } from "../httpMiddleware/httpMiddleware";
import { getProductQueryHandler } from "../../../app/query/getProduct/getProduct";
import { instanceToPlain } from "class-transformer";

const schema = joi.object({
  id: joi.string().uuid().required(),
});

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: APIGatewayProxyHandler = httpMiddleware(async (event) => {
  const { pathParameters } = event;

  if (!pathParameters) {
    throw new IllegalArgumentException("Missing params");
  }

  const { error } = schema.validate(pathParameters);

  if (error) {
    throw new IllegalArgumentException(error.message);
  }

  const order = await getProductQueryHandler(
    { id: pathParameters.id as string },
    { orderRepository }
  );

  return instanceToPlain(order);
});
