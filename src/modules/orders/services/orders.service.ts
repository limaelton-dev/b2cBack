import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders.repository';
import { OrdersAnymarketRepository } from '../repositories/orders-anymarket.repository';

import { CheckoutDto } from '../dto/checkout.dto';
import { OrderSummaryDto, OrderSummaryItemDto } from '../dto/order-summary.dto';
import {
  OrderDetailDto,
  OrderDetailPaymentDto,
  OrderDetailShippingDto,
} from '../dto/order-detail.dto';
import { OrdersFilters } from '../interfaces/orders-filters.interface';
import { Order } from '../entities/order.entity';
import {
  AnymarketOrderCreate,
  AnymarketOrder,
} from '../interfaces/anymarket-order.interface';

// TODO: importar serviços reais de cart e profile
// import { CartsService } from '../../cart/services/cart.service';
// import { ProfilesService } from '../../profile/services/profile.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly ordersAnymarketRepository: OrdersAnymarketRepository,
    // private readonly cartsService: CartsService,
    // private readonly profilesService: ProfilesService,
  ) {}

  async checkout(
    profileId: number,
    checkoutDto: CheckoutDto,
  ): Promise<OrderDetailDto> {
    if (!checkoutDto.items || checkoutDto.items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    // TODO: valide os itens contra o seu catálogo, estoque, etc.

    const itemsTotal = this.calculateItemsTotal(checkoutDto);
    const shippingTotal = this.calculateShippingTotal(checkoutDto);
    const discountTotal = this.calculateDiscountTotal(checkoutDto);
    const grandTotal = itemsTotal + shippingTotal - discountTotal;

    const paymentResultStatus = await this.simulatePayment(grandTotal);

    if (paymentResultStatus !== 'APPROVED') {
      throw new BadRequestException('Payment was not approved');
    }

    const partnerOrderId = this.generatePartnerOrderId(profileId);

    const anymarketPayload =
      this.buildAnymarketOrderCreatePayload(
        partnerOrderId,
        checkoutDto,
        itemsTotal,
        shippingTotal,
        discountTotal,
        grandTotal,
      );

    const anymarketOrder = await this.ordersAnymarketRepository.create(
      anymarketPayload,
    );

    const createdOrder = await this.persistOrderFromAnymarket(
      profileId,
      anymarketOrder,
    );

    return this.convertOrderToDetailDto(createdOrder);
  }

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

  private calculateItemsTotal(checkoutDto: CheckoutDto): number {
    // TODO: buscar preços reais do produto (nunca confiar nos valores do cliente)
    // Por enquanto, apenas lança erro para evitar lógica enganosa.
    throw new Error(
      'calculateItemsTotal must be implemented with real product pricing',
    );
  }

  private calculateShippingTotal(checkoutDto: CheckoutDto): number {
    // TODO: chamar módulo de frete (AnyMarket Shipping) para obter valor real
    return 0;
  }

  private calculateDiscountTotal(checkoutDto: CheckoutDto): number {
    // TODO: aplicar regras de cupom, promoções, etc.
    return 0;
  }

  private async simulatePayment(totalAmount: number): Promise<'APPROVED'> {
    // Simulação simples de pagamento.
    // Substitua por integração real com seu gateway de pagamento.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'APPROVED';
  }

  private generatePartnerOrderId(profileId: number): string {
    // Estratégia simples: prefixo + timestamp + profileId.
    // Você pode trocar por algo mais alinhado ao seu negócio.
    return `ECOM-${profileId}-${Date.now()}`;
  }

  private buildAnymarketOrderCreatePayload(
    partnerOrderId: string,
    checkoutDto: CheckoutDto,
    itemsTotal: number,
    shippingTotal: number,
    discountTotal: number,
    grandTotal: number,
  ): AnymarketOrderCreate {
    const items = checkoutDto.items.map((item) => ({
      // TODO: usar o SKU real do AnyMarket mapeado ao seu skuId
      sku: String(item.skuId),
      quantity: item.quantity,
      price: 0, // TODO: substituir pelo preço real
    }));

    return {
      partnerId: partnerOrderId,
      marketplace: checkoutDto.marketplace ?? 'ECOMMERCE',
      customer: {
        name: checkoutDto.customer.name,
        email: checkoutDto.customer.email,
        phone: checkoutDto.customer.phone,
        cellPhone: checkoutDto.customer.cellPhone,
        document: checkoutDto.customer.document
          ? {
              documentType: checkoutDto.customer.document.documentType,
              documentNumber: checkoutDto.customer.document.documentNumber,
            }
          : undefined,
        shippingAddress: {
          state: checkoutDto.customer.shippingAddress.state,
          city: checkoutDto.customer.shippingAddress.city,
          zipCode: checkoutDto.customer.shippingAddress.zipCode,
          neighborhood: checkoutDto.customer.shippingAddress.neighborhood,
          address: checkoutDto.customer.shippingAddress.address,
          number: checkoutDto.customer.shippingAddress.number,
          complement: checkoutDto.customer.shippingAddress.complement,
          reference: checkoutDto.customer.shippingAddress.reference,
        },
        billingAddress: checkoutDto.customer.billingAddress
          ? {
              state: checkoutDto.customer.billingAddress.state,
              city: checkoutDto.customer.billingAddress.city,
              zipCode: checkoutDto.customer.billingAddress.zipCode,
              neighborhood: checkoutDto.customer.billingAddress.neighborhood,
              address: checkoutDto.customer.billingAddress.address,
              number: checkoutDto.customer.billingAddress.number,
              complement: checkoutDto.customer.billingAddress.complement,
              reference: checkoutDto.customer.billingAddress.reference,
            }
          : undefined,
      },
      items,
      payment: {
        paymentMethod: checkoutDto.payment.paymentMethod,
        installments: checkoutDto.payment.installments,
        totalPaid: grandTotal,
      },
      shipping: {
        freightPrice: shippingTotal,
      },
      discountTotal,
      itemsTotal,
      grandTotal,
    };
  }

  private async persistOrderFromAnymarket(
    profileId: number,
    anymarketOrder: AnymarketOrder,
  ): Promise<Order> {
    const orderData: Partial<Order> = {
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
        productId: 0, // TODO: mapeie para o id interno do produto se precisar
        skuId: Number(orderItem.sku),
        title: orderItem.title ?? '',
        quantity: orderItem.quantity,
        unitPrice: orderItem.price.toFixed(2),
        discount: (orderItem.discount ?? 0).toFixed(2),
        total: lineTotal.toFixed(2),
      };
    });

    return this.ordersRepository.createOrderWithItemsAndStatusHistory(
      orderData,
      itemsData,
      'ANYMARKET',
    );
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
