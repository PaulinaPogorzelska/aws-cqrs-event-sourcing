import type { APIGatewayProxyHandler } from "aws-lambda";
import joi from "joi";
import { createOrderCommand } from "../../../app/command/CreateOrder/CreateOrder";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { orderEventStore } from "../../database/OrderEventStore/orderEventStore";
import { httpMiddleware } from "../httpMiddleware/httpMiddleware";

const schema = joi.object({
  customerEmail: joi.string().email().required(),
});

interface ParsedBody {
  customerEmail: string;
}

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

  const { customerEmail } = parsedBody;

  return createOrderCommand.handler({ customerEmail }, [orderEventStore]);
}, 201);
