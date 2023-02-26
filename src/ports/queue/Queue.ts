export interface Queue {
  pushMessages(payload: unknown): Promise<void>;
}
