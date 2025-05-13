export interface PaymentGatewayConfig {
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
}

export interface PaymentGatewayResponse {
  success: boolean;
  transactionId: number;
  status: string;
  message: string;
  metadata?: Record<string, any>;
  orderId?: number;
}

export interface PaymentGatewayRequest {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  customer: {
    id: number;
    email: string;
    name: string;
  };
  metadata?: Record<string, any>;
}

export interface IPaymentGateway {
  initialize(config: PaymentGatewayConfig): Promise<void>;
  processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse>;
  refundPayment(transactionId: number, amount: number): Promise<PaymentGatewayResponse>;
  getPaymentStatus(transactionId: number): Promise<PaymentGatewayResponse>;
} 