import { PaymentMethod } from '../../../../common/enums/payment-method.enum';

export interface PaymentGatewayRequest {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  customer: {
    id: string | number;
    email: string;
    name: string;
  };
  cardData?: {
    cardNumber?: string;
    holder?: string;
    expirationDate?: string;
    securityCode?: string;
    brand?: string;
    token?: string;
  };
  metadata?: any;
}

export interface PaymentGatewayResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  code?: string;
  message?: string;
  orderId?: string;
  paymentId?: string;
  details?: any;
}

export interface PaymentGatewayInfo {
  name: string;
  description?: string;
  supportedMethods: string[];
  environment?: string;
}

export interface PaymentGateway {
  processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse>;
  getGatewayInfo(): PaymentGatewayInfo;
} 