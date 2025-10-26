import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfileService } from '../../profile/services/profile.service';
import { ICheckoutService } from '../interfaces/checkout-service.interface';
import { PaymentGatewayResponse, PaymentGatewayInfo } from '../payment-gateway/interfaces/payment-gateway.interface';

@Injectable()
export class CheckoutsService implements ICheckoutService {
  private readonly DEFAULT_GATEWAY = 'cielo';

  constructor(
  ) {}
  validateCheckout(profileId: number, gatewayName?: string): Promise<{ success: boolean; message: string; data: any; }> {
    throw new Error('Method not implemented.');
  }
  tempCheckout(): Promise<{ success: boolean; message: string; data: any; }> {
    throw new Error('Method not implemented.');
  }
  processPayment(profileId: number, paymentMethod: string, customerData: any, address: string): Promise<PaymentGatewayResponse> {
    throw new Error('Method not implemented.');
  }
  getAvailablePaymentGateways(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  getPaymentGatewaysInfo(): Promise<{ [key: string]: PaymentGatewayInfo; }> {
    throw new Error('Method not implemented.');
  }

} 