import { DynamoDBStreamEvent, Context, Callback } from "aws-lambda";
import { logger } from "../../../shared/logger/logger";

export const eventMiddleware =
  <
    E extends DynamoDBStreamEvent = DynamoDBStreamEvent,
    C extends Context = Context
  >(
    handler: (event: E, context: C, ctx: Callback) => Promise<void>
  ) =>
  async (event: E, context: C, ctx: Callback) => {
    logger.info({ event }, "Started lambda execution");

    try {
      await handler(event, context, ctx);
    } catch (err) {
      logger.error({ err }, "Error while executing lambda");

      throw new Error((err as Error).message);
    }
  };
