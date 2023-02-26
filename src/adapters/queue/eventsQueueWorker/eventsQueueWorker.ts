import { SQSHandler } from "aws-lambda";
import { EventBroker } from "../../../ports/event/EventBroker";
import { asyncMiddleware } from "../../../shared/asyncMiddleware/asyncMiddleware";
import { orderEventStore } from "../../database/OrderEventStore/orderEventStore";
import { EventBridgeEventBroker } from "../../event/EventBridgeEventBroker/EventBridgeEventBroker";
import { MessageBody } from "../../event/onOrderEventStoreStream/onOrderEventStoreStream";

const eventBroker: EventBroker = new EventBridgeEventBroker();

export const handler: SQSHandler = asyncMiddleware(async (event) => {
  const parsedMessages: MessageBody[] = event.Records.map((event) =>
    JSON.parse(event.body)
  );

  const eventsPromises = parsedMessages.map(
    async ({ type, version, aggregateId, payload }) => {
      const { aggregate } = await orderEventStore.getAggregate(aggregateId, {
        maxVersion: version,
      });

      return {
        type,
        payload: {
          aggregate: aggregate!,
          version,
          orderId: aggregateId,
          data: payload,
        },
        source: "eventsQueueWorker",
      };
    }
  );

  const events = await Promise.all(eventsPromises);

  await eventBroker.publishEvents(events);
});
