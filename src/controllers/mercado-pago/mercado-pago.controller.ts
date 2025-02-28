import { Controller, Post, Body, Get, Param, HttpStatus, Res, Req, Logger, ValidationPipe, UsePipes } from '@nestjs/common';
import { MercadoPagoService } from '../../services/mercado-pago/mercado-pago.service';
import { OrderService } from '../../services/order/order.service';
import { Response, Request } from 'express';
import { PaymentDTO } from '../../services/mercado-pago/dto/payment.dto';
import { PreferenceDTO, PreferenceItemDTO } from '../../services/mercado-pago/dto/preference.dto';
import { WebhookDTO } from '../../services/mercado-pago/dto/webhook.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('mercado-pago')
export class MercadoPagoController {
  private readonly logger = new Logger(MercadoPagoController.name);

  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly orderService: OrderService,
  ) {}

  /**
   * Endpoint para processar pagamentos via Checkout Transparente
   */
  @Post('process-payment')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processPayment(@Body() paymentData: PaymentDTO, @Res() res: Response) {
    try {
      this.logger.log(`Recebida solicitação de processamento de pagamento: ${JSON.stringify(paymentData)}`);
      
      // Processar o pagamento com o Mercado Pago
      const paymentResponse = await this.mercadoPagoService.createPayment(paymentData);
      
      // Atualizar o status do pedido com base na resposta do pagamento
      if (paymentData.external_reference) {
        try {
          const orderId = parseInt(paymentData.external_reference);
          const status = this.mapPaymentStatus(paymentResponse.status);
          await this.orderService.updateStatus(orderId, status);
          this.logger.log(`Status do pedido ${orderId} atualizado para ${status}`);
        } catch (orderError) {
          // Se o pedido não existir, apenas logamos o erro mas não falhamos a requisição
          // Isso é útil para testes sem um pedido real
          this.logger.warn(`Não foi possível atualizar o pedido: ${orderError.message}`);
        }
      }
      
      // Obter mensagem amigável para o status
      const userMessage = this.getUserFriendlyMessage(paymentResponse.status, paymentResponse.status_detail);
      
      // Extrair apenas as informações relevantes para o frontend
      const simplifiedResponse = {
        success: true,
        payment: {
          id: paymentResponse.id,
          status: paymentResponse.status,
          status_detail: paymentResponse.status_detail,
          payment_method_id: paymentResponse.payment_method_id,
          payment_type_id: paymentResponse.payment_type_id,
          transaction_amount: paymentResponse.transaction_amount,
          installments: paymentResponse.installments,
          date_approved: paymentResponse.date_approved,
          date_created: paymentResponse.date_created,
          currency_id: paymentResponse.currency_id,
          description: paymentResponse.description,
          external_reference: paymentResponse.external_reference,
          card: paymentResponse.card ? {
            first_six_digits: paymentResponse.card.first_six_digits,
            last_four_digits: paymentResponse.card.last_four_digits,
            expiration_month: paymentResponse.card.expiration_month,
            expiration_year: paymentResponse.card.expiration_year,
            cardholder: paymentResponse.card.cardholder
          } : null,
          fee_details: paymentResponse.fee_details,
          transaction_details: {
            net_received_amount: paymentResponse.transaction_details?.net_received_amount,
            total_paid_amount: paymentResponse.transaction_details?.total_paid_amount,
            installment_amount: paymentResponse.transaction_details?.installment_amount
          }
        },
        order_status: this.mapPaymentStatus(paymentResponse.status),
        message: userMessage,
        is_approved: paymentResponse.status === 'approved'
      };
      
      return res.status(HttpStatus.OK).json(simplifiedResponse);
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      
      // Resposta de erro mais amigável
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        error_code: error.code || 'PAYMENT_ERROR',
        details: error.cause || null,
        message: 'Ocorreu um erro ao processar o pagamento. Por favor, tente novamente ou entre em contato com o suporte.'
      });
    }
  }

  /**
   * Endpoint para criar uma preferência de pagamento (usado para checkout redirect)
   */
  @Post('create-preference')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createPreference(@Body() preferenceData: PreferenceDTO, @Res() res: Response) {
    try {
      this.logger.log(`Recebida solicitação de criação de preferência: ${JSON.stringify(preferenceData)}`);
      
      // Garantir que cada item tenha um ID
      preferenceData.items = preferenceData.items.map(item => {
        if (!item.id) {
          return {
            ...item,
            id: uuidv4()
          } as PreferenceItemDTO;
        }
        return item;
      });
      
      const preference = await this.mercadoPagoService.createPreference(preferenceData);
      
      // Extrair apenas as informações relevantes para o frontend
      const simplifiedResponse = {
        success: true,
        preference: {
          id: preference.id,
          init_point: preference.init_point,
          sandbox_init_point: preference.sandbox_init_point,
          date_created: preference.date_created,
          items: preference.items,
          external_reference: preference.external_reference,
          expires: preference.expires,
          expiration_date_from: preference.expiration_date_from,
          expiration_date_to: preference.expiration_date_to,
          marketplace: preference.marketplace,
          notification_url: preference.notification_url,
          back_urls: preference.back_urls
        }
      };
      
      return res.status(HttpStatus.OK).json(simplifiedResponse);
    } catch (error) {
      this.logger.error(`Erro ao criar preferência: ${error.message}`, error.stack);
      
      // Resposta de erro mais amigável
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        error_code: error.code || 'PREFERENCE_ERROR',
        details: error.cause || null
      });
    }
  }

  /**
   * Endpoint para receber notificações (webhooks) do Mercado Pago
   */
  @Post('webhook')
  async webhook(@Body() data: WebhookDTO, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Recebida notificação do Mercado Pago: ${JSON.stringify(data)}`);
      
      // Processar a notificação
      const result = await this.mercadoPagoService.processWebhook(data);
      
      // Se for uma notificação de pagamento, atualizar o status do pedido
      if (data.type === 'payment' && result.payment) {
        const paymentInfo = result.payment;
        if (paymentInfo.external_reference) {
          const orderId = parseInt(paymentInfo.external_reference);
          const status = this.mapPaymentStatus(paymentInfo.status);
          await this.orderService.updateStatus(orderId, status);
          this.logger.log(`Status do pedido ${orderId} atualizado para ${status} via webhook`);
        }
      }
      
      return res.status(HttpStatus.OK).json({
        success: true,
        result
      });
    } catch (error) {
      this.logger.error(`Erro ao processar webhook: ${error.message}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Endpoint para obter informações de um pagamento
   */
  @Get('payment/:id')
  async getPayment(@Param('id') id: string, @Res() res: Response) {
    try {
      this.logger.log(`Obtendo informações do pagamento: ${id}`);
      
      const payment = await this.mercadoPagoService.getPayment(parseInt(id));
      
      return res.status(HttpStatus.OK).json({
        success: true,
        payment
      });
    } catch (error) {
      this.logger.error(`Erro ao obter informações do pagamento: ${error.message}`, error.stack);
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Mapeia o status do pagamento do Mercado Pago para o status do pedido no sistema
   */
  private mapPaymentStatus(mpStatus: string): string {
    const statusMap = {
      'approved': 'APROVADO',
      'pending': 'PENDENTE',
      'in_process': 'EM_PROCESSAMENTO',
      'rejected': 'REJEITADO',
      'refunded': 'REEMBOLSADO',
      'cancelled': 'CANCELADO',
      'in_mediation': 'EM_DISPUTA',
      'charged_back': 'ESTORNADO'
    };
    
    return statusMap[mpStatus] || 'PENDENTE';
  }

  /**
   * Retorna uma mensagem amigável para o usuário com base no status e status_detail do pagamento
   */
  private getUserFriendlyMessage(status: string, statusDetail: string): string {
    if (status === 'approved') {
      return 'Pagamento aprovado com sucesso! Obrigado pela sua compra.';
    }
    
    const statusDetailMessages = {
      // Mensagens para status rejected
      'cc_rejected_bad_filled_date': 'A data do cartão está incorreta. Por favor, verifique e tente novamente.',
      'cc_rejected_bad_filled_other': 'Algum dado do cartão está incorreto. Por favor, verifique e tente novamente.',
      'cc_rejected_bad_filled_security_code': 'O código de segurança está incorreto. Por favor, verifique e tente novamente.',
      'cc_rejected_blacklist': 'Não foi possível processar seu pagamento. Por favor, use outro cartão ou entre em contato com o emissor.',
      'cc_rejected_call_for_authorize': 'Seu banco requer autorização para este pagamento. Por favor, ligue para o número no verso do seu cartão.',
      'cc_rejected_card_disabled': 'Seu cartão está desativado. Por favor, entre em contato com o emissor para ativá-lo ou use outro cartão.',
      'cc_rejected_duplicated_payment': 'Você já realizou um pagamento com este valor. Se precisar pagar novamente, use outro cartão ou outra forma de pagamento.',
      'cc_rejected_high_risk': 'Seu pagamento foi recusado por motivos de segurança. Por favor, use outro cartão ou entre em contato com o emissor.',
      'cc_rejected_insufficient_amount': 'Seu cartão não possui saldo suficiente. Por favor, use outro cartão ou entre em contato com o emissor.',
      'cc_rejected_invalid_installments': 'Seu cartão não aceita o número de parcelas selecionado. Por favor, escolha outro número de parcelas ou use outro cartão.',
      'cc_rejected_max_attempts': 'Você atingiu o limite de tentativas permitidas. Por favor, use outro cartão ou tente novamente mais tarde.',
      'cc_rejected_other_reason': 'O emissor do cartão recusou o pagamento. Por favor, use outro cartão ou entre em contato com o emissor para mais informações.',
      
      // Mensagens para status in_process
      'pending_contingency': 'Estamos processando seu pagamento. Em até 2 dias úteis informaremos por e-mail o resultado.',
      'pending_review_manual': 'Estamos analisando seu pagamento. Em até 2 dias úteis informaremos por e-mail se foi aprovado ou se precisamos de mais informações.',
      
      // Mensagens para status pending
      'pending_waiting_payment': 'Aguardando pagamento. Assim que for confirmado, atualizaremos o status do seu pedido.',
      'pending_waiting_transfer': 'Aguardando confirmação da transferência. Assim que for confirmada, atualizaremos o status do seu pedido.'
    };
    
    return statusDetailMessages[statusDetail] || 
           (status === 'rejected' ? 'Seu pagamento foi recusado. Por favor, tente novamente com outro cartão ou outra forma de pagamento.' :
            status === 'pending' ? 'Seu pagamento está pendente. Assim que for processado, atualizaremos o status do seu pedido.' :
            status === 'in_process' ? 'Seu pagamento está em processamento. Assim que for concluído, atualizaremos o status do seu pedido.' :
            'O status do seu pagamento é: ' + status);
  }
} 