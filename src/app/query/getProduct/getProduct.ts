import { OrderRepository } from "../../../ports/database/OrderRepository";

interface Input {
  id: string;
}

interface Context {
  orderRepository: OrderRepository;
}

export const getProductQueryHandler = async (
  { id }: Input,
  { orderRepository }: Context
) => {
  return orderRepository.findById(id);
};
