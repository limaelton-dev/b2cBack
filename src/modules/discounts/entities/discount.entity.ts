import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DiscountUnit } from '../../../common/enums/discount-unit.enum';
import { DiscountScope } from '../../../common/enums/discount-scope.enum';
import { DiscountProduct } from './discount-product.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DiscountUnit,
    name: 'unit',
    nullable: true,
  })
  unit: DiscountUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({
    type: 'enum',
    enum: DiscountScope,
    name: 'scope',
    nullable: true,
  })
  scope: DiscountScope;

  @Column({ default: false, nullable: true })
  combinable: boolean;

  @Column({ name: 'min_quantity', nullable: true })
  minQuantity: number;

  @Column({ name: 'first_purchase_only', default: false, nullable: true })
  firstPurchaseOnly: boolean;

  @Column({ name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ name: 'minimum_order_value', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  minimumOrderValue: number;

  @Column({ name: 'percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ name: 'fixed_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedAmount: number;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ name: 'usage_limit', nullable: true })
  usageLimit: number;

  @Column({ name: 'usage_count', default: 0 })
  usageCount: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => DiscountProduct, (discountProduct) => discountProduct.discount)
  discountProducts: DiscountProduct[];

  @OneToMany(() => Order, (order) => order.discount)
  orders: Order[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.coupon)
  orderItems: OrderItem[];
} 