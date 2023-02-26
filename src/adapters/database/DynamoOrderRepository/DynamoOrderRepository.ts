import { OrderId } from "../../../domain/valueObjects/OrderId";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { Order } from "../../entities/Order";
import { Product } from "../../entities/Product";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoOrderRepository
  extends DynamoRepository
  implements OrderRepository
{
  constructor() {
    super("ORDER_TABLE");
  }

  async create(order: Order) {
    await this.documentClient
      .put({
        TableName: this.tableName,
        Item: order,
        ConditionExpression: "attribute_not_exists(id)",
      })
      .promise();
  }

  async addProduct(
    id: OrderId,
    product: Product,
    isDiscountApplied: boolean,
    price: string,
    version: number
  ) {
    await this.documentClient
      .update({
        TableName: this.tableName,
        Key: {
          id,
        },
        UpdateExpression:
          "SET products = list_append(products, :product), isDiscountApplied = :isDiscountApplied, price = :price, version = :version",
        ExpressionAttributeValues: {
          ":product": [product],
          ":isDiscountApplied": isDiscountApplied,
          ":price": price,
          ":version": version,
        },
      })
      .promise();
  }

  async removeProduct(product: Product) {}

  async findById(id: OrderId): Promise<Order> {
    const { Item } = await this.documentClient
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    if (!Item) {
      throw new IllegalArgumentException(`Order not found`);
    }

    return Order.create(<Order>Item);
  }

  async find(): Promise<Order[]> {
    const { Items } = await this.documentClient
      .scan({ TableName: this.tableName })
      .promise();

    return Items ? Items.map((item) => Order.create(<Order>item)) : [];
  }
}
