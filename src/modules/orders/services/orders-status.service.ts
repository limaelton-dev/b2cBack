import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersAnymarketRepository } from '../repositories/orders-anymarket.repository';
import { OrdersRepository } from '../repositories/orders.repository';
import { OrderStatus } from '../entities/order.entity';

@Injectable()
export class OrdersStatusService {
  constructor(
    private readonly ordersAnymarketRepository: OrdersAnymarketRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async markAsPaid(orderId: number, payload: unknown): Promise<void> {
    const order = await this.ordersRepository.findOrderDetailById(orderId);

    if (!order.anymarketOrderId) {
      throw new NotFoundException(
        'ANYMARKET order identifier not found for this order',
      );
    }

    const updatedAnymarketOrder =
      await this.ordersAnymarketRepository.markAsPaid(
        order.anymarketOrderId,
        payload,
      );

    await this.ordersRepository.updateOrderStatus(
      order.id,
      updatedAnymarketOrder.status as OrderStatus,
      'ANYMARKET',
      'Status updated to PAID',
    );
  }

  // Você pode incluir aqui métodos específicos para faturar, enviar, cancelar, etc.
}
