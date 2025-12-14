import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrdersRepository } from '../../orders/repositories/orders.repository';
import { CartsService } from '../../carts/services/carts.service';
import { MercadoPagoGateway } from '../payment-gateway/mercado-pago/mercado-pago.gateway';

interface MercadoPagoWebhookPayload {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  user_id: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

type NormalizedStatus = 'approved' | 'pending' | 'rejected';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  private readonly mpStatusMap: Record<string, NormalizedStatus> = {
    approved: 'approved',
    pending: 'pending',
    in_process: 'pending',
    authorized: 'pending',
    rejected: 'rejected',
    cancelled: 'rejected',
    refunded: 'rejected',
    charged_back: 'rejected',
  };

  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepository: Repository<PaymentTransaction>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ordersRepository: OrdersRepository,
    private readonly cartsService: CartsService,
    private readonly mercadoPagoGateway: MercadoPagoGateway,
  ) {}

  async handleMercadoPagoWebhook(payload: MercadoPagoWebhookPayload): Promise<void> {
    if (payload.type !== 'payment') {
      this.logger.log(`Webhook MP ignorado: type=${payload.type}`);
      return;
    }

    const paymentId = payload.data?.id;
    if (!paymentId) {
      this.logger.warn('Webhook MP sem payment ID');
      return;
    }

    this.logger.log(`Processando webhook MP: paymentId=${paymentId}`);

    const paymentData = await this.fetchPaymentFromMercadoPago(paymentId);
    if (!paymentData) {
      return;
    }

    const transaction = await this.findTransactionByGatewayPaymentId(paymentId);
    if (!transaction) {
      this.logger.warn(`Transação não encontrada para paymentId=${paymentId}`);
      return;
    }

    const normalizedStatus = this.normalizeStatus(paymentData.status);
    if (!normalizedStatus) {
      this.logger.warn(`Status não mapeado: ${paymentData.status}`);
      return;
    }

    if (transaction.status === normalizedStatus) {
      this.logger.log(`Status já atualizado: ${normalizedStatus}`);
      return;
    }

    await this.updateTransactionStatus(transaction, normalizedStatus, paymentData.status);
    await this.updateOrderFromTransaction(transaction, normalizedStatus);

    this.logger.log(`Webhook processado: orderId=${transaction.orderId}, status=${normalizedStatus}`);
  }

  private async fetchPaymentFromMercadoPago(paymentId: string): Promise<any | null> {
    try {
      const payment = await this.mercadoPagoGateway.getPayment(paymentId);
      return payment;
    } catch (error) {
      this.logger.error(`Falha ao consultar pagamento ${paymentId}: ${error.message}`);
      return null;
    }
  }

  private async findTransactionByGatewayPaymentId(paymentId: string): Promise<PaymentTransaction | null> {
    return this.transactionRepository.findOne({
      where: { gatewayPaymentId: paymentId },
    });
  }

  private normalizeStatus(status: string): NormalizedStatus | null {
    return this.mpStatusMap[status?.toLowerCase()] ?? null;
  }

  private async updateTransactionStatus(
    transaction: PaymentTransaction,
    normalizedStatus: NormalizedStatus,
    gatewayStatus: string,
  ): Promise<void> {
    await this.transactionRepository.update(transaction.id, {
      status: normalizedStatus,
      gatewayStatus,
    });
  }

  private async updateOrderFromTransaction(
    transaction: PaymentTransaction,
    normalizedStatus: NormalizedStatus,
  ): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: transaction.orderId },
    });

    if (!order) {
      this.logger.warn(`Order não encontrada: ${transaction.orderId}`);
      return;
    }

    if (order.status !== 'WAITING_PAYMENT') {
      this.logger.log(`Order ${order.id} não está aguardando pagamento: ${order.status}`);
      return;
    }

    if (normalizedStatus === 'approved') {
      await this.ordersRepository.updateOrderStatus(
        order.id,
        'PAID_WAITING_SHIP',
        'SYSTEM',
        'Pagamento aprovado via webhook',
      );

      if (transaction.profileId) {
        try {
          await this.cartsService.clearCart(transaction.profileId);
          this.logger.log(`Carrinho limpo via webhook - Order: ${order.id}`);
        } catch (error) {
          this.logger.warn(`Falha ao limpar carrinho via webhook: ${error.message}`);
        }
      }
    } else if (normalizedStatus === 'rejected') {
      this.logger.log(`Pagamento rejeitado via webhook - Order: ${order.id}`);
    }
  }
}
