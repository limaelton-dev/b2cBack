import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../../../common/enums/order-status.enum';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async createOrderItem(orderItemData: Partial<OrderItem>): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create(orderItemData);
    return this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['profile', 'orderItems', 'orderItems.product', 'discount', 'payments'],
    });
  }

  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['profile', 'orderItems', 'orderItems.product', 'discount', 'payments'],
    });
  }

  async findByProfileId(profileId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { profileId },
      relations: ['profile', 'orderItems', 'orderItems.product', 'discount', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      where: { orderId },
      relations: ['product', 'coupon', 'order'],
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, orderData);
    return this.findOne(id);
  }

  async updateOrderItem(id: number, orderItemData: Partial<OrderItem>): Promise<OrderItem> {
    await this.orderItemRepository.update(id, orderItemData);
    return this.orderItemRepository.findOne({
      where: { id },
      relations: ['product', 'coupon', 'order'],
    });
  }

  async removeOrderItem(id: number): Promise<void> {
    await this.orderItemRepository.delete(id);
  }

  async removeOrderItemsByOrderId(orderId: number): Promise<void> {
    await this.orderItemRepository.delete({ orderId });
  }

  async remove(id: number): Promise<void> {
    // Primeiro remover os itens do pedido
    await this.removeOrderItemsByOrderId(id);
    // Depois remover o pedido
    await this.orderRepository.delete(id);
  }
} 