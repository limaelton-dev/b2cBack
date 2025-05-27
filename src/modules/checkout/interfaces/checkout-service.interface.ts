import { PaymentGatewayResponse, PaymentGatewayInfo } from '../payment-gateway/interfaces/payment-gateway.interface';

export interface ICheckoutService {
  validateCheckout(profileId: number, gatewayName?: string): Promise<{
    success: boolean;
    message: string;
    data: any;
  }>;

  tempCheckout(): Promise<{
    success: boolean;
    message: string;
    data: any;
  }>;

  processPayment(
    profileId: number,
    paymentMethod: string,
    customerData: any,
    address: string
  ): Promise<PaymentGatewayResponse>;

  getAvailablePaymentGateways(): Promise<string[]>;

  getPaymentGatewaysInfo(): Promise<{ [key: string]: PaymentGatewayInfo }>;
} 