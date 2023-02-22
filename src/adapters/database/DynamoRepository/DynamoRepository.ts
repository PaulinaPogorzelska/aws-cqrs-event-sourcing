import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { checkForEnv } from "../../../shared/utils/checkForEnv";

export class DynamoRepository {
  protected readonly documentClient = new DocumentClient();
  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = checkForEnv(process.env[tableName]);
  }
}
