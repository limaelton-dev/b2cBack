import { Injectable, Inject } from '@nestjs/common';
import { IPaymentGateway, PaymentGatewayConfig, PaymentGatewayRequest, PaymentGatewayResponse } from '../interfaces/payment-gateway.interface';

@Injectable()
export class PaymentGatewayStrategy {
  private gateway: IPaymentGateway;

  constructor(
        @Inject('PaymentGatewayConfig') 
        private readonly config: PaymentGatewayConfig
    ) {}

  setGateway(gateway: IPaymentGateway) {
    this.gateway = gateway;
    return this.gateway.initialize(this.config);
  }

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!this.gateway) {
      throw new Error('Gateway de pagamento não configurado');
    }
    return this.gateway.processPayment(request);
  }

  async refundPayment(transactionId: number, amount: number): Promise<PaymentGatewayResponse> {
    if (!this.gateway) {
      throw new Error('Gateway de pagamento não configurado');
    }
    return this.gateway.refundPayment(transactionId, amount);
  }

  async getPaymentStatus(transactionId: number): Promise<PaymentGatewayResponse> {
    if (!this.gateway) {
      throw new Error('Gateway de pagamento não configurado');
    }
    return this.gateway.getPaymentStatus(transactionId);
  }
} 