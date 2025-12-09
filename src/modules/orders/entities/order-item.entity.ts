import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Order } from './order.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'order_id' })
    orderId: number;
  
    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'order_id' })
    order: Order;
  
    @Column({ name: 'product_id', type: 'int' })
    productId: number;
  
    @Column({ name: 'sku_id', type: 'int' })
    skuId: number;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'int' })
    quantity: number;
  
    @Column({
      name: 'unit_price',
      type: 'numeric',
      precision: 12,
      scale: 2,
    })
    unitPrice: string;
  
    @Column({
      name: 'discount',
      type: 'numeric',
      precision: 12,
      scale: 2,
      default: 0,
    })
    discount: string;
  
    @Column({
      name: 'total',
      type: 'numeric',
      precision: 12,
      scale: 2,
    })
    total: string;
  
    @Column({
      name: 'marketplace_order_item_id',
      type: 'varchar',
      length: 100,
      nullable: true,
    })
    marketplaceOrderItemId: string | null;
  
    @Column({
      name: 'listing_type',
      type: 'varchar',
      length: 100,
      nullable: true,
    })
    listingType: string | null;
  
    @Column({
      name: 'official_store_id',
      type: 'varchar',
      length: 100,
      nullable: true,
    })
    officialStoreId: string | null;
  }
  