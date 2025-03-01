import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Profile } from '../profile/profile';
import { Address } from '../address/address';
import { OrderItem } from '../order_item/order_item';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    profile_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column({ length: 20 })
    status: string;

    @Column()
    address_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @ManyToOne(() => Address)
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    items: OrderItem[];
} 