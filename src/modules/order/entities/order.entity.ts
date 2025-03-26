import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Discount } from '../../discount/entities/discount.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { OrderStatus } from '../../../common/enums/order-status.enum';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    name: 'status',
  })
  status: OrderStatus;

  @Column({ name: 'full_address', type: 'text' })
  fullAddress: string;

  @Column({ name: 'discount_id', nullable: true })
  discountId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.order)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Discount, (discount) => discount.order, { nullable: true })
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payment: Payment[];
} 