import { Command } from "@castore/core";
import { Product } from "../../../domain/entities/Product";
import { Price } from "../../../domain/valueObjects/Price";
import { ProductId } from "../../../domain/valueObjects/ProductId";
import { ProductRepository } from "../../../ports/database/ProductRepository";

interface Input {
  name: string;
  priceAmount: number;
}

interface Context {
  productRepository: ProductRepository;
}

export const createProductCommand = new Command({
  commandId: "CREATE_PRODUCT",
  requiredEventStores: [],
  handler: async (
    { name, priceAmount }: Input,
    [],
    { productRepository }: Context
  ) => {
    const id = ProductId.generate();
    const product = new Product(id, name, Price.from(priceAmount, "PLN"));

    await productRepository.create(product);

    return { id };
  },
});
