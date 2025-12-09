import { Injectable } from '@nestjs/common';
import { AnyMarketApiProvider } from 'src/shared/anymarket/any-market-api.provider';
import {
  AnymarketOrder,
  AnymarketOrderCreate,
  AnymarketOrderFeed,
} from '../interfaces/anymarket-order.interface';

@Injectable()
export class OrdersAnymarketRepository {
  constructor(
    private readonly anymarketProvider: AnyMarketApiProvider,
  ) {}

  async create(
    payload: AnymarketOrderCreate,
  ): Promise<AnymarketOrder> {
    return this.anymarketProvider.post<AnymarketOrder>('/orders', payload);
  }

  async findById(anymarketOrderId: number): Promise<AnymarketOrder> {
    return this.anymarketProvider.get<AnymarketOrder>(
      `/orders/${anymarketOrderId}`,
    );
  }

  async findFeeds(): Promise<AnymarketOrderFeed[]> {
    return this.anymarketProvider.get<AnymarketOrderFeed[]>('/orders/feeds');
  }

  async markFeedAsProcessed(feedId: number): Promise<void> {
    await this.anymarketProvider.put(`/orders/feeds/${feedId}`, {
      status: 'PROCESSED',
    });
  }

  async markFeedsAsProcessedBatch(feedIds: number[]): Promise<void> {
    if (feedIds.length === 0) {
      return;
    }

    await this.anymarketProvider.put('/orders/feeds/batch', {
      ids: feedIds,
      status: 'PROCESSED',
    });
  }

  async markAsPaid(
    anymarketOrderId: number,
    payload: unknown,
  ): Promise<AnymarketOrder> {
    // Ajuste o path conforme a rota específica de "pago" do ANYMARKET.
    return this.anymarketProvider.put<AnymarketOrder>(
      `/orders/${anymarketOrderId}`,
      payload,
    );
  }

  // Você pode adicionar outros métodos específicos de status (faturado, enviado, etc.)
}
