import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentGatewayStrategy } from '../strategies/payment-gateway.strategy';
import { PaymentGatewayFactory } from '../factories/payment-gateway.factory';
import { PaymentGatewayRequest, PaymentGatewayResponse, PaymentGatewayInfo } from '../payment-gateway/interfaces/payment-gateway.interface';
import { CartValidationService } from './cart-validation.service';
import { OrderCreationService } from './order-creation.service';
import { StockManagementService } from './stock-management.service';
import { CheckoutException } from '../interfaces/checkout.interface';
import { CartService } from '../../cart/services/cart.service';
import { ProfileService } from '../../profile/services/profile.service';
import { ICheckoutService } from '../interfaces/checkout-service.interface';

@Injectable()
export class CheckoutService implements ICheckoutService {
  private readonly DEFAULT_GATEWAY = 'cielo';

  constructor(
    private readonly paymentGatewayStrategy: PaymentGatewayStrategy,
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    private readonly cartValidationService: CartValidationService,
    private readonly orderCreationService: OrderCreationService,
    private readonly stockManagementService: StockManagementService,
    private readonly cartService: CartService,
    private readonly profileService: ProfileService,
  ) {}

async tempCheckout() {
  const mockedResponse = {
    success: true,
    message: 'Pagamento processado com sucesso',
    data: {
      profileId: 1,
      cartId: 1,
      gateway: 'cielo',
      gatewayInfo: {
        name: 'Cielo',
        description: 'Gateway de pagamento Cielo'
      }
    }
  }

  return mockedResponse;
}

  async validateCheckout(profileId: number, gatewayName: string = this.DEFAULT_GATEWAY) {
    try {
      // Verifica se o perfil existe
      const profile = await this.profileService.findOne(profileId);
      if (!profile) {
        throw new NotFoundException(`Perfil com ID ${profileId} não encontrado`);
      }
      
      // Busca ou cria um carrinho para o perfil
      let cart = await this.cartService.findByProfileId(profileId);
      
      if (!cart || !cart.id) {
        throw new CheckoutException('CART_NOT_FOUND', 'Não foi possível acessar o carrinho');
      }
      
      // Valida o carrinho e calcula totais
      const validation = await this.cartValidationService.validateCart(cart.id);
      
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
      
      // Obtém informações do gateway
      const gatewayInfo = gateway.getGatewayInfo ? gateway.getGatewayInfo() : { name: gatewayName, supportedMethods: [] };
      
      return {
        success: true,
        message: 'Checkout inicializado com sucesso',
        data: {
          profileId,
          cartId: cart.id,
          gateway: gatewayName,
          gatewayInfo,
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao inicializar checkout: ' + error.message);
    }
  }

  async processPayment(
    profileId: number,
    paymentMethod: string,
    customerData: any,
    address: string,
  ): Promise<PaymentGatewayResponse> {
    try {
      // Verifica se o perfil existe
      const profile = await this.profileService.findOne(profileId);
      if (!profile) {
        throw new NotFoundException(`Perfil com ID ${profileId} não encontrado`);
      }
      
      // Busca o carrinho do perfil
      const cart = await this.cartService.findByProfileId(profileId);
      if (!cart || !cart.id) {
        throw new CheckoutException('CART_NOT_FOUND', 'Carrinho não encontrado para este perfil');
      }
      
      // Valida o carrinho e calcula totais
      const validation = await this.cartValidationService.validateCart(cart.id);
      
      /* Verificação de estoque temporariamente desativada
      // Valida estoque
      const hasStock = await this.stockManagementService.validateStock(validation.items);
      if (!hasStock) {
        throw new CheckoutException(
          'STOCK_VALIDATION_ERROR',
          'Estoque insuficiente para um ou mais produtos',
        );
      }
      */

      const paymentRequest: PaymentGatewayRequest = {
        amount: validation.total,
        currency: 'BRL',
        description: `Pedido do perfil ${profileId}`,
        paymentMethod,
        customer: {
          id: customerData.id || profileId,
          email: customerData.email,
          name: customerData.name,
        },
        // Adicionar dados do cartão se estiverem presentes no customerData
        cardData: customerData.cardData ? customerData.cardData : undefined,
        metadata: {
          profileId,
          cartId: cart.id,
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
          profileId,
          response.transactionId ? Number(response.transactionId) : 0,
          address,
        );

        /* Atualização de estoque temporariamente desativada
        // Atualiza o estoque
        await this.stockManagementService.updateStock(validation.items);
        */

        // Limpa o carrinho
        await this.cartService.clearCart(profileId);

        return {
          ...response,
          orderId: orderResult.orderId.toString(),
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao processar pagamento: ' + error.message);
    }
  }

  async getAvailablePaymentGateways(): Promise<string[]> {
    return this.paymentGatewayFactory.getAvailableGateways();
  }

  async getPaymentGatewaysInfo(): Promise<{ [key: string]: PaymentGatewayInfo }> {
    const gatewayNames = await this.getAvailablePaymentGateways();
    const result: { [key: string]: PaymentGatewayInfo } = {};
    
    for (const name of gatewayNames) {
      const gateway = this.paymentGatewayFactory.getGateway(name);
      if (gateway.getGatewayInfo) {
        result[name] = gateway.getGatewayInfo();
      } else {
        result[name] = {
          name,
          description: `Gateway de pagamento ${name}`,
          supportedMethods: []
        };
      }
    }
    
    return result;
  }
} 