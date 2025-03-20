import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { Payment } from '../entities/payment.entity';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly configService: ConfigService,
  ) {}
  
  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.findAll();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne(id);
    
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }
    
    return payment;
  }

  async findByOrderId(orderId: number): Promise<Payment[]> {
    return this.paymentsRepository.findByOrderId(orderId);
  }

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    // Validar método de pagamento
    const paymentMethodId = paymentData.paymentMethodId;
    const paymentMethod = await this.paymentsRepository.findPaymentMethod(paymentMethodId);
    
    if (!paymentMethod) {
      throw new BadRequestException(`Método de pagamento com ID ${paymentMethodId} não encontrado`);
    }
    
    // Processar pagamento com Mercado Pago ou outro gateway
    // Aqui seria implementada a lógica para processar pagamento com APIs externas
    
    // Criar registro de pagamento
    return this.paymentsRepository.create({
      ...paymentData,
      status: 'pending', // Status inicial
    });
  }

  async updateStatus(id: number, status: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne(id);
    
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }
    
    return this.paymentsRepository.updateStatus(id, status);
  }

  async getAllPaymentMethods() {
    return this.paymentsRepository.findAllPaymentMethods();
  }

  async getPaymentMethod(id: number) {
    const paymentMethod = await this.paymentsRepository.findPaymentMethod(id);
    
    if (!paymentMethod) {
      throw new NotFoundException(`Método de pagamento com ID ${id} não encontrado`);
    }
    
    return paymentMethod;
  }
} 