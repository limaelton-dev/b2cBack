import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders.repository';
import { OrderSummaryDto, OrderSummaryItemDto } from '../dto/order-summary.dto';
import {
  OrderDetailDto,
  OrderDetailPaymentDto,
  OrderDetailShippingDto,
} from '../dto/order-detail.dto';
import { OrdersFilters } from '../interfaces/orders-filters.interface';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async findOrdersForProfile(
    profileId: number,
    filters: OrdersFilters,
  ): Promise<OrderSummaryDto[]> {
    const orders = await this.ordersRepository.findOrdersByProfileIdWithFilters(
      profileId,
      filters,
    );
    return orders.map((order) => this.convertOrderToSummaryDto(order));
  }

  async findOrderDetailForProfile(
    profileId: number,
    orderId: number,
  ): Promise<OrderDetailDto> {
    const order =
      await this.ordersRepository.findOrderDetailByIdAndProfileId(
        orderId,
        profileId,
      );
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.convertOrderToDetailDto(order);
  }

  private convertOrderToSummaryDto(order: Order): OrderSummaryDto {
    const items: OrderSummaryItemDto[] = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      skuId: item.skuId,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    }));
    return {
      id: order.id,
      status: order.status,
      marketplace: order.marketplace,
      grandTotal: order.grandTotal,
      itemsTotal: order.itemsTotal,
      shippingTotal: order.shippingTotal,
      discountTotal: order.discountTotal,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items,
    };
  }

  private convertOrderToDetailDto(order: Order): OrderDetailDto {
    const shipping: OrderDetailShippingDto = {
      shippingCarrier: order.shippingCarrier,
      shippingService: order.shippingService,
      shippingEstimatedDeliveryDate: order.shippingEstimatedDeliveryDate,
      shippingTrackingCode: order.shippingTrackingCode,
    };
    const payment: OrderDetailPaymentDto = {
      paymentMethod: order.paymentMethod,
      installments: order.installments,
    };
    const items: OrderSummaryItemDto[] = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      skuId: item.skuId,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    }));
    return {
      id: order.id,
      profileId: order.profileId,
      anymarketOrderId: order.anymarketOrderId,
      partnerOrderId: order.partnerOrderId,
      marketplace: order.marketplace,
      marketplaceOrderId: order.marketplaceOrderId,
      status: order.status,
      itemsTotal: order.itemsTotal,
      shippingTotal: order.shippingTotal,
      discountTotal: order.discountTotal,
      grandTotal: order.grandTotal,
      shipping,
      payment,
      items,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
