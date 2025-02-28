import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Cart } from 'src/models/cart/cart';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    name: string;

    @Column({ length: 80 })
    lastname: string;

    @Column({ length: 80 })
    username: string;

    @Column({ unique: true, length: 100 })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
    cart: Cart;
}