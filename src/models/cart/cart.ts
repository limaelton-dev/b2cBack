import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { Profile } from 'src/models/profile/profile';

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Profile)
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @Column({ type: 'jsonb' })
    cart_data: any;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}