import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Order, OrderStatus } from './order.entity';
  
  export type OrderStatusChangeSource =
    | 'ANYMARKET'
    | 'SYSTEM'
    | 'MARKETPLACE'
    | 'USER';
  
  @Entity('order_status_history')
  export class OrderStatusHistory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'order_id' })
    orderId: number;
  
    @ManyToOne(() => Order, (order) => order.statusHistory)
    @JoinColumn({ name: 'order_id' })
    order: Order;
  
    @Column({
      type: 'varchar',
      length: 50,
    })
    status: OrderStatus;
  
    @Column({
      type: 'varchar',
      length: 50,
    })
    source: OrderStatusChangeSource;
  
    @Column({
      type: 'varchar',
      length: 255,
      nullable: true,
    })
    description: string | null;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  