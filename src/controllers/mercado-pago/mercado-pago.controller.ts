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
        const orderId = parseInt(paymentData.external_reference);
        const status = this.mapPaymentStatus(paymentResponse.status);
        await this.orderService.updateStatus(orderId, status);
        this.logger.log(`Status do pedido ${orderId} atualizado para ${status}`);
      }
      
      return res.status(HttpStatus.OK).json({
        success: true,
        payment: paymentResponse
      });
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message
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
      
      return res.status(HttpStatus.OK).json({
        success: true,
        preference
      });
    } catch (error) {
      this.logger.error(`Erro ao criar preferência: ${error.message}`, error.stack);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message
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
} 