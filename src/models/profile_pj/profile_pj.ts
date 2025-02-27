import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profile/profile';

@Entity('profile_pj')
export class ProfilePJ {
    @PrimaryColumn()
    profile_id: number;

    @Column({ length: 100, nullable: true })
    company_name: string;

    @Column({ length: 100, nullable: true })
    trading_name: string;

    @Column({ length: 18, nullable: true })
    cnpj: string;

    @Column({ length: 30, nullable: true })
    state_registration: string;

    @Column({ length: 30, nullable: true })
    municipal_registration: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;
} 