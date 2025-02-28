import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profile/profile';

@Entity('profile_pf')
export class ProfilePF {
    @PrimaryColumn()
    profile_id: number;

    @Column({ length: 100, nullable: true })
    full_name: string;

    @Column({ length: 14, nullable: true })
    cpf: string;

    @Column({ type: 'date', nullable: true })
    birth_date: Date;

    @Column({ length: 20, nullable: true })
    gender: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;
} 