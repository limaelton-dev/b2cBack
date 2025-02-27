import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profile/profile';

@Entity('card')
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    profile_id: number;

    @Column({ length: 16 })
    card_number: string;

    @Column({ length: 100 })
    holder_name: string;

    @Column({ length: 7 })
    expiration_date: string;

    @Column({ default: false })
    is_default: boolean;

    @Column({ length: 20 })
    card_type: string;

    @Column({ length: 4 })
    last_four_digits: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;
} 