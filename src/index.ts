import { Uuid } from "./shared/utils/Uuid";
import { Balance } from "./domain/Customer/valueObjects/Balance";
import { Money } from "./shared/domain/Money";
import { EventDetail } from "@castore/core";

// const balance = Balance.from(Money.from(10, "EUR"));
// balance.increase(10);
// balance.increase(10);
// console.log(balance.valueOf());
// balance.changeCurrency("PLN");
// console.log(balance.valueOf());

import { Aggregate, EventStore, EventType } from "@castore/core";

const userCreatedEventType = new EventType<
  "USER_CREATED",
  { name: string; age: number }
>({ type: "USER_CREATED" });

enum UserStatus {
  ACTIVE = "ACTIVE",
  REMOVED = "REMOVED",
}

interface UserAggregate extends Aggregate {
  firstName: string;
  lastName: string;
  status: UserStatus;
}

// const userEventStore = new EventStore({
//   eventStoreId: "USER",
//   eventStoreEvents: [userCreatedEventType],
//   reduce: (userAggregate: UserAggregate, event): UserAggregate => {
//     const { version, aggregateId } = event;

//     switch (event.type) {
//       case "USER_CREATED": {
//         const { firstName, lastName } = event.payload;

//         return {
//           aggregateId,
//           version: event.version,
//           firstName,
//           lastName,
//           status: UserStatus.ACTIVE,
//         };
//       }
//       case "USER_REMOVED":
//         return {
//           ...userAggregate,
//           version,
//           status: UserStatus.REMOVED,
//         };
//       default:
//         return userAggregate;
//     }
//   },
// });

userEventStore.getEvents("").then((e) => {});
