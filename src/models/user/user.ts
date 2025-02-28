import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Cart } from 'src/models/cart/cart';
import { Profile } from 'src/models/profile/profile';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    name: string;

    @Column({ unique: true, length: 255 })
    username: string;

    @Column({ length: 80 })
    lastname: string;

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

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    profile: Profile;
}