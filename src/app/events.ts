import { EventType } from "@castore/core";
import { SupportedCurrencies } from "../domain/valueObjects/Price";

export const orderCreatedEventType = new EventType<
  "ORDER_CREATED",
  {
    id: string;
    customerEmail: string;
    price: { amount: number; currency: SupportedCurrencies };
    comment: string;
    isDiscountApplied: boolean;
  }
>({ type: "ORDER_CREATED" });

export const productAddedToOrderType = new EventType<
  "PRODUCT_ADDED_TO_ORDER",
  { orderId: string; productId: string }
>({ type: "PRODUCT_ADDED_TO_ORDER" });

export const productRemovedFromOrderType = new EventType<
  "PRODUCT_REMOVED_FROM_ORDER",
  { orderId: string; productId: string }
>({ type: "PRODUCT_REMOVED_FROM_ORDER" });
