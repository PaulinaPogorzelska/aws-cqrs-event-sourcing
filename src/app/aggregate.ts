import type { Aggregate } from "@castore/core";
import { EmailAddress } from "../domain/valueObjects/EmailAddress";
import { Price } from "../domain/valueObjects/Price";
import { ProductId } from "../domain/valueObjects/ProductId";

export interface OrderAggregate extends Aggregate {
  customerEmail: EmailAddress;
  price: Price;
  comment: string;
  isDiscountApplied: boolean;
  products: ProductId[];
}
