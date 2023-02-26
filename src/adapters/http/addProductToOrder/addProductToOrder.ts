import { APIGatewayProxyHandler } from "aws-lambda";
import joi from "joi";
import { addProductToOrderCommand } from "../../../app/command/AddProductToOrder/AddProductToOrder";
import { ProductRepository } from "../../../ports/database/ProductRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { DynamoProductRepository } from "../../database/DynamoProductRepository/DynamoProductRepository";
import { orderEventStore } from "../../database/OrderEventStore/orderEventStore";
import { httpMiddleware } from "../httpMiddleware/httpMiddleware";

const schema = joi.object({
  id: joi.string().uuid().required(),
});

interface ParsedBody {
  id: string;
}

const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: APIGatewayProxyHandler = httpMiddleware(async (event) => {
  const { pathParameters, body } = event;

  if (!body || !pathParameters) {
    throw new IllegalArgumentException("Missing body or params");
  }

  const parsedBody: ParsedBody = JSON.parse(body);

  const { error: bodyError } = schema.validate(parsedBody);

  if (bodyError) {
    throw new IllegalArgumentException(bodyError.message);
  }

  const { error: pathParametersError } = schema.validate(pathParameters);

  if (pathParametersError) {
    throw new IllegalArgumentException(pathParametersError.message);
  }

  await addProductToOrderCommand.handler(
    {
      orderId: pathParameters.id as string,
      productId: parsedBody.id,
    },
    [orderEventStore],
    { productRepository }
  );

  return "Product added";
});
