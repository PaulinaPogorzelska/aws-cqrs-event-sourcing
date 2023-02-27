import { EventStore } from "@castore/core";
import { OrderAggregate } from "../../../app/aggregate";
import {
  orderCreatedEventType,
  productAddedToOrderType,
  productRemovedFromOrderType,
} from "../../../app/events";
import { EmailAddress } from "../../../domain/valueObjects/EmailAddress";
import { Price } from "../../../domain/valueObjects/Price";
import { ordersEventsStorageAdapter } from "./orderEventStorageAdapter";

export const orderEventStore = new EventStore({
  eventStoreId: "ORDER",
  eventStoreEvents: [
    orderCreatedEventType,
    productAddedToOrderType,
    productRemovedFromOrderType,
  ],
  storageAdapter: ordersEventsStorageAdapter,
  reduce: (orderAggregate: OrderAggregate, event): OrderAggregate => {
    const { version, aggregateId } = event;

    switch (event.type) {
      case "ORDER_CREATED": {
        return {
          aggregateId,
          version,
          comment: event.payload.comment,
          customerEmail: EmailAddress.from(event.payload.customerEmail),
          isDiscountApplied: event.payload.isDiscountApplied,
          price: Price.from(
            event.payload.price.amount,
            event.payload.price.currency
          ),
          products: [],
        };
      }

      case "PRODUCT_ADDED_TO_ORDER": {
        return {
          ...orderAggregate,
          version,
          products: [...orderAggregate.products, event.payload.productId],
          price: Price.from(
            orderAggregate.price.valueOf().amount +
              event.payload.productPrice.amount,
            orderAggregate.price.valueOf().currency
          ),
        };
      }

      case "PRODUCT_REMOVED_FROM_ORDER": {
        return {
          ...orderAggregate,
          version,
          products: orderAggregate.products.filter(
            (product) => product !== event.payload.productId
          ),
          price: Price.from(
            orderAggregate.price.valueOf().amount -
              event.payload.productPrice.amount,
            orderAggregate.price.valueOf().currency
          ),
        };
      }

      default:
        return orderAggregate;
    }
  },
});
