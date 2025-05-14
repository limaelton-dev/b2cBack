import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentGatewayRequest, PaymentGatewayResponse } from '../payment-gateway/interfaces/payment-gateway.interface';

@Injectable()
export class PaymentGatewayStrategy {
  private gateway: PaymentGateway;

  async setGateway(gateway: PaymentGateway): Promise<void> {
    this.gateway = gateway;
  }

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!this.gateway) {
      throw new Error('Gateway de pagamento não configurado');
    }
    return this.gateway.processPayment(request);
  }

  getGateway(): PaymentGateway {
    if (!this.gateway) {
      throw new Error('Gateway de pagamento não configurado');
    }
    return this.gateway;
  }
} 