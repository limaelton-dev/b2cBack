import { PaymentGatewayResponse } from '../payment-gateway/interfaces/payment-gateway.interface';

export interface IPaymentService {
  processCreditCardPayment(
    amount: number,
    cardData: {
      cardNumber: string;
      holder: string;
      expirationDate: string;
      securityCode: string;
      brand: string;
    },
    customer: {
      name: string;
      email: string;
    },
    description?: string
  ): Promise<PaymentGatewayResponse>;

  processTokenizedCardPayment(
    amount: number,
    tokenData: {
      token: string;
      brand: string;
    },
    customer: {
      name: string;
      email: string;
    },
    description?: string
  ): Promise<PaymentGatewayResponse>;

  consultTransaction(transactionId: string): Promise<any>;
  
  captureTransaction(transactionId: string, amount?: number): Promise<any>;
  
  cancelTransaction(transactionId: string, amount?: number): Promise<any>;
  
  getTestCards(): any;
} 