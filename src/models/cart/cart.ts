import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from 'src/models/user/user';

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.cart)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'jsonb' })
    cart_data: any;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}