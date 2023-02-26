import "reflect-metadata";
import { Exclude, Expose } from "class-transformer";
import { Price } from "../../domain/valueObjects/Price";
import { ProductId } from "../../domain/valueObjects/ProductId";

interface ProductProps {
  id: ProductId;
  name: string;
  price: Price;
}

@Exclude()
export class Product {
  public static create(data: ProductProps): Product {
    const object = new Product();
    Object.assign(object, data);

    return object;
  }

  @Expose()
  id: ProductId;

  @Expose()
  name: string;

  @Expose()
  price: Price;
}
