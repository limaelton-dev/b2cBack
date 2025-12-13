import { Injectable, Logger } from '@nestjs/common';
import { OrdersAnymarketRepository } from '../repositories/orders-anymarket.repository';
import { OrdersRepository } from '../repositories/orders.repository';
import { AnymarketOrderFeed } from '../interfaces/anymarket-order.interface';

@Injectable()
export class OrdersSyncService {
  private readonly logger = new Logger(OrdersSyncService.name);

  constructor(
    private readonly ordersAnymarketRepository: OrdersAnymarketRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async synchronizeOrdersFromAnymarketFeeds(): Promise<void> {
    const feeds = await this.ordersAnymarketRepository.findFeeds();

    if (!feeds || feeds.length === 0) {
      return;
    }

    const processedFeedIds: number[] = [];

    for (const feed of feeds) {
      try {
        await this.processSingleFeed(feed);
        processedFeedIds.push(feed.id);
      } catch (error) {
        this.logger.error(
          `Failed to process ANYMARKET order feed ${feed.id}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    await this.ordersAnymarketRepository.markFeedsAsProcessedBatch(
      processedFeedIds,
    );
  }

  private async resolveProfileIdFromOrder(anymarketOrder: any): Promise<number | null> {
    if (!anymarketOrder.customer?.email) {
      return null;
    }

    const existingOrder = await this.ordersRepository.findByAnymarketOrderId(
      anymarketOrder.id,
    );
    if (existingOrder?.profileId) {
      return existingOrder.profileId;
    }

    return null;
  }

  private async processSingleFeed(feed: AnymarketOrderFeed): Promise<void> {
    const anymarketOrder =
      await this.ordersAnymarketRepository.findById(feed.orderId);

    const profileId = await this.resolveProfileIdFromOrder(anymarketOrder);

    const orderData = {
      profileId,
      anymarketOrderId: anymarketOrder.id,
      partnerOrderId: anymarketOrder.partnerId,
      marketplace: anymarketOrder.marketplace ?? 'ECOMMERCE',
      marketplaceOrderId: anymarketOrder.marketplaceOrderId ?? null,
      status: anymarketOrder.status as any,
      itemsTotal: anymarketOrder.itemsTotal.toString(),
      shippingTotal: anymarketOrder.shipping.freightPrice.toString(),
      discountTotal: (anymarketOrder.discountTotal ?? 0).toString(),
      grandTotal: anymarketOrder.grandTotal.toString(),
      paymentMethod: anymarketOrder.payment.paymentMethod,
      installments: anymarketOrder.payment.installments ?? null,
      shippingCarrier: anymarketOrder.shipping.carrierName ?? null,
      shippingService: anymarketOrder.shipping.serviceName ?? null,
      shippingEstimatedDeliveryDate:
        anymarketOrder.shipping.estimatedDeliveryDate
          ? new Date(anymarketOrder.shipping.estimatedDeliveryDate)
          : null,
      shippingTrackingCode: null,
      anymarketRawPayload: anymarketOrder,
      anymarketCreatedAt: anymarketOrder.createdAt
        ? new Date(anymarketOrder.createdAt)
        : null,
      anymarketUpdatedAt: anymarketOrder.updatedAt
        ? new Date(anymarketOrder.updatedAt)
        : null,
    };

    const itemsData = anymarketOrder.items.map((orderItem) => {
      const lineTotal =
        (orderItem.price - (orderItem.discount ?? 0)) * orderItem.quantity;

      return {
        productId: 0, // TODO: mapear para id interno de produto se necessário
        skuId: Number(orderItem.sku),
        title: orderItem.title ?? '',
        quantity: orderItem.quantity,
        unitPrice: orderItem.price.toFixed(2),
        discount: (orderItem.discount ?? 0).toFixed(2),
        total: lineTotal.toFixed(2),
      };
    });

    await this.ordersRepository.upsertOrderFromAnymarket(
      orderData,
      itemsData,
      'ANYMARKET',
    );
  }
}
