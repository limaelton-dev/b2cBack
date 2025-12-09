import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { OrdersFilters } from '../interfaces/orders-filters.interface';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderEntityRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemEntityRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private readonly orderStatusHistoryEntityRepository: Repository<OrderStatusHistory>,
  ) {}

  async createOrderWithItemsAndStatusHistory(
    orderData: Partial<Order>,
    itemsData: Array<Partial<OrderItem>>,
    initialStatusSource: 'ANYMARKET' | 'SYSTEM',
  ): Promise<Order> {
    const createdOrder = this.orderEntityRepository.create(orderData);
    createdOrder.items = itemsData.map((itemData) =>
      this.orderItemEntityRepository.create(itemData),
    );

    const savedOrder = await this.orderEntityRepository.save(createdOrder);

    const statusHistoryEntry =
      this.orderStatusHistoryEntityRepository.create({
        orderId: savedOrder.id,
        status: savedOrder.status,
        source: initialStatusSource,
        description: 'Initial status',
      });

    await this.orderStatusHistoryEntityRepository.save(statusHistoryEntry);

    return this.findOrderDetailById(savedOrder.id);
  }

  async findOrdersByProfileIdWithFilters(
    profileId: number,
    filters: OrdersFilters,
  ): Promise<Order[]> {
    const queryBuilder = this.orderEntityRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'orderItem')
      .where('order.profileId = :profileId', { profileId });

    if (filters.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: filters.status,
      });
    }

    if (filters.marketplace) {
      queryBuilder.andWhere('order.marketplace = :marketplace', {
        marketplace: filters.marketplace,
      });
    }

    if (filters.createdFrom) {
      queryBuilder.andWhere('order.createdAt >= :createdFrom', {
        createdFrom: filters.createdFrom,
      });
    }

    if (filters.createdTo) {
      queryBuilder.andWhere('order.createdAt <= :createdTo', {
        createdTo: filters.createdTo,
      });
    }

    queryBuilder.orderBy('order.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOrderDetailByIdAndProfileId(
    orderId: number,
    profileId: number,
  ): Promise<Order | null> {
    return this.orderEntityRepository.findOne({
      where: {
        id: orderId,
        profileId,
      },
      relations: ['items'],
    });
  }

  async findOrderDetailById(orderId: number): Promise<Order> {
    return this.orderEntityRepository.findOneOrFail({
      where: { id: orderId },
      relations: ['items'],
    });
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    source: 'ANYMARKET' | 'SYSTEM' | 'MARKETPLACE' | 'USER',
    description?: string,
  ): Promise<void> {
    await this.orderEntityRepository.update(orderId, { status });

    const statusHistoryEntry =
      this.orderStatusHistoryEntityRepository.create({
        orderId,
        status,
        source,
        description: description ?? null,
      });

    await this.orderStatusHistoryEntityRepository.save(statusHistoryEntry);
  }

  async upsertOrderFromAnymarket(
    orderData: Partial<Order>,
    itemsData: Array<Partial<OrderItem>>,
    statusSource: 'ANYMARKET' | 'SYSTEM',
  ): Promise<Order> {
    const existingOrder = await this.orderEntityRepository.findOne({
      where: {
        anymarketOrderId: orderData.anymarketOrderId!,
      },
      relations: ['items'],
    });

    if (!existingOrder) {
      return this.createOrderWithItemsAndStatusHistory(
        orderData,
        itemsData,
        statusSource,
      );
    }

    // Atualização simples dos campos principais
    this.orderEntityRepository.merge(existingOrder, orderData);

    // Atualizar itens de forma simples: remover todos e recriar
    // (você pode melhorar depois se quiser um diff mais sofisticado)
    if (existingOrder.items && existingOrder.items.length > 0) {
      const existingItemIds = existingOrder.items.map((item) => item.id);
      if (existingItemIds.length > 0) {
        await this.orderItemEntityRepository.delete({
          id: In(existingItemIds),
        });
      }
    }

    existingOrder.items = itemsData.map((itemData) =>
      this.orderItemEntityRepository.create(itemData),
    );

    const savedOrder = await this.orderEntityRepository.save(existingOrder);

    await this.updateOrderStatus(
      savedOrder.id,
      savedOrder.status,
      statusSource,
      'Status updated from ANYMARKET',
    );

    return this.findOrderDetailById(savedOrder.id);
  }
}
