import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'transaction_amount', type: 'decimal', precision: 10, scale: 2 })
  transactionAmount: number;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: number;

  @Column({ nullable: true })
  token: string;

  @Column()
  installments: number;

  @Column({ name: 'external_reference', nullable: true })
  externalReference: string;

  @Column({ name: 'payer_email' })
  payerEmail: string;

  @Column({ name: 'payer_identification_type' })
  payerIdentificationType: string;

  @Column({ name: 'payer_identification_number' })
  payerIdentificationNumber: string;

  @Column({ name: 'payer_first_name' })
  payerFirstName: string;

  @Column({ name: 'payer_last_name' })
  payerLastName: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
} 