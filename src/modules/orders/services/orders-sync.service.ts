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
    if (!anymarketOrder.buyer?.email) {
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

    const firstPayment = anymarketOrder.payments?.[0];

    const orderData = {
      profileId,
      anymarketOrderId: anymarketOrder.id,
      partnerOrderId: anymarketOrder.partnerId,
      marketplace: anymarketOrder.marketPlace ?? 'ECOMMERCE',
      marketplaceOrderId: anymarketOrder.marketPlaceId ?? null,
      status: anymarketOrder.status as any,
      itemsTotal: (anymarketOrder.gross ?? 0).toString(),
      shippingTotal: (anymarketOrder.freight ?? 0).toString(),
      discountTotal: (anymarketOrder.discount ?? 0).toString(),
      grandTotal: (anymarketOrder.total ?? 0).toString(),
      paymentMethod: firstPayment?.method ?? 'PENDING',
      installments: firstPayment?.installments ?? null,
      shippingCarrier: null,
      shippingService: null,
      shippingEstimatedDeliveryDate: null,
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
      const lineTotal = orderItem.total ?? (orderItem.unit * orderItem.amount);

      return {
        productId: orderItem.product?.id ?? 0,
        skuId: orderItem.sku?.id ?? Number(orderItem.sku?.partnerId) ?? 0,
        title: orderItem.sku?.title ?? orderItem.product?.title ?? '',
        quantity: orderItem.amount,
        unitPrice: (orderItem.unit ?? 0).toFixed(2),
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
