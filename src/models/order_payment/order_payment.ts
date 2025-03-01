import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Order } from '../order/order';
import { Card } from '../card/card';

// Enum para métodos de pagamento
export enum PaymentMethod {
    CARD = 'card',
    PIX = 'pix',
    BOLETO = 'boleto'
}

@Entity('order_payment')
export class OrderPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        enumName: 'payment_method'
    })
    payment_method: PaymentMethod;

    @Column({ nullable: true })
    card_id: number;

    @Column({ length: 100, nullable: true })
    pix_txid: string;

    @Column({ type: 'text', nullable: true })
    pix_qrcode: string;

    @Column({ length: 100, nullable: true })
    boleto_code: string;

    @Column({ type: 'text', nullable: true })
    boleto_url: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 50 })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Card, { nullable: true })
    @JoinColumn({ name: 'card_id' })
    card: Card;
} 