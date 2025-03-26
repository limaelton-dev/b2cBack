import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { Payment } from '../entities/payment.entity';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly configService: ConfigService,
  ) {}
  
  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne(id);
    
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }
    
    return payment;
  }

  async findByOrderId(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    // Validar método de pagamento
    const paymentMethodId = paymentData.paymentMethodId;
    const paymentMethod = await this.paymentRepository.findPaymentMethod(paymentMethodId);
    
    if (!paymentMethod) {
      throw new BadRequestException(`Método de pagamento com ID ${paymentMethodId} não encontrado`);
    }
    
    // Processar pagamento com Mercado Pago ou outro gateway
    // Aqui seria implementada a lógica para processar pagamento com APIs externas
    
    // Criar registro de pagamento
    return this.paymentRepository.create({
      ...paymentData,
      status: 'pending', // Status inicial
    });
  }

  async updateStatus(id: number, status: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne(id);
    
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }
    
    return this.paymentRepository.updateStatus(id, status);
  }

  async getAllPaymentMethods() {
    return this.paymentRepository.findAllPaymentMethods();
  }

  async getPaymentMethod(id: number) {
    const paymentMethod = await this.paymentRepository.findPaymentMethod(id);
    
    if (!paymentMethod) {
      throw new NotFoundException(`Método de pagamento com ID ${id} não encontrado`);
    }
    
    return paymentMethod;
  }
} 