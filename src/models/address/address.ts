import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profile/profile';

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    profile_id: number;

    @Column({ length: 100 })
    street: string;

    @Column({ length: 20 })
    number: string;

    @Column({ length: 100, nullable: true })
    complement: string;

    @Column({ length: 100 })
    neighborhood: string;

    @Column({ length: 100 })
    city: string;

    @Column({ length: 50 })
    state: string;

    @Column({ length: 20 })
    postal_code: string;

    @Column({ default: false })
    is_default: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;
} 