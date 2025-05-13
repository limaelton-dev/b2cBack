import { Injectable } from '@nestjs/common';
import { IPaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class PaymentGatewayFactory {
  private gateways: Map<string, IPaymentGateway> = new Map();

  registerGateway(name: string, gateway: IPaymentGateway) {
    this.gateways.set(name, gateway);
  }

  getGateway(name: string): IPaymentGateway {
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