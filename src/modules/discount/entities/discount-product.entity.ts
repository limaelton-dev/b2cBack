import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Discount } from './discount.entity';

@Entity('discount_product')
export class DiscountProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discount_id' })
  discountId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Discount, (discount) => discount.discountProduct)
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

} 