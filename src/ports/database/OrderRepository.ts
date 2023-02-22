import { Order } from "../../adapters/entities/Order";
import { OrderId } from "../../domain/valueObjects/OrderId";

export interface OrderRepository {
  put(order: Order): Promise<void>;
  getById(id: OrderId): Promise<Order>;
}
