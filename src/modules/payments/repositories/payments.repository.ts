import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(paymentData);
    return this.paymentRepository.save(payment);
  }

  async createPaymentMethod(paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const paymentMethod = this.paymentMethodRepository.create(paymentMethodData);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['order', 'paymentMethod'],
    });
  }

  async findOne(id: number): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ['order', 'paymentMethod'],
    });
  }

  async findByOrderId(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { orderId },
      relations: ['order', 'paymentMethod'],
    });
  }

  async findByExternalReference(externalReference: string): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { externalReference },
      relations: ['order', 'paymentMethod'],
    });
  }

  async findAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find();
  }

  async findPaymentMethod(id: number): Promise<PaymentMethod> {
    return this.paymentMethodRepository.findOne({
      where: { id },
    });
  }

  async findPaymentMethodByName(name: string): Promise<PaymentMethod> {
    return this.paymentMethodRepository.findOne({
      where: { name },
    });
  }

  async updateStatus(id: number, status: string): Promise<Payment> {
    await this.paymentRepository.update(id, { status });
    return this.findOne(id);
  }

  async update(id: number, paymentData: Partial<Payment>): Promise<Payment> {
    await this.paymentRepository.update(id, paymentData);
    return this.findOne(id);
  }

  async updatePaymentMethod(id: number, paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    await this.paymentMethodRepository.update(id, paymentMethodData);
    return this.findPaymentMethod(id);
  }

  async remove(id: number): Promise<void> {
    await this.paymentRepository.delete(id);
  }

  async removePaymentMethod(id: number): Promise<void> {
    await this.paymentMethodRepository.delete(id);
  }
} 