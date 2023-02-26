import { OrderRepository } from "../../../ports/database/OrderRepository";

interface Context {
  orderRepository: OrderRepository;
}

export const getProductsQueryHandler = ({ orderRepository }: Context) => {
  return orderRepository.find();
};
