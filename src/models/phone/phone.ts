import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profile/profile';

@Entity('phone')
export class Phone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    profile_id: number;

    @Column({ length: 20 })
    number: string;

    @Column({ length: 20 })
    type: string;

    @Column({ default: false })
    is_primary: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;
} 