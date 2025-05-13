import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order/services/order.service';
import { CartValidation, CartItem } from '../interfaces/checkout.interface';
import { CheckoutException } from '../interfaces/checkout.interface';
import { OrderStatus } from '../../../common/enums/order-status.enum';

@Injectable()
export class OrderCreationService {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  async createOrder(
    cartValidation: CartValidation,
    profileId: number,
    paymentId: number,
    address: string,
  ) {
    try {
      const orderData = {
        profileId: profileId,
        totalPrice: cartValidation.total,
        status: OrderStatus.PENDING,
        fullAddress: address,
        items: cartValidation.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          sku: item.sku,
        })),
        paymentId,
        subtotal: cartValidation.subtotal,
        shipping: cartValidation.shipping,
        discounts: cartValidation.discounts,
      };

      const order = await this.orderService.create(profileId ,orderData);

      return {
        success: true,
        orderId: order.id,
        message: 'Pedido criado com sucesso',
      };
    } catch (error) {
      throw new CheckoutException(
        'ORDER_CREATION_ERROR',
        'Erro ao criar pedido',
        { originalError: error.message },
      );
    }
  }
} 