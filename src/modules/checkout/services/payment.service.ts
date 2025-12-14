import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentGatewayFactory, GatewayName } from '../factories/payment-gateway.factory';
import { PaymentGatewayRequest, PaymentGatewayResponse } from '../payment-gateway/interfaces/payment-gateway.interface';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';
import { ProcessPaymentDto, PaymentType, GatewayType } from '../dto/process-payment.dto';
import { Order } from '../../orders/entities/order.entity';
import { PaymentTransaction, PaymentTransactionStatus, PaymentMethodType } from '../entities/payment-transaction.entity';
import { OrdersRepository } from '../../orders/repositories/orders.repository';
import { CartsService } from '../../carts/services/carts.service';
import { redact, buildPaymentLogMessage } from '../../../common/helpers/payment-log.util';

type NormalizedPaymentStatus = 'approved' | 'pending' | 'rejected' | 'unknown';

interface GatewayStatusMap {
  approved: string[];
  pending: string[];
  rejected: string[];
}

const GATEWAY_STATUS_MAPS: Record<GatewayName, GatewayStatusMap> = {
  mercadopago: {
    approved: ['approved'],
    pending: ['pending', 'in_process', 'authorized'],
    rejected: ['rejected', 'cancelled', 'refunded', 'charged_back'],
  },
  cielo: {
    approved: ['2'],
    pending: ['0', '1', '12'],
    rejected: ['3', '10', '11', '13'],
  },
};

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  private readonly gatewayMap: Record<GatewayType, GatewayName> = {
    [GatewayType.MERCADO_PAGO]: 'mercadopago',
    [GatewayType.CIELO]: 'cielo',
  };

  private readonly paymentMethodMap: Record<PaymentType, PaymentMethod> = {
    [PaymentType.CREDIT_CARD]: PaymentMethod.CREDIT_CARD,
    [PaymentType.DEBIT_CARD]: PaymentMethod.DEBIT_CARD,
    [PaymentType.PIX]: PaymentMethod.PIX,
  };

  private readonly paymentTypeToMethodType: Record<PaymentType, PaymentMethodType> = {
    [PaymentType.CREDIT_CARD]: 'credit-card',
    [PaymentType.DEBIT_CARD]: 'debit-card',
    [PaymentType.PIX]: 'pix',
  };

  constructor(
    private readonly gatewayFactory: PaymentGatewayFactory,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepository: Repository<PaymentTransaction>,
    private readonly ordersRepository: OrdersRepository,
    private readonly cartsService: CartsService,
  ) {}

  async processPayment(
    paymentType: PaymentType,
    gateway: GatewayType,
    dto: ProcessPaymentDto,
    profileId: number,
    idempotencyKey: string,
  ): Promise<PaymentGatewayResponse> {
    const order = await this.getPayableOrderForProfile(dto.orderId, profileId);
    const gatewayName = this.gatewayMap[gateway];
    const amount = parseFloat(order.grandTotal);

    this.validatePaymentRequest(paymentType, gateway, dto, order);

    const existingTransaction = await this.findExistingTransaction(idempotencyKey, profileId);

    if (existingTransaction) {
      this.logger.warn(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        'Transação duplicada detectada',
      ));
      return this.buildSanitizedResponseFromTransaction(existingTransaction);
    }

    const transaction = await this.createTransaction(order, profileId, gatewayName, paymentType, dto, idempotencyKey);

    try {
      const gatewayInstance = this.gatewayFactory.getGateway(gatewayName);
      const paymentMethod = this.paymentMethodMap[paymentType];
      const request = this.buildPaymentRequest(paymentType, paymentMethod, dto, order);

      this.logger.log(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        'Iniciando processamento',
      ));

      const response = await gatewayInstance.processPayment(request);

      await this.updateTransactionFromResponse(transaction, response, gatewayName);
      await this.updateOrderStatusFromResponse(order, response, profileId, paymentType, gatewayName);

      this.logger.log(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        `Processamento finalizado: status=${response.status}`,
      ));

      return this.sanitizeGatewayResponse(response, paymentType);
    } catch (error) {
      await this.updateTransactionWithError(transaction, error);

      this.logger.error(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        `Erro no processamento: ${error.message}`,
      ));

      throw new BadRequestException('Erro ao processar pagamento. Tente novamente.');
    }
  }

  private async updateOrderStatusFromResponse(
    order: Order,
    response: PaymentGatewayResponse,
    profileId: number,
    paymentType: PaymentType,
    gatewayName: GatewayName,
  ): Promise<void> {
    const normalizedStatus = this.normalizeGatewayStatus(response.status ?? '', gatewayName);
    
    if (normalizedStatus === 'approved') {
      await this.ordersRepository.updateOrderStatus(
        order.id,
        'PAID_WAITING_SHIP',
        'SYSTEM',
        `Pagamento aprovado: ${response.status}`,
      );

      await this.updateOrderPaymentMethod(order.id, paymentType);

      try {
        await this.cartsService.clearCart(profileId);
        this.logger.log(`Carrinho limpo após pagamento aprovado - Order: ${order.id}`);
      } catch (error) {
        this.logger.warn(`Falha ao limpar carrinho - Order: ${order.id}: ${error.message}`);
      }
    } else if (normalizedStatus === 'rejected') {
      this.logger.log(`Pagamento rejeitado - Order: ${order.id}, Status: ${response.status}`);
    } else if (normalizedStatus === 'pending') {
      this.logger.log(`Pagamento pendente - Order: ${order.id}, Status: ${response.status}`);
    }
  }

  private normalizeGatewayStatus(status: string, gatewayName: GatewayName): NormalizedPaymentStatus {
    const statusMap = GATEWAY_STATUS_MAPS[gatewayName];
    if (!statusMap) {
      return 'unknown';
    }

    const normalizedInput = status.toLowerCase();

    if (statusMap.approved.some(s => s.toLowerCase() === normalizedInput)) {
      return 'approved';
    }
    if (statusMap.pending.some(s => s.toLowerCase() === normalizedInput)) {
      return 'pending';
    }
    if (statusMap.rejected.some(s => s.toLowerCase() === normalizedInput)) {
      return 'rejected';
    }

    return 'unknown';
  }

  private async updateOrderPaymentMethod(orderId: number, paymentType: PaymentType): Promise<void> {
    const paymentMethodStr = {
      [PaymentType.CREDIT_CARD]: 'CREDIT_CARD',
      [PaymentType.DEBIT_CARD]: 'DEBIT_CARD',
      [PaymentType.PIX]: 'PIX',
    }[paymentType];

    await this.orderRepository.update(orderId, { paymentMethod: paymentMethodStr });
  }

  private async findExistingTransaction(idempotencyKey: string, profileId: number): Promise<PaymentTransaction | null> {
    return this.transactionRepository.findOne({
      where: { idempotencyKey, profileId },
    });
  }

  private async createTransaction(
    order: Order,
    profileId: number,
    gateway: GatewayName,
    paymentType: PaymentType,
    dto: ProcessPaymentDto,
    idempotencyKey: string,
  ): Promise<PaymentTransaction> {
    const transaction = this.transactionRepository.create({
      orderId: order.id,
      profileId,
      gateway,
      method: this.paymentTypeToMethodType[paymentType],
      amount: order.grandTotal,
      currency: 'BRL',
      idempotencyKey,
      status: 'processing',
      requestSnapshot: redact({
        orderId: order.id,
        paymentType,
        installments: dto.installments,
        card: dto.card ? { brand: dto.card.brand } : null,
      }),
    });

    return this.transactionRepository.save(transaction);
  }

  private async updateTransactionFromResponse(
    transaction: PaymentTransaction,
    response: PaymentGatewayResponse,
    gatewayName: GatewayName,
  ): Promise<void> {
    const normalizedStatus = this.normalizeGatewayStatus(response.status ?? '', gatewayName);
    let status: PaymentTransactionStatus;

    switch (normalizedStatus) {
      case 'approved':
        status = 'approved';
        break;
      case 'rejected':
        status = 'rejected';
        break;
      case 'pending':
        status = 'pending';
        break;
      default:
        status = response.success ? 'approved' : 'rejected';
    }

    await this.transactionRepository.update(transaction.id, {
      status,
      gatewayPaymentId: response.transactionId ?? response.paymentId ?? null,
      gatewayStatus: response.status ?? null,
      statusDetail: response.code ?? null,
      responseSnapshot: redact({
        success: response.success,
        status: response.status,
        code: response.code,
        transactionId: response.transactionId,
      }),
    });
  }

  private async updateTransactionWithError(transaction: PaymentTransaction, error: Error): Promise<void> {
    await this.transactionRepository.update(transaction.id, {
      status: 'error',
      errorMessage: error.message,
      responseSnapshot: redact({
        error: error.message,
        stack: error.stack?.substring(0, 500),
      }),
    });
  }

  private buildSanitizedResponseFromTransaction(transaction: PaymentTransaction): PaymentGatewayResponse {
    return {
      success: transaction.status === 'approved',
      transactionId: transaction.gatewayPaymentId ?? undefined,
      status: transaction.gatewayStatus ?? undefined,
      message: 'Transação já processada anteriormente',
    };
  }

  private sanitizeGatewayResponse(response: PaymentGatewayResponse, paymentType: PaymentType): PaymentGatewayResponse {
    const sanitized: PaymentGatewayResponse = {
      success: response.success,
      status: response.status,
      transactionId: response.transactionId,
      paymentId: response.paymentId,
      message: this.sanitizeErrorMessage(response.message),
    };

    if (paymentType === PaymentType.PIX && response.details) {
      sanitized.details = {
        qrCode: response.details.qrCode,
        qrCodeBase64: response.details.qrCodeBase64,
        ticketUrl: response.details.ticketUrl,
        expirationDate: response.details.expirationDate,
      };
    }

    return sanitized;
  }

  private sanitizeErrorMessage(message?: string): string | undefined {
    if (!message) return undefined;
    
    const sensitivePatterns = [
      /cpf|cnpj|email|token|card|senha|password/i,
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(message)) {
        return 'Erro no processamento do pagamento';
      }
    }
    
    return message;
  }

  private async getPayableOrderForProfile(orderId: number, profileId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['profile', 'profile.profilePf', 'profile.profilePj', 'profile.user'],
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.profileId !== profileId) {
      throw new ForbiddenException('Pedido não pertence ao usuário');
    }

    if (order.status !== 'WAITING_PAYMENT') {
      throw new BadRequestException('Pedido não está aguardando pagamento');
    }

    return order;
  }

  private extractCustomerData(order: Order): { customerName: string; customerEmail: string } {
    const profile = order.profile;

    if (!profile) {
      return { customerName: '', customerEmail: '' };
    }

    const email = (profile as any).user?.email ?? '';
    const profilePf = (profile as any).profilePf;
    const profilePj = (profile as any).profilePj;

    let name = '';
    if (profilePf) {
      name = `${profilePf.firstName ?? ''} ${profilePf.lastName ?? ''}`.trim();
    } else if (profilePj) {
      name = profilePj.companyName ?? profilePj.tradingName ?? '';
    }

    return { customerName: name, customerEmail: email };
  }

  private validatePaymentRequest(
    paymentType: PaymentType,
    gateway: GatewayType,
    dto: ProcessPaymentDto,
    order: Order,
  ): void {
    if (paymentType !== PaymentType.PIX && !dto.card) {
      throw new BadRequestException('Dados do cartão são obrigatórios para pagamentos com cartão');
    }

    if (gateway === GatewayType.CIELO && paymentType === PaymentType.PIX) {
      throw new BadRequestException('Cielo não suporta pagamentos via PIX');
    }

    const amount = parseFloat(order.grandTotal);
    if (amount <= 0) {
      throw new BadRequestException('Valor do pedido inválido');
    }
  }

  private buildPaymentRequest(
    paymentType: PaymentType,
    paymentMethod: PaymentMethod,
    dto: ProcessPaymentDto,
    order: Order,
  ): PaymentGatewayRequest {
    const amount = parseFloat(order.grandTotal);
    const { customerName, customerEmail } = this.extractCustomerData(order);

    const request: PaymentGatewayRequest = {
      amount,
      currency: 'BRL',
      description: dto.description || `Pedido #${order.id}`,
      paymentMethod,
      customer: {
        id: order.profileId!,
        name: customerName,
        email: customerEmail,
      },
      metadata: {
        orderId: order.id,
        partnerOrderId: order.partnerOrderId,
      },
    };

    if (paymentType !== PaymentType.PIX && dto.card) {
      request.cardData = {
        token: dto.card.token,
        brand: dto.card.brand,
      };
      request.metadata = {
        ...request.metadata,
        installments: dto.installments || 1,
      };
    }

    if (dto.payerIdentification) {
      request.metadata = {
        ...request.metadata,
        payer: {
          identification: dto.payerIdentification,
        },
      };
    }

    return request;
  }

  getAvailableGateways(): GatewayName[] {
    return this.gatewayFactory.getAvailableGateways();
  }

  getGatewaysInfo(): Record<string, any> {
    const gateways = this.gatewayFactory.getAvailableGateways();
    const info: Record<string, any> = {};

    for (const name of gateways) {
      const gateway = this.gatewayFactory.getGateway(name);
      info[name] = gateway.getGatewayInfo();
    }

    return info;
  }
}
