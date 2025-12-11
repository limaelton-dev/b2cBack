import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { roundPrice } from '../../../common/helpers/products.util';

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
import { ProductsService } from '../../products/services/products.service';
import { ShippingService } from '../../shipping/services/shipping.service';
import { ShippingItemDto } from '../../shipping/dtos/shipping-item.dto';


@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly ordersAnymarketRepository: OrdersAnymarketRepository,
    private readonly productsService: ProductsService,
    private readonly shippingService: ShippingService,
  ) {}


  async checkout(
    profileId: number,
    checkoutDto: CheckoutDto,
  ): Promise<OrderDetailDto> {
    if (!checkoutDto.items || checkoutDto.items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    // Validate SKU availability and quantities
    const availabilityResult = await this.productsService.validateSkuAvailability(
      checkoutDto.items.map((item) => ({
        skuId: item.skuId,
        quantity: item.quantity,
      })),
    );
    if (!availabilityResult.isValid) {
      throw new BadRequestException(
        availabilityResult.invalid.map((i) => i.message).join('; '),
      );
    }

    // Calculate monetary totals
    const itemsTotal = await this.calculateItemsTotal(checkoutDto);
    const shippingTotal = await this.calculateShippingTotal(
      checkoutDto,
      profileId,
    );
    const discountTotal = await this.calculateDiscountTotal(checkoutDto);
    const grandTotal = itemsTotal + shippingTotal - discountTotal;

    // Simulate payment
    const paymentStatus = await this.simulatePayment(grandTotal);
    if (paymentStatus !== 'APPROVED') {
      throw new BadRequestException('Payment was not approved');
    }

    // Generate a partner order ID for idempotency on AnyMarket
    const partnerOrderId = this.generatePartnerOrderId(profileId);

    // Build the request payload for AnyMarket
    const anymarketPayload = await this.buildAnymarketOrderCreatePayload(
      partnerOrderId,
      checkoutDto,
      itemsTotal,
      shippingTotal,
      discountTotal,
      grandTotal,
    );

    // Create the order in AnyMarket
    const anymarketOrder = await this.ordersAnymarketRepository.create(
      anymarketPayload,
    );

    // Persist the order locally
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


  private async calculateItemsTotal(checkoutDto: CheckoutDto): Promise<number> {
    const skuIds = checkoutDto.items.map((item) => item.skuId);
    const skuDetailsMap = await this.productsService.findSkusForCart(skuIds);
    let total = 0;
    for (const item of checkoutDto.items) {
      const sku = skuDetailsMap.get(item.skuId);
      if (!sku) {
        throw new BadRequestException(
          `SKU ${item.skuId} not found or unavailable`,
        );
      }
      const price = sku._rawPrice ?? 0;
      total += price * item.quantity;
    }
    // Use the same rounding helper used elsewhere in the codebase to avoid drift
    return roundPrice(total);
  }


  private async calculateShippingTotal(
    checkoutDto: CheckoutDto,
    profileId: number,
  ): Promise<number> {
    try {
      // Convert checkout items to shipping items.  Weight and
      // dimensions could be sourced from a product details service.
      const shippingItems: ShippingItemDto[] = checkoutDto.items.map(
        (item) => ({
          productId: item.productId,
          serviceCode: '',
          quantity: item.quantity,
          weight: 0,
          dimensions: undefined,
        }),
      );
      // Use the customer's shipping zip code; assume 8 digits with no
      // punctuation.  If not provided return zero.
      const destZip = checkoutDto.customer?.shippingAddress?.zipCode?.replace(
        /\D/g,
        '',
      );
      if (!destZip) {
        return 0;
      }
      // Use a fixed origin ZIP code for now. In a production scenario this
      // could come from a configuration file or warehouse address.
      const originZip = '01001000';
      const response = await this.shippingService.calculateShipping(
        'simulation',
        originZip,
        destZip,
        shippingItems,
      );
      if (response.success && response.data) {
        return Number(response.data.totalPrice);
      }
    } catch (error) {
      // Ignore errors and fall back to zero shipping
    }
    return 0;
  }


  private async calculateDiscountTotal(
    checkoutDto: CheckoutDto,
  ): Promise<number> {
    // For now no coupons or promotions are applied. Implement your own
    // discount logic here, such as reading a coupon code from checkoutDto
    // and applying it to the total.
    return 0;
  }


  private async simulatePayment(totalAmount: number): Promise<'APPROVED'> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'APPROVED';
  }


  private generatePartnerOrderId(profileId: number): string {
    return `ECOM-${profileId}-${Date.now()}`;
  }

  private async buildAnymarketOrderCreatePayload(
    partnerOrderId: string,
    checkoutDto: CheckoutDto,
    itemsTotal: number,
    shippingTotal: number,
    discountTotal: number,
    grandTotal: number,
  ): Promise<AnymarketOrderCreate> {
    const skuIds = checkoutDto.items.map((item) => item.skuId);
    const skuDetailsMap = await this.productsService.findSkusForCart(skuIds);
    const items = checkoutDto.items.map((item) => {
      const sku = skuDetailsMap.get(item.skuId);
      if (!sku) {
        throw new BadRequestException(
          `SKU ${item.skuId} not found or unavailable`,
        );
      }
      const unitPrice = sku._rawPrice ?? 0;
      return {
        sku: sku.partnerId ? String(sku.partnerId) : String(item.skuId),
        title: sku.title,
        quantity: item.quantity,
        price: unitPrice,
        originalPrice: unitPrice,
        discount: 0,
      };
    });
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
          neighborhood:
            checkoutDto.customer.shippingAddress.neighborhood,
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
              neighborhood:
                checkoutDto.customer.billingAddress.neighborhood,
              address: checkoutDto.customer.billingAddress.address,
              number: checkoutDto.customer.billingAddress.number,
              complement:
                checkoutDto.customer.billingAddress.complement,
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
        carrierName: undefined,
        serviceName: undefined,
        estimatedDeliveryDate: undefined,
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
      shippingEstimatedDeliveryDate: anymarketOrder.shipping
        .estimatedDeliveryDate
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
        productId: 0, // Unknown at this stage; map via SKU service if needed
        skuId: Number(orderItem.sku),
        title: orderItem.title ?? '',
        quantity: orderItem.quantity,
        unitPrice: orderItem.price.toFixed(2),
        discount: (orderItem.discount ?? 0).toFixed(2),
        total: lineTotal.toFixed(2),
        marketplaceOrderItemId: undefined,
        listingType: undefined,
        officialStoreId: undefined,
      };
    });
    return this.ordersRepository.createOrderWithItemsAndStatusHistory(
      orderData,
      itemsData,
      'ANYMARKET',
    );
  }

  /**
   * Converts a persisted Order entity into a summary DTO for listing.
   */
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

  /**
   * Converts a persisted Order entity into a detailed DTO.  This
   * includes nested objects for payment and shipping.
   */
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