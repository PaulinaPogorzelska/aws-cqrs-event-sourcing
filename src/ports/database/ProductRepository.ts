import { Product } from "../../adapters/entities/Product";
import { ProductId } from "../../domain/valueObjects/ProductId";

export interface ProductRepository {
  create(productToCreate: Product): Promise<void>;
  findById(id: ProductId): Promise<Product>;
}
