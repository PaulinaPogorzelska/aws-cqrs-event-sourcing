import { Price } from "../../../domain/valueObjects/Price";
import { Product } from "../../entities/Product";
import { ProductId } from "../../../domain/valueObjects/ProductId";
import { ProductRepository } from "../../../ports/database/ProductRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoProductRepository
  extends DynamoRepository
  implements ProductRepository
{
  constructor() {
    super("PRODUCT_TABLE");
  }

  async create(productToCreate: Product): Promise<void> {
    await this.documentClient
      .put({
        TableName: this.tableName,
        Item: productToCreate,
        ConditionExpression: "attribute_not_exists(id)",
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
