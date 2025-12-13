import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { PaymentGatewayFactory, GatewayName } from '../factories/payment-gateway.factory';
import { PaymentGatewayRequest, PaymentGatewayResponse } from '../payment-gateway/interfaces/payment-gateway.interface';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';
import { ProcessPaymentDto, PaymentType, GatewayType } from '../dto/process-payment.dto';
import { Order, OrderStatus } from '../../orders/entities/order.entity';
import { PaymentTransaction, PaymentTransactionStatus, PaymentMethodType } from '../entities/payment-transaction.entity';
import { OrdersRepository } from '../../orders/repositories/orders.repository';
import { CartsService } from '../../carts/services/carts.service';
import { redact, buildPaymentLogMessage } from '../../../common/helpers/payment-log.util';

//verificar a padronização de uso de constantes, pode ser enum? pode ser objeto?... pode continuar assim?
const APPROVED_STATUSES = ['approved', 'PaymentConfirmed', 'Authorized'];
const PENDING_STATUSES = ['pending', 'in_process', 'Pending', 'NotFinished'];
const REJECTED_STATUSES = ['rejected', 'cancelled', 'Denied', 'Aborted', 'Voided'];

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  private readonly gatewayMap: Record<GatewayType, GatewayName> = {
    [GatewayType.MERCADO_PAGO]: 'mercadopago',
    [GatewayType.CIELO]: 'cielo',
  };

  //não entendi a diferença dessas duas...
  //PaymentMethod e PaymentMethod estão duplicados? tem funções iguais ou diferentes? é possível abstrair código sem deixar complexo?
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
  ): Promise<PaymentGatewayResponse> {
    const order = await this.findAndValidateOrder(dto.orderId, profileId);
    const gatewayName = this.gatewayMap[gateway];
    const amount = parseFloat(order.grandTotal);

    this.validatePaymentRequest(paymentType, gateway, dto, order);

    const idempotencyKey = this.generateIdempotencyKey(order.id, gatewayName);
    const existingTransaction = await this.findExistingTransaction(idempotencyKey);

    if (existingTransaction) {
      this.logger.warn(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        'Transação duplicada detectada',
      ));
      return this.buildResponseFromTransaction(existingTransaction);
    }

    const transaction = await this.createTransaction(order, profileId, gatewayName, paymentType, dto, idempotencyKey);

    try {
      const gatewayInstance = this.gatewayFactory.getGateway(gatewayName);
      const paymentMethod = this.paymentMethodMap[paymentType];
      //TODO: verificar se estamos pegando holder name corretamente em casos de cartão(pode ser que o holder seja diferente do usuário que está comprando)
      const request = this.buildPaymentRequest(paymentType, paymentMethod, dto, order);

      this.logger.log(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        'Iniciando processamento',
      ));

      const response = await gatewayInstance.processPayment(request);

      await this.updateTransactionFromResponse(transaction, response);
      await this.updateOrderStatusFromResponse(order, response, profileId, paymentType);

      this.logger.log(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        `Processamento finalizado: status=${response.status}`,
      ));

      return response;
    } catch (error) {
      await this.updateTransactionWithError(transaction, error);

      this.logger.error(buildPaymentLogMessage(
        { orderId: order.id, profileId, gateway: gatewayName, method: paymentType, amount },
        `Erro no processamento: ${error.message}`,
      ));

      throw error;
    }
  }

  private async updateOrderStatusFromResponse(
    order: Order,
    response: PaymentGatewayResponse,
    profileId: number,
    paymentType: PaymentType,
  ): Promise<void> {
    const gatewayStatus = response.status ?? '';
    
    if (this.isApprovedStatus(gatewayStatus)) {
      await this.ordersRepository.updateOrderStatus(
        order.id,
        'PAID_WAITING_SHIP',
        'SYSTEM',
        `Pagamento aprovado: ${gatewayStatus}`,
      );

      await this.updateOrderPaymentMethod(order.id, paymentType);

      try {
        await this.cartsService.clearCart(profileId);
        this.logger.log(`Carrinho limpo após pagamento aprovado - Order: ${order.id}`);
      } catch (error) {
        this.logger.warn(`Falha ao limpar carrinho - Order: ${order.id}: ${error.message}`);
      }
    } else if (this.isRejectedStatus(gatewayStatus)) {
      this.logger.log(`Pagamento rejeitado - Order: ${order.id}, Status: ${gatewayStatus}`);
    } else if (this.isPendingStatus(gatewayStatus)) {
      this.logger.log(`Pagamento pendente - Order: ${order.id}, Status: ${gatewayStatus}`);
    }
  }

  private isApprovedStatus(status: string): boolean {
    return APPROVED_STATUSES.some(s => status.toLowerCase().includes(s.toLowerCase()));
  }

  private isPendingStatus(status: string): boolean {
    return PENDING_STATUSES.some(s => status.toLowerCase().includes(s.toLowerCase()));
  }

  private isRejectedStatus(status: string): boolean {
    return REJECTED_STATUSES.some(s => status.toLowerCase().includes(s.toLowerCase()));
  }

  private async updateOrderPaymentMethod(orderId: number, paymentType: PaymentType): Promise<void> {
    const paymentMethodStr = {
      [PaymentType.CREDIT_CARD]: 'CREDIT_CARD',
      [PaymentType.DEBIT_CARD]: 'DEBIT_CARD',
      [PaymentType.PIX]: 'PIX',
    }[paymentType];

    await this.orderRepository.update(orderId, { paymentMethod: paymentMethodStr });
  }

  private generateIdempotencyKey(orderId: number, gateway: GatewayName): string {
    return `${gateway}-${orderId}-${randomUUID().substring(0, 8)}`;
  }

  private async findExistingTransaction(idempotencyKey: string): Promise<PaymentTransaction | null> {
    return this.transactionRepository.findOne({
      where: { idempotencyKey },
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
  ): Promise<void> {
    const gatewayStatus = response.status ?? '';
    let status: PaymentTransactionStatus;

    if (this.isApprovedStatus(gatewayStatus)) {
      status = 'approved';
    } else if (this.isRejectedStatus(gatewayStatus)) {
      status = 'rejected';
    } else if (this.isPendingStatus(gatewayStatus)) {
      status = 'pending';
    } else {
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
        message: response.message,
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

  private buildResponseFromTransaction(transaction: PaymentTransaction): PaymentGatewayResponse {
    return {
      //validamos esses undefined?
      success: transaction.status === 'approved',
      transactionId: transaction.gatewayPaymentId ?? undefined,
      status: transaction.gatewayStatus ?? undefined,
      code: transaction.statusDetail ?? undefined,
      message: 'Transação já processada anteriormente',
    };
  }

  //um método com duas responsabilidades é aceitavel aqui? Por que sim ou não?
  private async findAndValidateOrder(orderId: number, profileId: number): Promise<Order> {
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
