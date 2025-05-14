import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../payment-gateway/interfaces/payment-gateway.interface';

@Injectable()
export class PaymentGatewayFactory {
  private gateways: Map<string, PaymentGateway> = new Map();

  registerGateway(name: string, gateway: PaymentGateway) {
    this.gateways.set(name, gateway);
  }

  getGateway(name: string): PaymentGateway {
    const gateway = this.gateways.get(name);
    if (!gateway) {
      throw new Error(`Gateway de pagamento '${name}' não encontrado`);
    }
    return gateway;
  }

  getAvailableGateways(): string[] {
    return Array.from(this.gateways.keys());
  }
} 