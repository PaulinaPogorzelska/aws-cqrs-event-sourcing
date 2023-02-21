import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Price } from "../../../domain/valueObjects/Price";
import { Product } from "../../../domain/entities/Product";
import { ProductId } from "../../../domain/valueObjects/ProductId";
import {
  CreateProductProperties,
  ProductRepository,
} from "../../../ports/database/ProductRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { checkForEnv } from "../../../shared/utils/checkForEnv";

export class DynamoProductRepository implements ProductRepository {
  private readonly documentClient = new DocumentClient();
  private readonly tableName: string;

  constructor() {
    this.tableName = checkForEnv(process.env.PRODUCT_TABLE);
  }

  async create(productToCreate: Product): Promise<void> {
    await this.documentClient
      .put({
        TableName: this.tableName,
        Item: productToCreate,
      })
      .promise();
  }

  async findById(id: ProductId): Promise<Product> {
    const { Item } = await this.documentClient
      .get({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
      .promise();

    if (!Item) {
      throw new IllegalArgumentException(`Product with ${id} not found`);
    }

    return new Product(
      Item.id,
      Item.name,
      Price.from(Item.price.amount, Item.price.currency)
    );
  }
}
