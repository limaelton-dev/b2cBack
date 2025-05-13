import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentGatewayStrategy } from '../strategies/payment-gateway.strategy';
import { PaymentGatewayFactory } from '../factories/payment-gateway.factory';
import { PaymentGatewayRequest, PaymentGatewayResponse } from '../interfaces/payment-gateway.interface';
import { CartValidationService } from './cart-validation.service';
import { OrderCreationService } from './order-creation.service';
import { StockManagementService } from './stock-management.service';
import { CheckoutException } from '../interfaces/checkout.interface';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly paymentGatewayStrategy: PaymentGatewayStrategy,
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    private readonly cartValidationService: CartValidationService,
    private readonly orderCreationService: OrderCreationService,
    private readonly stockManagementService: StockManagementService,
    private readonly cartService: CartService,
  ) {}

  async initializeCheckout(cartId: number, gatewayName: string) {
    try {
      // Valida o carrinho e calcula totais
      const validation = await this.cartValidationService.validateCart(cartId);
      
      // Verifica se o gateway solicitado está disponível
      const availableGateways = await this.getAvailablePaymentGateways();
      if (!availableGateways.includes(gatewayName)) {
        throw new CheckoutException(
          'INVALID_GATEWAY',
          `Gateway de pagamento '${gatewayName}' não está disponível`,
          { availableGateways },
        );
      }

      // Inicializa o gateway
      const gateway = this.paymentGatewayFactory.getGateway(gatewayName);
      await this.paymentGatewayStrategy.setGateway(gateway);
      
      return {
        success: true,
        message: 'Checkout inicializado com sucesso',
        data: {
          cartId,
          gateway: gatewayName,
          totals: {
            subtotal: validation.subtotal,
            shipping: validation.shipping,
            discounts: validation.discounts,
            total: validation.total,
          },
          items: validation.items,
        },
      };
    } catch (error) {
      if (error instanceof CheckoutException) {
        throw new BadRequestException({
          code: error.code,
          message: error.message,
          details: error.details,
        });
      }
      throw new BadRequestException('Erro ao inicializar checkout: ' + error.message);
    }
  }

  async processPayment(
    cartId: number,
    paymentMethod: string,
    customerData: any,
    address: string,
  ): Promise<PaymentGatewayResponse> {
    try {
      // Valida o carrinho novamente para garantir que não houve alterações
      const validation = await this.cartValidationService.validateCart(cartId);
      
      // Valida estoque novamente
      const hasStock = await this.stockManagementService.validateStock(validation.items);
      if (!hasStock) {
        throw new CheckoutException(
          'STOCK_VALIDATION_ERROR',
          'Estoque insuficiente para um ou mais produtos',
        );
      }

      const paymentRequest: PaymentGatewayRequest = {
        amount: validation.total,
        currency: 'BRL',
        description: `Pedido do carrinho ${cartId}`,
        paymentMethod,
        customer: {
          id: customerData.id,
          email: customerData.email,
          name: customerData.name,
        },
        metadata: {
          cartId,
          items: validation.items,
          totals: {
            subtotal: validation.subtotal,
            shipping: validation.shipping,
            discounts: validation.discounts,
          },
        },
      };

      const response = await this.paymentGatewayStrategy.processPayment(paymentRequest);
      
      if (response.success) {
        // Cria o pedido
        const orderResult = await this.orderCreationService.createOrder(
          validation,
          customerData.id,
          response.transactionId,
          address,
        );

        // Atualiza o estoque
        await this.stockManagementService.updateStock(validation.items);

        // Limpa o carrinho
        await this.cartService.clearCart(cartId);

        return {
          ...response,
          orderId: orderResult.orderId,
        };
      }

      return response;
    } catch (error) {
      if (error instanceof CheckoutException) {
        throw new BadRequestException({
          code: error.code,
          message: error.message,
          details: error.details,
        });
      }
      throw new BadRequestException('Erro ao processar pagamento: ' + error.message);
    }
  }

  async getAvailablePaymentGateways(): Promise<string[]> {
    return this.paymentGatewayFactory.getAvailableGateways();
  }
} 