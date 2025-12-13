import { Injectable, Inject, Logger } from "@nestjs/common";
import { PaymentGateway, PaymentGatewayInfo, PaymentGatewayRequest, PaymentGatewayResponse } from "../interfaces/payment-gateway.interface";
import { MercadoPagoConfig } from "./mercado-pago.config";
import { MercadoPagoConfig as MPConfig, Payment } from 'mercadopago';
import { PaymentMethod } from "src/common/enums";
import { redact, safeStringify, buildPaymentLogMessage } from '../../../../common/helpers/payment-log.util';

@Injectable()
export class MercadoPagoGateway implements PaymentGateway {
  private readonly logger = new Logger(MercadoPagoGateway.name);
  private readonly client: MPConfig;
  private readonly payment: Payment;

  constructor(
    @Inject('MercadoPagoConfig')
    private readonly config: MercadoPagoConfig
  ) {
    this.logger.log(`Inicializando gateway Mercado Pago no ambiente ${config.environment}`);

    this.client = new MPConfig({
      accessToken: this.config.accessToken,
      options: {
        timeout: 10000,
        ...(this.config.environment === 'production' ? {} : { platformId: 'mp' })
      }
    });

    this.payment = new Payment(this.client);
    this.logger.log('Gateway Mercado Pago inicializado com sucesso');
  }

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
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

    const paymentData = {
      transaction_amount: Number(request.amount),
      token: request.cardData.token,
      description: request.description || 'Pagamento',
      installments: (request.metadata?.installments as number) || 1,
      payment_method_id: request.cardData.brand.toLowerCase(),
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
      statement_descriptor: request.metadata?.statement_descriptor as string | undefined,
    };

    const response = await this.payment.create({ body: paymentData });

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
      environment: this.config.environment
    };
  }

  async getPayment(paymentId: string): Promise<any> {
    try {
      const response = await this.payment.get({ id: paymentId });
      return redact(response);
    } catch (error) {
      this.logger.error(`Erro ao consultar pagamento ${paymentId}: ${error.message}`);
      throw error;
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<any> {
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
    try {
      const response = await this.payment.cancel({ id: paymentId });
      return redact(response);
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento ${paymentId}: ${error.message}`);
      throw error;
    }
  }
}
