import { EventType } from "@castore/core";
import { EmailAddress } from "../domain/valueObjects/EmailAddress";
import { Price } from "../domain/valueObjects/Price";
import { ProductId } from "../domain/valueObjects/ProductId";

export const orderCreatedEventType = new EventType<
  "ORDER_CREATED",
  {
    customerEmail: ReturnType<EmailAddress["valueOf"]>;
    price: ReturnType<Price["valueOf"]>;
    comment: string;
    isDiscountApplied: boolean;
  }
>({ type: "ORDER_CREATED" });

export const productAddedToOrderType = new EventType<
  "PRODUCT_ADDED_TO_ORDER",
  {
    productId: ProductId;
    isDiscountApplied: boolean;
    price: ReturnType<Price["valueOf"]>;
  }
>({ type: "PRODUCT_ADDED_TO_ORDER" });

export const productRemovedFromOrderType = new EventType<
  "PRODUCT_REMOVED_FROM_ORDER",
  {
    productId: ProductId;
    isDiscountRevoked: boolean;
    price: ReturnType<Price["valueOf"]>;
  }
>({ type: "PRODUCT_REMOVED_FROM_ORDER" });
