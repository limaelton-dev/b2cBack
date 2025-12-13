import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentGateway } from '../payment-gateway/interfaces/payment-gateway.interface';

//verificar se a forma de criar um gateway novo está correta, pois estamos adicionando tipos fixos em vários locais(talvez seja melhor padronizar)
export type GatewayName = 'mercadopago' | 'cielo';

@Injectable()
export class PaymentGatewayFactory {
  private gateways: Map<GatewayName, PaymentGateway> = new Map();

  registerGateway(name: GatewayName, gateway: PaymentGateway): void {
    this.gateways.set(name, gateway);
  }

  getGateway(name: GatewayName): PaymentGateway {
    const gateway = this.gateways.get(name);
    if (!gateway) {
      throw new BadRequestException(`Gateway de pagamento '${name}' não está disponível`);
    }
    return gateway;
  }

  hasGateway(name: GatewayName): boolean {
    return this.gateways.has(name);
  }

  getAvailableGateways(): GatewayName[] {
    return Array.from(this.gateways.keys());
  }
}
