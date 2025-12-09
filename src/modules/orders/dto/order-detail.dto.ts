import { OrderStatus } from '../entities/order.entity';
import { OrderSummaryItemDto } from './order-summary.dto';

export class OrderDetailShippingDto {
  shippingCarrier: string | null;
  shippingService: string | null;
  shippingEstimatedDeliveryDate: Date | null;
  shippingTrackingCode: string | null;
}

export class OrderDetailPaymentDto {
  paymentMethod: string;
  installments: number | null;
}

export class OrderDetailDto {
  id: number;
  profileId: number;
  anymarketOrderId: number | null;
  partnerOrderId: string | null;
  marketplace: string;
  marketplaceOrderId: string | null;
  status: OrderStatus;

  itemsTotal: string;
  shippingTotal: string;
  discountTotal: string;
  grandTotal: string;

  shipping: OrderDetailShippingDto;
  payment: OrderDetailPaymentDto;

  items: OrderSummaryItemDto[];

  createdAt: Date;
  updatedAt: Date;
}
