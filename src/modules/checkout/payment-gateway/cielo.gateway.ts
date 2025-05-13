import { Injectable, Logger } from '@nestjs/common';
import { 
  IPaymentGateway, 
  PaymentGatewayConfig, 
  PaymentGatewayRequest, 
  PaymentGatewayResponse,
  PaymentGatewayInfo
} from '../interfaces/payment-gateway.interface';
import { CIELO_PAYMENT_METHODS } from './cielo-payment-methods';

@Injectable()
export class CieloGateway implements IPaymentGateway {
  private config: PaymentGatewayConfig;
  private logger = new Logger('CieloGateway');

  async initialize(config: PaymentGatewayConfig): Promise<void> {
    this.logger.log('Inicializando gateway CIELO');
    this.config = config;
    // Simula a inicialização da API da CIELO
    this.logger.log(`CIELO API inicializada no ambiente: ${config.environment}`);
  }

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    this.logger.log(`Processando pagamento de ${request.amount} ${request.currency} via CIELO`);
    
    // Simulando validação de dados
    if (!request.paymentMethod) {
      return {
        success: false,
        transactionId: 0,
        status: 'FAILED',
        message: 'Método de pagamento não informado',
      };
    }

    // Verificando se o método de pagamento é suportado
    const paymentMethod = CIELO_PAYMENT_METHODS.find(
      method => method.id === request.paymentMethod
    );

    if (!paymentMethod) {
      return {
        success: false,
        transactionId: 0,
        status: 'FAILED',
        message: `Método de pagamento '${request.paymentMethod}' não é suportado pela CIELO`,
      };
    }

    // Simulando processamento do pagamento na CIELO
    this.logger.log(`Enviando transação para a CIELO: ${JSON.stringify({
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      method: paymentMethod.name,
      type: paymentMethod.type,
      customer: `${request.customer.name} (${request.customer.email})`,
    })}`);

    // Simulando resposta da CIELO com sucesso (em um cenário real, isso viria da API da CIELO)
    const transactionId = Math.floor(Math.random() * 10000000);
    
    return {
      success: true,
      transactionId,
      status: 'AUTHORIZED',
      message: 'Pagamento autorizado com sucesso',
      metadata: {
        authorizationCode: `AUTH${Math.floor(Math.random() * 1000000)}`,
        paymentMethod: paymentMethod.name,
        cardBrand: paymentMethod.name,
        last4Digits: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        installments: 1,
        date: new Date().toISOString()
      }
    };
  }

  async refundPayment(transactionId: number, amount: number): Promise<PaymentGatewayResponse> {
    this.logger.log(`Solicitando reembolso da transação ${transactionId} no valor de ${amount}`);
    
    // Simulando um reembolso na CIELO
    return {
      success: true,
      transactionId,
      status: 'REFUNDED',
      message: 'Reembolso processado com sucesso',
      metadata: {
        refundId: `REF${Math.floor(Math.random() * 1000000)}`,
        refundDate: new Date().toISOString(),
        refundAmount: amount
      }
    };
  }

  async getPaymentStatus(transactionId: number): Promise<PaymentGatewayResponse> {
    this.logger.log(`Consultando status da transação ${transactionId}`);
    
    // Simulando consulta de status na CIELO
    return {
      success: true,
      transactionId,
      status: 'CAPTURED',
      message: 'Transação capturada com sucesso',
      metadata: {
        capturedDate: new Date().toISOString(),
        authorizationCode: `AUTH${Math.floor(Math.random() * 1000000)}`,
      }
    };
  }

  getGatewayInfo(): PaymentGatewayInfo {
    return {
      name: 'CIELO',
      description: 'Gateway de pagamento da CIELO para cartões de crédito, débito e PIX',
      logo: 'https://www.cielo.com.br/assets/images/logos/cielo-logo.png',
      supportedMethods: CIELO_PAYMENT_METHODS
    };
  }

  private getCardBrandFromMethod(paymentMethod: string): string {
    // Lógica para extrair a bandeira do cartão do método de pagamento
    if (paymentMethod.toLowerCase().includes('visa')) return 'Visa';
    if (paymentMethod.toLowerCase().includes('mastercard')) return 'Mastercard';
    if (paymentMethod.toLowerCase().includes('amex')) return 'American Express';
    if (paymentMethod.toLowerCase().includes('elo')) return 'Elo';
    if (paymentMethod.toLowerCase().includes('hipercard')) return 'Hipercard';
    return 'Desconhecido';
  }
} 