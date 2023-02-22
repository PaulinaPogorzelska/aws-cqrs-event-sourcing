import { EmailAddress } from "../../../domain/valueObjects/EmailAddress";
import { OrderId } from "../../../domain/valueObjects/OrderId";
import { OrderRepository } from "../../../ports/database/OrderRepository";
import { IllegalArgumentException } from "../../../shared/errors/IllegalArgumentException";
import { Order } from "../../entities/Order";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoOrderRepository
  extends DynamoRepository
  implements OrderRepository
{
  constructor() {
    super("ORDER_TABLE");
  }

  async put(order: Order) {
    await this.documentClient
      .put({
        TableName: this.tableName,
        Item: order,
      })
      .promise();
  }

  async getById(id: OrderId): Promise<Order> {
    const { Item } = await this.documentClient
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    if (!Item) {
      throw new IllegalArgumentException(`Order with ${id} not found`);
    }

    return new Order(
      Item.id,
      Item.customerEmail,
      Item.price,
      Item.comment,
      Item.isDiscountApplied,
      Item.products
    );
  }
}
