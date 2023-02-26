import { DynamoDBStreamHandler } from "aws-lambda";
import { AttributeMap, Converter } from "aws-sdk/clients/dynamodb";
import { Queue } from "../../../ports/queue/Queue";
import { asyncMiddleware } from "../../../shared/asyncMiddleware/asyncMiddleware";
import { notEmpty } from "../../../shared/utils/notEmpty";
import { SQSQueue } from "../../queue/SQSQueue/SQSQueue";

interface InsertedRecord {
  aggregateId: string;
  payload: Record<string, unknown>;
  isInitialEvent: number;
  type: string;
  version: number;
  timestamp: string;
}

export interface MessageBody {
  type: InsertedRecord["type"];
  payload: InsertedRecord["payload"];
  version: InsertedRecord["version"];
  aggregateId: InsertedRecord["aggregateId"];
}

const queue: Queue = new SQSQueue();

export const handler: DynamoDBStreamHandler = asyncMiddleware(async (event) => {
  const events: MessageBody[] = event.Records.map((event) => {
    if (event.eventName !== "INSERT") {
      return null;
    }

    const record = Converter.unmarshall(
      event.dynamodb?.NewImage as AttributeMap
    ) as InsertedRecord;

    return {
      type: record.type,
      payload: record.payload,
      version: record.version,
      aggregateId: record.aggregateId,
    };
  }).filter(notEmpty);

  await queue.pushMessages(events);
});
