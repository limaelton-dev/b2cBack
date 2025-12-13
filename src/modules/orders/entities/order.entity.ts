import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { Profile } from '../../profile/entities/profile.entity';

export type OrderStatus =
  | 'INCOMPLETE'
  | 'PENDING'
  | 'DELIVERY_ISSUE'
  | 'WAITING_PAYMENT'
  | 'PAID_WAITING_SHIP'
  | 'INVOICED'
  | 'PAID_WAITING_DELIVERY'
  | 'IN_TRANSIT'
  | 'CONCLUDED'
  | 'CANCELED';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id', nullable: true })
  profileId: number | null;

  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile | null;

  @Column({
    name: 'anymarket_order_id',
    type: 'int',
    nullable: true,
    unique: true,
  })
  anymarketOrderId: number | null;

  @Column({
    name: 'partner_order_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  partnerOrderId: string | null;

  @Column({
    name: 'checkout_key',
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
  })
  checkoutKey: string | null;

  @Column({ type: 'varchar', length: 50 })
  marketplace: string;

  @Column({
    name: 'marketplace_order_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  marketplaceOrderId: string | null;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status: OrderStatus;

  @Column({
    name: 'items_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  itemsTotal: string;

  @Column({
    name: 'shipping_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  shippingTotal: string;

  @Column({
    name: 'discount_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  discountTotal: string;

  @Column({
    name: 'grand_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  grandTotal: string;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
  })
  paymentMethod: string;

  @Column({
    name: 'installments',
    type: 'int',
    nullable: true,
  })
  installments: number | null;

  @Column({
    name: 'shipping_carrier',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  shippingCarrier: string | null;

  @Column({
    name: 'shipping_service',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  shippingService: string | null;

  @Column({
    name: 'shipping_estimated_delivery_date',
    type: 'timestamp',
    nullable: true,
  })
  shippingEstimatedDeliveryDate: Date | null;

  @Column({
    name: 'shipping_tracking_code',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  shippingTrackingCode: string | null;

  @Column({
    name: 'anymarket_raw_payload',
    type: 'jsonb',
    nullable: true,
  })
  anymarketRawPayload: unknown | null;

  @Column({
    name: 'extra_data',
    type: 'jsonb',
    nullable: true,
  })
  extraData: unknown | null;

  @Column({
    name: 'anymarket_created_at',
    type: 'timestamp',
    nullable: true,
  })
  anymarketCreatedAt: Date | null;

  @Column({
    name: 'anymarket_updated_at',
    type: 'timestamp',
    nullable: true,
  })
  anymarketUpdatedAt: Date | null;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @OneToMany(
    () => OrderStatusHistory,
    (orderStatusHistory) => orderStatusHistory.order,
    {
      cascade: true,
    },
  )
  statusHistory: OrderStatusHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
