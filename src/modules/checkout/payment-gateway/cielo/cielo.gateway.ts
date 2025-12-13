import { Injectable, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { PaymentGateway, PaymentGatewayInfo, PaymentGatewayRequest, PaymentGatewayResponse } from '../interfaces/payment-gateway.interface';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';
import { CieloConfig } from './cielo.config';
import { ConfigService } from '@nestjs/config';
import { redact, safeStringify, buildPaymentLogMessage } from '../../../../common/helpers/payment-log.util';

@Injectable()
export class CieloGateway implements PaymentGateway {
  private readonly apiUrls = {
    sandbox: {
      transaction: 'https://apisandbox.cieloecommerce.cielo.com.br',
      query: 'https://apiquerysandbox.cieloecommerce.cielo.com.br'
    },
    production: {
      transaction: 'https://api.cieloecommerce.cielo.com.br',
      query: 'https://apiquery.cieloecommerce.cielo.com.br'
    }
  };

  private readonly logger = new Logger(CieloGateway.name);

  constructor(
    @Inject('CieloConfig') private readonly config: CieloConfig,
    private readonly configService: ConfigService
  ) {
    this.logger.log(`Gateway Cielo inicializado no ambiente ${config.environment}`);
  }

  private get baseUrl(): string {
    return this.config.environment === 'production' 
      ? this.apiUrls.production.transaction 
      : this.apiUrls.sandbox.transaction;
  }

  private get queryUrl(): string {
    return this.config.environment === 'production' 
      ? this.apiUrls.production.query 
      : this.apiUrls.sandbox.query;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'MerchantId': this.config.merchantId,
      'MerchantKey': this.config.merchantKey
    };
  }

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    const logContext = {
      orderId: request.metadata?.orderId as number,
      profileId: request.customer.id as number,
      gateway: 'cielo',
      method: request.paymentMethod,
      amount: request.amount,
    };

    try {
      this.logger.log(buildPaymentLogMessage(logContext, 'Iniciando processamento'));

      if (request.paymentMethod === PaymentMethod.CREDIT_CARD) {
        return this.processCreditCardPayment(request);
      } else if (request.paymentMethod === PaymentMethod.DEBIT_CARD) {
        return this.processDebitCardPayment(request);
      }

      throw new Error(`Método de pagamento ${request.paymentMethod} não suportado pela Cielo`);
    } catch (error) {
      this.logger.error(buildPaymentLogMessage(logContext, `Erro: ${error.message}`));
      this.logger.debug(`Detalhes: ${safeStringify(error.response?.data)}`);

      return {
        success: false,
        message: error.response?.data?.Message || error.message || 'Erro ao processar pagamento',
        details: redact(error.response?.data) || { error: error.message }
      };
    }
  }

  private async processCreditCardPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!request.cardData) {
      return {
        success: false,
        message: 'Dados do cartão são obrigatórios para pagamento com cartão de crédito',
        details: { error: 'missing_card_data' }
      };
    }

    const { token } = request.cardData;

    if (!token && !this.validateCardData(request.cardData)) {
      return {
        success: false,
        message: 'Dados do cartão incompletos',
        details: { error: 'incomplete_card_data' }
      };
    }

    const merchantOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      MerchantOrderId: merchantOrderId,
      Customer: {
        Name: request.customer.name,
        Email: request.customer.email
      },
      Payment: {
        Type: 'CreditCard',
        Amount: Math.round(request.amount * 100),
        Installments: 1,
        SoftDescriptor: request.description?.substring(0, 13),
        CreditCard: request.cardData.token ? {
          CardToken: request.cardData.token,
          Brand: request.cardData.brand || 'Visa'
        } : {
          CardNumber: request.cardData.cardNumber,
          Holder: request.cardData.holder,
          ExpirationDate: request.cardData.expirationDate,
          SecurityCode: request.cardData.securityCode,
          Brand: request.cardData.brand || 'Visa'
        },
        Capture: true
      }
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/1/sales`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data?.Payment) {
        this.logger.log(`Resposta Cielo: Status ${response.data.Payment.Status}, Code ${response.data.Payment.ReturnCode}`);
        return {
          success: response.data.Payment.Status === 2,
          transactionId: response.data.Payment.PaymentId,
          paymentId: response.data.Payment.PaymentId,
          status: this.mapCieloStatus(response.data.Payment.Status),
          code: String(response.data.Payment.ReturnCode),
          message: response.data.Payment.ReturnMessage,
          details: redact(response.data)
        };
      }

      throw new Error('Resposta inesperada da Cielo');
    } catch (error) {
      throw error;
    }
  }

  private async processDebitCardPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!request.cardData) {
      return {
        success: false,
        message: 'Dados do cartão são obrigatórios para pagamento com cartão de débito',
        details: { error: 'missing_card_data' }
      };
    }

    const { token } = request.cardData;

    if (!token && !this.validateCardData(request.cardData)) {
      return {
        success: false,
        message: 'Dados do cartão incompletos',
        details: { error: 'incomplete_card_data' }
      };
    }

    const merchantOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      MerchantOrderId: merchantOrderId,
      Customer: {
        Name: request.customer.name,
        Email: request.customer.email
      },
      Payment: {
        Type: 'DebitCard',
        Amount: Math.round(request.amount * 100),
        DebitCard: token ? {
          CardToken: token,
          Brand: request.cardData.brand || 'Visa'
        } : {
          CardNumber: request.cardData.cardNumber,
          Holder: request.cardData.holder,
          ExpirationDate: request.cardData.expirationDate,
          SecurityCode: request.cardData.securityCode,
          Brand: request.cardData.brand || 'Visa'
        },
        ReturnUrl: this.config.returnUrl || 'https://www.seusite.com.br/retorno'
      }
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/1/sales`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data?.Payment) {
        return {
          success: !!response.data.Payment.AuthenticationUrl,
          transactionId: response.data.Payment.PaymentId,
          paymentId: response.data.Payment.PaymentId,
          status: this.mapCieloStatus(response.data.Payment.Status),
          code: String(response.data.Payment.ReturnCode),
          message: response.data.Payment.ReturnMessage,
          details: redact({
            ...response.data,
            authenticationUrl: response.data.Payment.AuthenticationUrl
          })
        };
      }

      throw new Error('Resposta inesperada da Cielo para cartão de débito');
    } catch (error) {
      throw error;
    }
  }

  private validateCardData(cardData: any): boolean {
    return !!(cardData.cardNumber && cardData.holder && cardData.expirationDate && cardData.securityCode);
  }

  private mapCieloStatus(statusCode: number): string {
    const statusMap: Record<number, string> = {
      0: 'NotFinished',
      1: 'Authorized',
      2: 'PaymentConfirmed',
      3: 'Denied',
      10: 'Voided',
      11: 'Refunded',
      12: 'Pending',
      13: 'Aborted',
      20: 'Scheduled'
    };

    return statusMap[statusCode] || `Unknown(${statusCode})`;
  }

  public getGatewayInfo(): PaymentGatewayInfo {
    return {
      name: 'Cielo',
      description: 'Gateway de pagamento Cielo',
      supportedMethods: [PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD],
      environment: this.config.environment
    };
  }

  async consultTransaction(paymentId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.queryUrl}/1/sales/${paymentId}`,
        { headers: this.getHeaders() }
      );
      return redact(response.data);
    } catch (error) {
      this.logger.error(`Erro ao consultar transação ${paymentId}: ${error.message}`);
      throw error;
    }
  }

  async captureTransaction(paymentId: string, amount?: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/1/sales/${paymentId}/capture`;
      const queryParam = amount ? `?amount=${Math.round(amount * 100)}` : '';

      const response = await axios.put(
        `${url}${queryParam}`,
        {},
        { headers: this.getHeaders() }
      );
      return redact(response.data);
    } catch (error) {
      this.logger.error(`Erro ao capturar transação ${paymentId}: ${error.message}`);
      throw error;
    }
  }

  async cancelTransaction(paymentId: string, amount?: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/1/sales/${paymentId}/void`;
      const queryParam = amount ? `?amount=${Math.round(amount * 100)}` : '';

      const response = await axios.put(
        `${url}${queryParam}`,
        {},
        { headers: this.getHeaders() }
      );
      return redact(response.data);
    } catch (error) {
      this.logger.error(`Erro ao cancelar transação ${paymentId}: ${error.message}`);
      throw error;
    }
  }
}
