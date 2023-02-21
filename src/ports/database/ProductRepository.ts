import { Price } from "../../domain/valueObjects/Price";
import { Product } from "../../domain/entities/Product";
import { ProductId } from "../../domain/valueObjects/ProductId";

export interface CreateProductProperties {
  name: string;
  price: Price;
}

export interface ProductRepository {
  create(productToCreate: Product): Promise<void>;
  findById(id: ProductId): Promise<Product>;
}
