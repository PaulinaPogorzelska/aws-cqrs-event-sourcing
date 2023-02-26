import SQS from "aws-sdk/clients/sqs";
import { v4 } from "uuid";
import { Queue } from "../../../ports/queue/Queue";
import { checkForEnv } from "../../../shared/utils/checkForEnv";
import { sliceIntoChunks } from "../../../shared/utils/sliceIntoChunks";

export class SQSQueue implements Queue {
  private readonly client = new SQS();
  private readonly queueUrl = checkForEnv(process.env.QUEUE_URL);
  private readonly MAX_BATCH_SIZE = 10;

  async pushMessages(payload: unknown[]): Promise<void> {
    const chunked = sliceIntoChunks(payload, this.MAX_BATCH_SIZE);

    const promises = chunked.map((chunks) =>
      this.client
        .sendMessageBatch({
          Entries: chunks.map((chunk) => ({
            Id: v4(),
            MessageBody: JSON.stringify(chunk),
          })),
          QueueUrl: this.queueUrl,
        })
        .promise()
    );

    await Promise.all(promises);
  }
}
