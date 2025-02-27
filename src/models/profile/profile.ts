import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from 'src/models/user/user';
import { ProfilePF } from '../profile_pf/profile_pf';
import { ProfilePJ } from '../profile_pj/profile_pj';

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ length: 2 })
    profile_type: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => ProfilePF, profilePF => profilePF.profile, { cascade: true })
    profilePF: ProfilePF;

    @OneToOne(() => ProfilePJ, profilePJ => profilePJ.profile, { cascade: true })
    profilePJ: ProfilePJ;
} 