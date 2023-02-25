import { DynamoDBStreamHandler } from "aws-lambda";
import { AttributeMap, Converter } from "aws-sdk/clients/dynamodb";
import { EventBroker } from "../../../ports/event/EventBroker";
import { notEmpty } from "../../../shared/utils/notEmpty";
import { EventBridgeEventBroker } from "../EventBridgeEventBroker/EventBridgeEventBroker";
import { eventMiddleware } from "../eventMiddleware/eventMiddleware";

interface InsertedRecord {
  aggregateId: string;
  payload: Record<string, unknown>;
  isInitialEvent: number;
  type: string;
  version: number;
  timestamp: string;
}

const eventBroker: EventBroker = new EventBridgeEventBroker();

export const handler: DynamoDBStreamHandler = eventMiddleware(async (event) => {
  const events = event.Records.map((event) => {
    if (event.eventName !== "INSERT") {
      return null;
    }

    const record = Converter.unmarshall(
      event.dynamodb?.NewImage as AttributeMap
    ) as InsertedRecord;

    return {
      type: record.type,
      payload: {
        data: record.payload,
        version: record.version,
        orderId: record.aggregateId,
      },
      source: "onOrderEventStoreStream",
    };
  }).filter(notEmpty);

  await eventBroker.publishEvents(events);
});
