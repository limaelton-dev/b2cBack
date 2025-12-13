import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export type PaymentTransactionStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'error';

export type PaymentGatewayName = 'mercadopago' | 'cielo';

export type PaymentMethodType = 'credit-card' | 'debit-card' | 'pix';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'profile_id', nullable: true })
  profileId: number | null;

  @Column({ type: 'varchar', length: 20 })
  gateway: PaymentGatewayName;

  @Column({ type: 'varchar', length: 20 })
  method: PaymentMethodType;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Index()
  @Column({ name: 'idempotency_key', type: 'varchar', length: 100, unique: true })
  idempotencyKey: string;

  @Index()
  @Column({ name: 'gateway_payment_id', type: 'varchar', length: 100, nullable: true })
  gatewayPaymentId: string | null;

  @Column({ type: 'varchar', length: 30 })
  status: PaymentTransactionStatus;

  @Column({ name: 'status_detail', type: 'varchar', length: 100, nullable: true })
  statusDetail: string | null;

  @Column({ name: 'gateway_status', type: 'varchar', length: 50, nullable: true })
  gatewayStatus: string | null;

  @Column({ name: 'request_snapshot', type: 'jsonb', nullable: true })
  requestSnapshot: Record<string, unknown> | null;

  @Column({ name: 'response_snapshot', type: 'jsonb', nullable: true })
  responseSnapshot: Record<string, unknown> | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
