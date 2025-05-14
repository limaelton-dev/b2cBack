import { Injectable, Logger } from '@nestjs/common';
import { CieloGateway } from '../payment-gateway/cielo/cielo.gateway';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';
import { PaymentGatewayRequest, PaymentGatewayResponse } from '../payment-gateway/interfaces/payment-gateway.interface';
import { IPaymentService } from '../interfaces/payment-service.interface';

@Injectable()
export class CieloService implements IPaymentService {
  private readonly logger = new Logger(CieloService.name);

  constructor(private readonly cieloGateway: CieloGateway) {}

  async processCreditCardPayment(
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
    description: string = 'Pagamento via Cielo'
  ): Promise<PaymentGatewayResponse> {
    // Validar que todos os dados necessários do cartão estão presentes
    if (!cardData.cardNumber || !cardData.holder || !cardData.expirationDate || !cardData.securityCode) {
      this.logger.error('Dados do cartão incompletos');
      return {
        success: false,
        message: 'Dados do cartão incompletos',
        details: { missingFields: true }
      };
    }

    this.logger.log(`Processando pagamento com cartão de crédito para ${customer.name} no valor de ${amount}`);

    const paymentRequest: PaymentGatewayRequest = {
      amount,
      currency: 'BRL',
      description,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      customer: {
        id: Date.now(),
        name: customer.name,
        email: customer.email,
      },
      cardData,
    };

    try {
      const response = await this.cieloGateway.processPayment(paymentRequest);
      
      if (response.success) {
        this.logger.log(`Pagamento com cartão de crédito processado com sucesso: ${response.transactionId}`);
      } else {
        this.logger.warn(`Falha ao processar pagamento com cartão de crédito: ${response.message}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error('Erro ao processar pagamento com cartão de crédito', error.stack);
      return {
        success: false,
        message: `Erro ao processar pagamento: ${error.message}`,
        details: error
      };
    }
  }

  async processTokenizedCardPayment(
    amount: number,
    tokenData: {
      token: string;
      brand: string;
    },
    customer: {
      name: string;
      email: string;
    },
    description: string = 'Pagamento via Cielo (token)'
  ): Promise<PaymentGatewayResponse> {
    // Validar que todos os dados necessários do token estão presentes
    if (!tokenData.token || !tokenData.brand) {
      this.logger.error('Dados do token incompletos');
      return {
        success: false,
        message: 'Dados do token incompletos',
        details: { missingFields: true }
      };
    }

    this.logger.log(`Processando pagamento com cartão tokenizado para ${customer.name} no valor de ${amount}`);

    const paymentRequest: PaymentGatewayRequest = {
      amount,
      currency: 'BRL',
      description,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      customer: {
        id: Date.now(),
        name: customer.name,
        email: customer.email,
      },
      cardData: {
        token: tokenData.token,
        brand: tokenData.brand,
      },
    };

    try {
      const response = await this.cieloGateway.processPayment(paymentRequest);
      
      if (response.success) {
        this.logger.log(`Pagamento com cartão tokenizado processado com sucesso: ${response.transactionId}`);
      } else {
        this.logger.warn(`Falha ao processar pagamento com cartão tokenizado: ${response.message}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error('Erro ao processar pagamento com cartão tokenizado', error.stack);
      return {
        success: false,
        message: `Erro ao processar pagamento: ${error.message}`,
        details: error
      };
    }
  }

  async consultTransaction(paymentId: string): Promise<any> {
    try {
      this.logger.log(`Consultando transação na Cielo com ID: ${paymentId}`);
      const response = await this.cieloGateway.consultTransaction(paymentId);
      this.logger.log(`Consulta de transação ${paymentId} realizada com sucesso`);
      return response;
    } catch (error) {
      this.logger.error(`Erro ao consultar transação ${paymentId}:`, error.stack);
      return {
        success: false,
        message: `Erro ao consultar transação: ${error.message}`,
        details: error
      };
    }
  }

  async captureTransaction(paymentId: string, amount?: number): Promise<any> {
    try {
      this.logger.log(`Capturando transação na Cielo com ID: ${paymentId}${amount ? ` no valor de ${amount}` : ''}`);
      const response = await this.cieloGateway.captureTransaction(paymentId, amount);
      this.logger.log(`Captura da transação ${paymentId} realizada com sucesso`);
      return response;
    } catch (error) {
      this.logger.error(`Erro ao capturar transação ${paymentId}:`, error.stack);
      return {
        success: false,
        message: `Erro ao capturar transação: ${error.message}`,
        details: error
      };
    }
  }

  async cancelTransaction(paymentId: string, amount?: number): Promise<any> {
    try {
      this.logger.log(`Cancelando transação na Cielo com ID: ${paymentId}${amount ? ` no valor de ${amount}` : ''}`);
      const response = await this.cieloGateway.cancelTransaction(paymentId, amount);
      this.logger.log(`Cancelamento da transação ${paymentId} realizado com sucesso`);
      return response;
    } catch (error) {
      this.logger.error(`Erro ao cancelar transação ${paymentId}:`, error.stack);
      return {
        success: false,
        message: `Erro ao cancelar transação: ${error.message}`,
        details: error
      };
    }
  }

  // Método de teste que retorna os cartões de teste da Cielo para ambiente sandbox
  getTestCards() {
    this.logger.log('Obtendo cartões de teste para ambiente sandbox');
    
    return {
      creditCards: [
        {
          brand: 'Visa',
          number: '4012001038443335',
          expirationDate: '12/2030',
          securityCode: '123',
          returnCode: '4', // Operação realizada com sucesso
          description: 'Transação autorizada'
        },
        {
          brand: 'Visa',
          number: '4012001037141112',
          expirationDate: '12/2030',
          securityCode: '123',
          returnCode: '05', 
          description: 'Transação não autorizada'
        },
        {
          brand: 'Mastercard',
          number: '5453010000066167',
          expirationDate: '12/2030',
          securityCode: '123',
          returnCode: '4', // Operação realizada com sucesso
          description: 'Transação autorizada'
        },
        {
          brand: 'Mastercard',
          number: '5453010000066167',
          expirationDate: '12/2030',
          securityCode: '123',
          returnCode: '05', 
          description: 'Transação não autorizada'
        },
      ],
      debitCards: [
        {
          brand: 'Visa',
          number: '4012001037141112',
          expirationDate: '12/2030',
          securityCode: '123',
          returnCode: '4', // Operação realizada com sucesso
          description: 'Transação autorizada'
        },
        {
          brand: 'Mastercard',
          number: '5453010000066167',
          expirationDate: '12/2030',
          securityCode: '123',
          returnCode: '4', // Operação realizada com sucesso
          description: 'Transação autorizada'
        },
      ]
    };
  }
} 