import { Injectable, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { PaymentGateway, PaymentGatewayInfo, PaymentGatewayRequest, PaymentGatewayResponse } from '../interfaces/payment-gateway.interface';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';
import { CieloConfig } from './cielo.config';
import { ConfigService } from '@nestjs/config';

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
    try {
      this.logger.log(`Processando pagamento via Cielo: ${JSON.stringify({
        amount: request.amount,
        paymentMethod: request.paymentMethod,
        customer: `${request.customer.name} (${request.customer.email})`
      })}`);
      
      // Mapear o método de pagamento para o formato esperado pela Cielo
      if (request.paymentMethod === PaymentMethod.CREDIT_CARD) {
        return this.processCreditCardPayment(request);
      } else if (request.paymentMethod === PaymentMethod.DEBIT_CARD) {
        return this.processDebitCardPayment(request);
      } else {
        throw new Error(`Método de pagamento ${request.paymentMethod} não suportado pela Cielo`);
      }
    } catch (error) {
      this.logger.error('Erro ao processar pagamento na Cielo:', error.stack);
      this.logger.error('Detalhes da resposta:', error.response?.data || 'Sem detalhes disponíveis');
      
      return {
        success: false,
        message: error.response?.data?.Message || error.message || 'Erro ao processar pagamento',
        details: error.response?.data || { error: error.message }
      };
    }
  }

  private async processCreditCardPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!request.cardData) {
      this.logger.error('Dados do cartão ausentes na requisição');
      return {
        success: false,
        message: 'Dados do cartão são obrigatórios para pagamento com cartão de crédito',
        details: { error: 'missing_card_data' }
      };
    }

    // Validação mais específica dos dados do cartão
    const { cardNumber, holder, expirationDate, securityCode, brand, token } = request.cardData;
    
    // Se não for um token, validar os dados do cartão
    if (!token) {
      if (!cardNumber) {
        this.logger.error('Número do cartão ausente na requisição');
        return {
          success: false,
          message: 'Número do cartão é obrigatório',
          details: { error: 'missing_card_number' }
        };
      }
      
      if (!holder) {
        this.logger.error('Nome do titular ausente na requisição');
        return {
          success: false,
          message: 'Nome do titular do cartão é obrigatório',
          details: { error: 'missing_card_holder' }
        };
      }
      
      if (!expirationDate) {
        this.logger.error('Data de expiração do cartão ausente na requisição');
        return {
          success: false,
          message: 'Data de expiração do cartão é obrigatória',
          details: { error: 'missing_expiration_date' }
        };
      }
      
      if (!securityCode) {
        this.logger.error('Código de segurança do cartão ausente na requisição');
        return {
          success: false,
          message: 'Código de segurança do cartão é obrigatório',
          details: { error: 'missing_security_code' }
        };
      }
    }

    // Gerar IDs únicos para a transação
    const merchantOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Construir o payload para a Cielo
    const payload = {
      MerchantOrderId: merchantOrderId,
      Customer: {
        Name: request.customer.name,
        Email: request.customer.email
      },
      Payment: {
        Type: 'CreditCard',
        Amount: Math.round(request.amount * 100), // Valor em centavos
        Installments: 1, // Parcelas
        SoftDescriptor: request.description?.substring(0, 13), // Texto que aparecerá na fatura do cliente (max 13 caracteres)
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
        Capture: true // Captura automática
      }
    };

    try {
      this.logger.log(`Enviando requisição para API da Cielo: ${this.baseUrl}/1/sales`);
      const response = await axios.post(
        `${this.baseUrl}/1/sales`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data && response.data.Payment) {
        this.logger.log(`Resposta recebida da Cielo: Status ${response.data.Payment.Status}, Código ${response.data.Payment.ReturnCode}`);
        return {
          success: response.data.Payment.Status === 2, // Status 2 = Autorizado
          transactionId: response.data.Payment.PaymentId,
          paymentId: response.data.Payment.PaymentId,
          status: this.mapCieloStatus(response.data.Payment.Status),
          code: String(response.data.Payment.ReturnCode),
          message: response.data.Payment.ReturnMessage,
          details: response.data
        };
      }

      throw new Error('Resposta inesperada da Cielo');
    } catch (error) {
      this.logger.error('Erro na chamada à API da Cielo:', error.message);
      throw error; // Repassar o erro para ser tratado pelo método processPayment
    }
  }

  private async processDebitCardPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!request.cardData) {
      this.logger.error('Dados do cartão ausentes na requisição de débito');
      return {
        success: false,
        message: 'Dados do cartão são obrigatórios para pagamento com cartão de débito',
        details: { error: 'missing_card_data' }
      };
    }

    // Validação mais específica dos dados do cartão
    const { cardNumber, holder, expirationDate, securityCode, brand, token } = request.cardData;
    
    // Se não for um token, validar os dados do cartão
    if (!token) {
      if (!cardNumber) {
        this.logger.error('Número do cartão ausente na requisição de débito');
        return {
          success: false,
          message: 'Número do cartão é obrigatório',
          details: { error: 'missing_card_number' }
        };
      }
      
      if (!holder) {
        this.logger.error('Nome do titular ausente na requisição de débito');
        return {
          success: false,
          message: 'Nome do titular do cartão é obrigatório',
          details: { error: 'missing_card_holder' }
        };
      }
      
      if (!expirationDate) {
        this.logger.error('Data de expiração do cartão ausente na requisição de débito');
        return {
          success: false,
          message: 'Data de expiração do cartão é obrigatória',
          details: { error: 'missing_expiration_date' }
        };
      }
      
      if (!securityCode) {
        this.logger.error('Código de segurança do cartão ausente na requisição de débito');
        return {
          success: false,
          message: 'Código de segurança do cartão é obrigatório',
          details: { error: 'missing_security_code' }
        };
      }
    }

    // Gerar IDs únicos para a transação
    const merchantOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      MerchantOrderId: merchantOrderId,
      Customer: {
        Name: request.customer.name,
        Email: request.customer.email
      },
      Payment: {
        Type: 'DebitCard',
        Amount: Math.round(request.amount * 100), // Valor em centavos
        DebitCard: token ? {
          CardToken: token,
          Brand: brand || 'Visa'
        } : {
          CardNumber: cardNumber,
          Holder: holder,
          ExpirationDate: expirationDate,
          SecurityCode: securityCode,
          Brand: brand || 'Visa'
        },
        ReturnUrl: this.config.returnUrl || 'https://www.seusite.com.br/retorno'
      }
    };

    try {
      this.logger.log(`Enviando requisição de cartão de débito para Cielo: ${JSON.stringify({
        merchantOrderId,
        amount: request.amount,
        brand: request.cardData.brand,
        returnUrl: this.config.returnUrl
      })}`);
      
      const response = await axios.post(
        `${this.baseUrl}/1/sales`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data && response.data.Payment) {
        const result = {
          success: !!response.data.Payment.AuthenticationUrl,
          transactionId: response.data.Payment.PaymentId,
          paymentId: response.data.Payment.PaymentId,
          status: this.mapCieloStatus(response.data.Payment.Status),
          code: String(response.data.Payment.ReturnCode),
          message: response.data.Payment.ReturnMessage,
          details: {
            ...response.data,
            authenticationUrl: response.data.Payment.AuthenticationUrl
          }
        };
        
        this.logger.log(`Resposta da Cielo para débito: ${JSON.stringify({
          success: result.success,
          transactionId: result.transactionId,
          status: result.status
        })}`);
        
        return result;
      }

      throw new Error('Resposta inesperada da Cielo para cartão de débito');
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento com cartão de débito na Cielo: ${error.message}`);
      throw error; // Repassar o erro para ser tratado pelo método processPayment
    }
  }

  private mapCieloStatus(statusCode: number): string {
    const statusMap = {
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

  // Método para consultar transação
  async consultTransaction(paymentId: string): Promise<any> {
    try {
      this.logger.log(`Consultando transação ${paymentId} na Cielo`);
      const response = await axios.get(
        `${this.queryUrl}/1/sales/${paymentId}`,
        { headers: this.getHeaders() }
      );
      
      this.logger.log(`Consulta da transação ${paymentId} realizada com sucesso`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao consultar transação ${paymentId} na Cielo:`, error.response?.data || error.message);
      throw error;
    }
  }

  // Método para capturar transação
  async captureTransaction(paymentId: string, amount?: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/1/sales/${paymentId}/capture`;
      const queryParam = amount ? `?amount=${Math.round(amount * 100)}` : '';
      
      this.logger.log(`Capturando transação ${paymentId}${amount ? ` no valor de ${amount}` : ''} na Cielo`);
      const response = await axios.put(
        `${url}${queryParam}`,
        {},
        { headers: this.getHeaders() }
      );
      
      this.logger.log(`Captura da transação ${paymentId} realizada com sucesso`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao capturar transação ${paymentId} na Cielo:`, error.response?.data || error.message);
      throw error;
    }
  }

  // Método para cancelar transação
  async cancelTransaction(paymentId: string, amount?: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/1/sales/${paymentId}/void`;
      const queryParam = amount ? `?amount=${Math.round(amount * 100)}` : '';
      
      this.logger.log(`Cancelando transação ${paymentId}${amount ? ` no valor de ${amount}` : ''} na Cielo`);
      const response = await axios.put(
        `${url}${queryParam}`,
        {},
        { headers: this.getHeaders() }
      );
      
      this.logger.log(`Cancelamento da transação ${paymentId} realizado com sucesso`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao cancelar transação ${paymentId} na Cielo:`, error.response?.data || error.message);
      throw error;
    }
  }

  // Método para obter cartões de teste (apenas informativo)
  public getTestCards() {
    return {
      creditCards: [
        {
          brand: 'Visa',
          cardNumber: '4012001038443335',
          holder: 'TESTE CIELO',
          expirationDate: '12/2030',
          securityCode: '123',
          info: 'Cartão de Crédito Visa - Autorização com sucesso'
        },
        {
          brand: 'Mastercard',
          cardNumber: '5453010000066167',
          holder: 'TESTE CIELO',
          expirationDate: '12/2030',
          securityCode: '123',
          info: 'Cartão de Crédito Mastercard - Autorização com sucesso'
        },
        {
          brand: 'Visa',
          cardNumber: '4012001037141112',
          holder: 'TESTE CIELO',
          expirationDate: '12/2030',
          securityCode: '123',
          info: 'Cartão de Crédito Visa - Autorização negada'
        }
      ],
      debitCards: [
        {
          brand: 'Visa',
          cardNumber: '4024007153763191',
          holder: 'TESTE CIELO',
          expirationDate: '12/2030',
          securityCode: '123',
          info: 'Cartão de Débito Visa - Autorização com sucesso'
        }
      ]
    };
  }
} 