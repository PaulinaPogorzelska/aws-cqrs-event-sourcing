import "reflect-metadata";
import { Exclude, Expose } from "class-transformer";
import { Product } from "./Product";

interface OrderProps {
  id: string;
  customerEmail: string;
  price: string;
  comment: string;
  isDiscountApplied: boolean;
  products: Product[];
  version: number;
}

@Exclude()
export class Order {
  public static create(data: OrderProps): Order {
    const object = new Order();
    Object.assign(object, data);

    return object;
  }

  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  customerEmail: string;

  @Expose()
  price: string;

  @Expose()
  comment: string;

  @Expose()
  isDiscountApplied: boolean;

  @Expose()
  products: Product[];

  version: number;
}
