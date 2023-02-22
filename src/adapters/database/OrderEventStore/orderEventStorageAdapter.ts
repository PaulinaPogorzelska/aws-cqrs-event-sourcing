import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDbEventStorageAdapter } from "@castore/dynamodb-event-storage-adapter";
import { checkForEnv } from "../../../shared/utils/checkForEnv";

const dynamoDbClient = new DynamoDBClient({});

export const ordersEventsStorageAdapter = new DynamoDbEventStorageAdapter({
  tableName: checkForEnv(process.env.ORDER_EVENT_STORE_TABLE),
  dynamoDbClient,
});
