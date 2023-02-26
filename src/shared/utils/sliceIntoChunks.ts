import { notEmpty } from "./notEmpty";

export const sliceIntoChunks = <T>(messages: T[], chunksSize: number) => {
  return messages
    .map((_, i) =>
      i % chunksSize === 0 ? messages.slice(i, i + chunksSize) : null
    )
    .filter(notEmpty);
};
