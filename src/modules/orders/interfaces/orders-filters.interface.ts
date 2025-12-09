import { OrderStatus } from '../entities/order.entity';

export interface OrdersFilters {
  status?: OrderStatus;
  marketplace?: string;
  createdFrom?: Date;
  createdTo?: Date;
}
