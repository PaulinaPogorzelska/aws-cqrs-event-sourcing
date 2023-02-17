import type { Aggregate } from "@castore/core";
import { Price } from "../domain/valueObjects/Price";

export interface OrderAggregate extends Aggregate {
  id: string;
  customerEmail: string;
  price: Price;
  comment: string;
  isDiscountApplied: boolean;
}
