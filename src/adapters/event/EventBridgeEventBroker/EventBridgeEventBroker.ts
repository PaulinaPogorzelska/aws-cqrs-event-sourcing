import EventBridge from "aws-sdk/clients/eventbridge";
import { Event, EventBroker } from "../../../ports/event/EventBroker";
import { checkForEnv } from "../../../shared/utils/checkForEnv";
import { notEmpty } from "../../../shared/utils/notEmpty";

export class EventBridgeEventBroker implements EventBroker {
  private readonly client = new EventBridge();
  private readonly eventBusName = checkForEnv(process.env.EVENT_BUS);
  private readonly MAX_BATCH_SIZE = 10;

  private sliceIntoChunks<T>(messages: T[]) {
    return messages
      .map((_, i) =>
        i % this.MAX_BATCH_SIZE === 0
          ? messages.slice(i, i + this.MAX_BATCH_SIZE)
          : null
      )
      .filter(notEmpty);
  }

  async publishEvents(events: Event[]) {
    const chunked = this.sliceIntoChunks(events);

    const promises = chunked.map((chunks) =>
      this.client
        .putEvents({
          Entries: chunks.map(({ type, payload, source }) => ({
            DetailType: type,
            Detail: JSON.stringify(payload),
            EventBusName: this.eventBusName,
            Source: source,
          })),
        })
        .promise()
    );

    await Promise.all(promises);
  }
}
