import { Injectable, Inject, Logger } from "@nestjs/common";
import { PaymentGateway, PaymentGatewayInfo, PaymentGatewayRequest, PaymentGatewayResponse } from "../interfaces/payment-gateway.interface";
import { MercadoPagoConfig } from "./mercado-pago.config";
import { MercadoPagoConfig as MPConfig, Payment } from 'mercadopago';
import { PaymentMethod } from "src/common/enums";
import { redact, safeStringify, buildPaymentLogMessage } from '../../../../common/helpers/payment-log.util';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MercadoPagoGateway implements PaymentGateway {
  private readonly logger = new Logger(MercadoPagoGateway.name);
  private readonly client: MPConfig | null;
  private readonly payment: Payment | null;
  private readonly debugMode: boolean;
  private readonly logsBaseDir: string;

  constructor(
    @Inject('MercadoPagoConfig')
    private readonly config: MercadoPagoConfig | null
  ) {
    this.debugMode = process.env.NODE_ENV !== 'production';
    this.logsBaseDir = join(process.cwd(), 'logs', 'mercadopago');

    if (!config) {
      this.client = null;
      this.payment = null;
      return;
    }

    this.logger.log(`Inicializando gateway Mercado Pago no ambiente ${config.environment}`);
    this.client = new MPConfig({
      accessToken: config.accessToken,
      options: {
        timeout: 10000,
      }
    });

    this.payment = new Payment(this.client);
    this.logger.log('Gateway Mercado Pago inicializado com sucesso');
  }

  /**
   * Gera comando curl equivalente para debug
   */
  private generateCurl(operation: string, body: any, token: string): string {
    const url = 'https://api.mercadopago.com/v1/payments';
    const headers = [
      `-H "Authorization: Bearer ${this.config?.accessToken}"`,
      `-H "Content-Type: application/json"`,
      `-H "X-Idempotency-Key: ${body?.requestOptions?.idempotencyKey || 'none'}"`,
    ];
    
    // Monta o body sem redactar o token para o curl funcionar
    const curlBody = body?.body ? JSON.stringify(body.body) : '{}';
    
    return `curl -X POST "${url}" \\\n  ${headers.join(' \\\n  ')} \\\n  -d '${curlBody}'`;
  }

  /**
   * Loga request/response do Mercado Pago em arquivo JSON (similar ao AnyMarket)
   * Logs são salvos em: logs/mercadopago/{DD-MM-YYYY}/{timestamp}_{operation}_{status}.json
   */
  private logMercadoPago(operation: string, request?: any, response?: any, error?: any, duration?: number, originalToken?: string): void {
    if (!this.debugMode) return;
    
    const now = new Date();
    const dayFolder = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const dayPath = join(this.logsBaseDir, dayFolder);
    
    if (!existsSync(dayPath)) mkdirSync(dayPath, { recursive: true });
    
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const status = error ? 'ERROR' : 'OK';
    const fileName = `${timestamp}_${operation}_${status}.json`;
    
    // Redacta token do cartão para segurança no request logado
    const safeRequest = request ? JSON.parse(JSON.stringify(request)) : undefined;
    if (safeRequest?.token) safeRequest.token = '[REDACTED]';
    if (safeRequest?.body?.token) safeRequest.body.token = '[REDACTED]';
    
    // Gera curl com token original para facilitar debug manual
    const curlRequest = request ? JSON.parse(JSON.stringify(request)) : undefined;
    if (curlRequest?.body && originalToken) {
      curlRequest.body.token = originalToken;
    }
    const curl = this.generateCurl(operation, curlRequest, originalToken || '');
    
    // Extrai resposta completa em texto
    let textResponse = '';
    if (response) {
      textResponse = JSON.stringify(response, null, 2);
    } else if (error) {
      textResponse = JSON.stringify({
        message: error.message,
        status: error.status,
        cause: error.cause,
        errorCode: error.errorCode,
        error: error.error,
        stack: error.stack?.substring(0, 500),
        response: error.response,
        apiResponse: error.apiResponse,
        // Captura todas as propriedades do erro
        allKeys: Object.keys(error),
        allValues: Object.fromEntries(
          Object.keys(error).map(k => [k, typeof error[k] === 'object' ? JSON.stringify(error[k]) : error[k]])
        ),
      }, null, 2);
    }
    
    const entry = {
      timestamp: now.toISOString(),
      operation,
      environment: this.config?.environment,
      accessTokenPrefix: this.config?.accessToken?.substring(0, 15),
      curl,
      request: safeRequest,
      response,
      textResponse,
      error: error ? { 
        message: error.message, 
        status: error.status,
        cause: error.cause,
        errorCode: error.errorCode,
        apiResponse: error.response?.data || error.apiResponse,
        fullError: Object.fromEntries(
          Object.keys(error).filter(k => k !== 'stack').map(k => [k, error[k]])
        ),
      } : undefined,
      duration,
    };
    
    try {
      writeFileSync(join(dayPath, fileName), JSON.stringify(entry, null, 2));
      this.logger.debug(`Log MP salvo: ${fileName}`);
    } catch (logError) {
      this.logger.warn(`Falha ao salvar log MP: ${logError.message}`);
    }
  }

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!this.config || !this.payment) {
      throw new Error('Mercado Pago não está configurado');
    }

    const logContext = {
      orderId: request.metadata?.orderId as number,
      profileId: request.customer.id as number,
      gateway: 'mercadopago',
      method: request.paymentMethod,
      amount: request.amount,
    };

    try {
      this.logger.log(buildPaymentLogMessage(logContext, 'Iniciando processamento'));

      if (request.paymentMethod === PaymentMethod.CREDIT_CARD) {
        return await this.processCreditCard(request);
      } else if (request.paymentMethod === PaymentMethod.PIX) {
        return await this.processPix(request);
      } else if (request.paymentMethod === PaymentMethod.DEBIT_CARD) {
        return await this.processDebitCard(request);
      }

      throw new Error(`Método de pagamento ${request.paymentMethod} não suportado pelo Mercado Pago`);
    } catch (error) {
      this.logger.error(buildPaymentLogMessage(logContext, `Erro: ${error.message}`));
      this.logger.debug(`Detalhes: ${safeStringify(error.response?.data)}`);

      return {
        success: false,
        message: error.message || 'Erro ao processar pagamento',
        details: redact(error.response?.data) || { error: error.message }
      };
    }
  }

  private async processCreditCard(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!request.cardData?.token || !request.cardData?.brand) {
      return {
        success: false,
        message: 'Token e bandeira do cartão são obrigatórios',
        details: { error: 'missing_card_data' }
      };
    }

    const { firstName, lastName } = this.splitName(request.customer.name);

    // Monta o payload base removendo campos undefined/vazios
    // Mapeia nomes de bandeiras para IDs do Mercado Pago
    const brandToPaymentMethodId: Record<string, string> = {
      'mastercard': 'master',
      'visa': 'visa',
      'amex': 'amex',
      'elo': 'elo',
      'hipercard': 'hipercard',
      'diners': 'diners',
    };
    const paymentMethodId = brandToPaymentMethodId[request.cardData.brand.toLowerCase()] || request.cardData.brand.toLowerCase();

    const paymentData: Record<string, any> = {
      transaction_amount: Number(request.amount),
      token: request.cardData.token,
      description: request.description || 'Pagamento',
      installments: (request.metadata?.installments as number) || 1,
      payment_method_id: paymentMethodId,
      payer: {
        email: request.customer.email,
        first_name: firstName,
        last_name: lastName,
      },
      metadata: {
        orderId: request.metadata?.orderId,
        customer_id: String(request.customer.id),
      },
    };

    // Adiciona identification apenas se tiver dados válidos
    const identification = request.metadata?.payer?.identification;
    if (identification?.type && identification?.number) {
      paymentData.payer.identification = identification;
    }

    // Adiciona notification_url apenas se configurado
    if (this.config.notificationUrl) {
      paymentData.notification_url = this.config.notificationUrl;
    }

    // Adiciona statement_descriptor apenas se definido
    const statementDescriptor = request.metadata?.statement_descriptor as string | undefined;
    if (statementDescriptor) {
      paymentData.statement_descriptor = statementDescriptor;
    }

    // Gera idempotency key única para esta transação
    const idempotencyKey = `${request.metadata?.orderId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Log do request antes de enviar
    const startTime = Date.now();
    const createRequest = { 
      body: paymentData,
      requestOptions: { idempotencyKey }
    };

    // Guarda o token original para o curl
    const originalToken = request.cardData.token;
    
    let response;
    try {
      response = await this.payment.create(createRequest);
      
      // Log de sucesso
      this.logMercadoPago('payment_create', createRequest, response, undefined, Date.now() - startTime, originalToken);
    } catch (mpError: any) {
      // Log de erro detalhado em arquivo
      this.logMercadoPago('payment_create', createRequest, undefined, mpError, Date.now() - startTime, originalToken);
      throw mpError;
    }

    this.logger.log(`Resposta MP: Status ${response.status}, ID ${response.id}`);

    return {
      success: ['approved', 'in_process', 'pending'].includes(response.status || ''),
      transactionId: String(response.id),
      paymentId: String(response.id),
      status: response.status || 'unknown',
      code: String(response.status_detail),
      message: response.status_detail || 'Pagamento processado',
      details: redact({
        id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        captured: response.captured,
      })
    };
  }

  private async processDebitCard(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (!request.cardData?.token) {
      return {
        success: false,
        message: 'Token do cartão é obrigatório',
        details: { error: 'missing_card_token' }
      };
    }

    const { firstName, lastName } = this.splitName(request.customer.name);

    const paymentData = {
      transaction_amount: Number(request.amount),
      token: request.cardData.token,
      description: request.description || 'Pagamento',
      payment_method_id: request.cardData.brand?.toLowerCase() || 'debvisa',
      payer: {
        email: request.customer.email,
        first_name: firstName,
        last_name: lastName,
        identification: request.metadata?.payer?.identification || undefined,
      },
      notification_url: this.config.notificationUrl,
      metadata: {
        ...request.metadata,
        customer_id: String(request.customer.id),
      },
    };

    const response = await this.payment.create({ body: paymentData });

    this.logger.log(`Resposta MP débito: Status ${response.status}, ID ${response.id}`);

    return {
      success: ['approved', 'in_process', 'pending'].includes(response.status || ''),
      transactionId: String(response.id),
      paymentId: String(response.id),
      status: response.status || 'unknown',
      code: String(response.status_detail),
      message: response.status_detail || 'Pagamento processado',
      details: redact({ id: response.id, status: response.status })
    };
  }

  private async processPix(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    const { firstName, lastName } = this.splitName(request.customer.name);

    const paymentData = {
      transaction_amount: Number(request.amount),
      description: request.description || 'Pagamento via PIX',
      payment_method_id: 'pix',
      payer: {
        email: request.customer.email,
        first_name: firstName,
        last_name: lastName,
        identification: request.metadata?.payer?.identification || undefined,
      },
      notification_url: this.config.notificationUrl,
      metadata: {
        ...request.metadata,
        customer_id: String(request.customer.id),
      },
    };

    const response = await this.payment.create({ body: paymentData });

    this.logger.log(`PIX criado: ID ${response.id}, Status ${response.status}`);

    const qrCode = response.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = response.point_of_interaction?.transaction_data?.qr_code_base64;
    const ticketUrl = response.point_of_interaction?.transaction_data?.ticket_url;

    return {
      success: true,
      transactionId: String(response.id),
      paymentId: String(response.id),
      status: response.status || 'pending',
      code: String(response.status_detail),
      message: 'QR Code PIX gerado com sucesso',
      details: {
        id: response.id,
        status: response.status,
        qrCode,
        qrCodeBase64,
        ticketUrl,
        expirationDate: response.date_of_expiration,
      }
    };
  }

  private splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || firstName;
    return { firstName, lastName };
  }

  getGatewayInfo(): PaymentGatewayInfo {
    return {
      name: 'Mercado Pago',
      description: 'Gateway de pagamento Mercado Pago com suporte a cartão de crédito, débito e PIX',
      supportedMethods: [
        PaymentMethod.CREDIT_CARD,
        PaymentMethod.DEBIT_CARD,
        PaymentMethod.PIX
      ],
      environment: this.config?.environment || 'sandbox'
    };
  }

  async getPayment(paymentId: string): Promise<any> {
    if (!this.payment) {
      throw new Error('Mercado Pago não está configurado');
    }

    try {
      const response = await this.payment.get({ id: paymentId });
      return redact(response);
    } catch (error) {
      this.logger.error(`Erro ao consultar pagamento ${paymentId}: ${error.message}`);
      throw error;
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<any> {
    if (!this.payment) {
      throw new Error('Mercado Pago não está configurado');
    }

    try {
      const refundParams: any = { id: paymentId };
      if (amount) {
        refundParams.body = { amount: Number(amount) };
      }

      const response = await (this.payment as any).refund(refundParams);
      return redact(response);
    } catch (error) {
      this.logger.error(`Erro ao reembolsar pagamento ${paymentId}: ${error.message}`);
      throw error;
    }
  }

  async cancelPayment(paymentId: string): Promise<any> {
    if (!this.payment) {
      throw new Error('Mercado Pago não está configurado');
    }

    try {
      const response = await this.payment.cancel({ id: paymentId });
      return redact(response);
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento ${paymentId}: ${error.message}`);
      throw error;
    }
  }
}
