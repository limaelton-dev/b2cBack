import { OrderStatus } from '../entities/order.entity';

export class OrderSummaryItemDto {
  id: number;
  productId: number;
  skuId: number;
  title: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export class OrderSummaryDto {
  id: number;
  status: OrderStatus;
  marketplace: string;
  grandTotal: string;
  itemsTotal: string;
  shippingTotal: string;
  discountTotal: string;
  createdAt: Date;
  updatedAt: Date;

  items: OrderSummaryItemDto[];
}
