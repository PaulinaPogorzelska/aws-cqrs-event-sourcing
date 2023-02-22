import type { APIGatewayProxyHandler } from "aws-lambda";
import joi from "joi";
import { createProductCommand } from "../../../app/command/CreateProduct/CreateProduct";
import { ProductRepository } from "../../../ports/database/ProductRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { DynamoProductRepository } from "../../database/DynamoProductRepository/DynamoProductRepository";
import { httpMiddleware } from "../httpMiddleware/httpMiddleware";

const schema = joi.object({
  name: joi.string().required(),
  priceAmount: joi.number().required(),
});

interface ParsedBody {
  name: string;
  priceAmount: number;
}

const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: APIGatewayProxyHandler = httpMiddleware(async (event) => {
  const { body } = event;

  if (!body) {
    throw new IllegalArgumentException("Missing body");
  }

  const parsedBody: ParsedBody = JSON.parse(body);

  const { error } = schema.validate(parsedBody);

  if (error) {
    throw new IllegalArgumentException(error.message);
  }

  return createProductCommand.handler(parsedBody, [], { productRepository });
}, 201);
